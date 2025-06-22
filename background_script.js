// 功能开关配置
const FEATURE_FLAGS = {
  // 跨页面对话框互斥功能（可以通过这个开关快速启用/禁用）
  CROSS_TAB_DIALOG_MUTEX: false, // 设为 false 暂时禁用跨页面互斥
  
  // 同页面对话框互斥功能（保持启用）
  SAME_PAGE_DIALOG_MUTEX: true,
  
  // 调试日志开关
  DEBUG_LOGGING: true
};

// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveToNotion",
    title: chrome.i18n.getMessage('contextMenuSave') || "保存笔记",
    contexts: ["selection"]
  });
  
  // 初始化时清理全局状态（防止扩展重启后状态不一致）
  initializeGlobalDialogState();
});

// 右键菜单状态管理
let contextMenuState = {
  disabled: false,
  currentDialogType: null
};

// 全局弹窗状态管理（跨标签页）- 现在使用持久化存储
let globalDialogState = {
  isAnyDialogOpen: false,
  currentDialogType: null, // 'save' | 'quickNote' | null
  activeTabId: null,
  activeTabTitle: null,
  activeTabUrl: null
};

// 添加超时保护：如果对话框状态持续太久，自动清理
let dialogTimeoutId = null;

// 扩展启动时立即初始化状态（无论是首次安装还是重新启动）
// 这确保了在任何情况下都会恢复全局状态
(async () => {
  try {
    console.log('🌐 [立即初始化] 背景脚本启动，初始化全局状态');
    await initializeGlobalDialogState();
  } catch (error) {
    console.error('🌐 [立即初始化] 初始化失败:', error);
  }
})();

// 初始化全局弹窗状态
async function initializeGlobalDialogState() {
  try {
    // 如果跨页面互斥功能被禁用，只进行简单初始化
    if (!FEATURE_FLAGS.CROSS_TAB_DIALOG_MUTEX) {
      if (FEATURE_FLAGS.DEBUG_LOGGING) {
        console.log('🌐 [启动] 跨页面互斥功能已禁用，使用简单初始化');
      }
      globalDialogState = {
        isAnyDialogOpen: false,
        currentDialogType: null,
        activeTabId: null,
        activeTabTitle: null,
        activeTabUrl: null
      };
      return;
    }
    
    // 从Chrome存储中恢复状态
    const stored = await chrome.storage.local.get(['globalDialogState']);
    if (stored.globalDialogState) {
      globalDialogState = { ...globalDialogState, ...stored.globalDialogState };
      if (FEATURE_FLAGS.DEBUG_LOGGING) {
        console.log('🌐 [启动] 恢复全局弹窗状态:', globalDialogState);
      }
      
      // 验证恢复的标签页是否仍然有效
      if (globalDialogState.activeTabId) {
        try {
          await chrome.tabs.get(globalDialogState.activeTabId);
          if (FEATURE_FLAGS.DEBUG_LOGGING) {
            console.log('🌐 [启动] 活动标签页仍然有效:', globalDialogState.activeTabId);
          }
        } catch (error) {
          if (FEATURE_FLAGS.DEBUG_LOGGING) {
            console.log('🌐 [启动] 活动标签页已失效，清理状态:', globalDialogState.activeTabId);
          }
          // 标签页不存在，清理状态
          await clearGlobalDialogState();
        }
      }
    } else {
      if (FEATURE_FLAGS.DEBUG_LOGGING) {
        console.log('🌐 [启动] 未找到存储的全局状态，使用默认状态');
      }
      // 确保存储中有初始状态
      await saveGlobalDialogState();
    }
  } catch (error) {
    console.error('🌐 [启动] 初始化全局状态失败:', error);
    // 出错时清理状态
    await clearGlobalDialogState();
  }
}

// 保存全局弹窗状态到Chrome存储
async function saveGlobalDialogState() {
  try {
    await chrome.storage.local.set({ globalDialogState: globalDialogState });
    console.log('🌐 [存储] 保存全局弹窗状态:', globalDialogState);
  } catch (error) {
    console.error('🌐 [存储] 保存全局状态失败:', error);
  }
}

// 清理全局弹窗状态
async function clearGlobalDialogState() {
  // 清除超时定时器
  if (dialogTimeoutId) {
    clearTimeout(dialogTimeoutId);
    dialogTimeoutId = null;
    console.log('⏰ [清理] 已清除对话框超时定时器');
  }
  
  globalDialogState = {
    isAnyDialogOpen: false,
    currentDialogType: null,
    activeTabId: null,
    activeTabTitle: null,
    activeTabUrl: null
  };
  await saveGlobalDialogState();
  console.log('🌐 [清理] 全局弹窗状态已清理');
}

// 更新全局弹窗状态
async function updateGlobalDialogState(isOpen, dialogType = null, tabId = null, tabTitle = null, tabUrl = null) {
  globalDialogState.isAnyDialogOpen = isOpen;
  globalDialogState.currentDialogType = dialogType;
  globalDialogState.activeTabId = tabId;
  globalDialogState.activeTabTitle = tabTitle;
  globalDialogState.activeTabUrl = tabUrl;
  
  // 只有在跨页面互斥功能启用时才持久化到存储
  if (FEATURE_FLAGS.CROSS_TAB_DIALOG_MUTEX) {
    await saveGlobalDialogState();
  }
  
  if (FEATURE_FLAGS.DEBUG_LOGGING) {
    console.log('🌐 [全局状态] 更新弹窗状态:', {
      isOpen,
      dialogType,
      tabId,
      tabTitle: tabTitle?.substring(0, 50) + (tabTitle?.length > 50 ? '...' : ''),
      tabUrl: tabUrl?.substring(0, 100) + (tabUrl?.length > 100 ? '...' : ''),
      persistToStorage: FEATURE_FLAGS.CROSS_TAB_DIALOG_MUTEX
    });
  }
}

// 启动时初始化状态
chrome.runtime.onStartup.addListener(() => {
  console.log('🌐 [启动] Chrome扩展启动，初始化全局状态');
  initializeGlobalDialogState();
});

// 标签页关闭时清理相关状态
chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  // 只有在跨页面互斥功能启用时才处理
  if (!FEATURE_FLAGS.CROSS_TAB_DIALOG_MUTEX) {
    return;
  }
  
  if (globalDialogState.activeTabId === tabId) {
    if (FEATURE_FLAGS.DEBUG_LOGGING) {
      console.log('🌐 [标签页] 活动标签页被关闭，清理全局状态:', tabId);
    }
    await clearGlobalDialogState();
  }
});

// 标签页更新时检查状态一致性
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // 只有在跨页面互斥功能启用时才处理
  if (!FEATURE_FLAGS.CROSS_TAB_DIALOG_MUTEX) {
    return;
  }
  
  // 只在标签页完全加载后检查
  if (changeInfo.status === 'complete' && globalDialogState.activeTabId === tabId) {
    // 更新标签页标题（如果有变化）
    if (tab.title !== globalDialogState.activeTabTitle) {
      if (FEATURE_FLAGS.DEBUG_LOGGING) {
        console.log('🌐 [标签页] 更新活动标签页标题:', tab.title);
      }
      globalDialogState.activeTabTitle = tab.title;
      await saveGlobalDialogState();
    }
  }
  
  // 如果标签页导航到新URL，这可能意味着页面重新加载或导航
  // 在这种情况下，我们应该清理对话框状态
  if (changeInfo.url && globalDialogState.activeTabId === tabId) {
    if (FEATURE_FLAGS.DEBUG_LOGGING) {
      console.log('🌐 [标签页] 活动标签页导航到新URL，清理状态:', changeInfo.url);
    }
    await clearGlobalDialogState();
  }
});

// 标签页激活时验证状态一致性
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  // 只有在跨页面互斥功能启用时才处理
  if (!FEATURE_FLAGS.CROSS_TAB_DIALOG_MUTEX) {
    return;
  }
  
  // 如果有全局状态但活动标签页不匹配，可能存在状态不一致
  if (globalDialogState.isAnyDialogOpen && 
      globalDialogState.activeTabId !== activeInfo.tabId) {
    if (FEATURE_FLAGS.DEBUG_LOGGING) {
      console.log('🔍 [标签页激活] 检查全局状态一致性');
    }
    
    try {
      // 尝试获取记录的活动标签页信息
      const activeTab = await chrome.tabs.get(globalDialogState.activeTabId);
      if (FEATURE_FLAGS.DEBUG_LOGGING) {
        console.log('🔍 [标签页激活] 全局状态中的标签页仍然存在:', activeTab.id);
      }
    } catch (error) {
      if (FEATURE_FLAGS.DEBUG_LOGGING) {
        console.log('🌐 [标签页激活] 全局状态中的标签页不存在，清理状态');
      }
      await clearGlobalDialogState();
    }
  }
});

// 窗口关闭时清理相关状态
chrome.windows.onRemoved.addListener(async (windowId) => {
  // 只有在跨页面互斥功能启用时才处理
  if (!FEATURE_FLAGS.CROSS_TAB_DIALOG_MUTEX) {
    return;
  }
  
  if (globalDialogState.isAnyDialogOpen) {
    try {
      // 检查活动标签页是否属于被关闭的窗口
      const activeTab = await chrome.tabs.get(globalDialogState.activeTabId);
      if (activeTab.windowId === windowId) {
        if (FEATURE_FLAGS.DEBUG_LOGGING) {
          console.log('🌐 [窗口] 包含活动对话框的窗口被关闭，清理状态');
        }
        await clearGlobalDialogState();
      }
    } catch (error) {
      // 如果无法获取标签页信息，说明标签页已经不存在
      if (FEATURE_FLAGS.DEBUG_LOGGING) {
        console.log('🌐 [窗口] 无法访问活动标签页，清理状态');
      }
      await clearGlobalDialogState();
    }
  }
});

// 定期检查状态一致性（每30秒检查一次）
setInterval(async () => {
  // 只有在跨页面互斥功能启用时才处理
  if (!FEATURE_FLAGS.CROSS_TAB_DIALOG_MUTEX) {
    return;
  }
  
  if (globalDialogState.isAnyDialogOpen && globalDialogState.activeTabId) {
    try {
      await chrome.tabs.get(globalDialogState.activeTabId);
      // 标签页存在，状态可能是正常的
      if (FEATURE_FLAGS.DEBUG_LOGGING) {
        console.log('🔄 [定期检查] 全局状态正常');
      }
    } catch (error) {
      if (FEATURE_FLAGS.DEBUG_LOGGING) {
        console.log('🌐 [定期检查] 检测到孤立状态，自动清理');
      }
      await clearGlobalDialogState();
    }
  }
}, 30000); // 30秒检查一次

// 增强的更新全局弹窗状态函数
async function updateGlobalDialogStateWithTimeout(isOpen, dialogType = null, tabId = null, tabTitle = null, tabUrl = null) {
  await updateGlobalDialogState(isOpen, dialogType, tabId, tabTitle, tabUrl);
  
  // 清除之前的超时
  if (dialogTimeoutId) {
    clearTimeout(dialogTimeoutId);
    dialogTimeoutId = null;
  }
  
  // 如果打开对话框，设置超时保护（30分钟后自动清理）
  if (isOpen) {
    dialogTimeoutId = setTimeout(async () => {
      console.log('⏰ [超时保护] 对话框状态超时，自动清理');
      await clearGlobalDialogState();
      dialogTimeoutId = null;
    }, 30 * 60 * 1000); // 30分钟
    console.log('⏰ [超时保护] 已设置30分钟超时保护');
  }
}

// 检查是否可以在指定标签页打开弹窗
function canOpenDialogInTab(requestTabId, dialogType) {
  // 如果跨页面互斥功能被禁用，只检查同页面互斥
  if (!FEATURE_FLAGS.CROSS_TAB_DIALOG_MUTEX) {
    // 只在同一标签页内进行互斥检查
    if (globalDialogState.isAnyDialogOpen && globalDialogState.activeTabId === requestTabId) {
      if (!FEATURE_FLAGS.SAME_PAGE_DIALOG_MUTEX) {
        return { canOpen: true }; // 如果同页面互斥也被禁用，总是允许
      }
      
      // 同页面内的互斥逻辑
      if (globalDialogState.currentDialogType === dialogType) {
        return {
          canOpen: false,
          reason: getDialogAlreadyOpenMessage(dialogType),
          isGlobalBlock: false,
          isSamePage: true,
          isSilent: dialogType === 'quickNote' // Quick Note重复调用时静默处理
        };
      } else {
        return {
          canOpen: false,
          reason: getDialogConflictMessage(globalDialogState.currentDialogType, dialogType),
          isGlobalBlock: false,
          isSamePage: true,
          isSilent: false
        };
      }
    }
    
    // 不是同一标签页或没有活动对话框，允许打开
    return { canOpen: true };
  }
  
  // === 以下是完整的跨页面互斥逻辑（当功能开关启用时） ===
  
  // 如果没有任何弹窗打开，允许打开
  if (!globalDialogState.isAnyDialogOpen) {
    return { canOpen: true };
  }
  
  // 如果是同一个标签页
  if (globalDialogState.activeTabId === requestTabId) {
    if (!FEATURE_FLAGS.SAME_PAGE_DIALOG_MUTEX) {
      return { canOpen: true }; // 如果同页面互斥被禁用，允许打开
    }
    
    // 同页面内的互斥逻辑
    if (globalDialogState.currentDialogType === dialogType) {
      return {
        canOpen: false,
        reason: getDialogAlreadyOpenMessage(dialogType),
        isGlobalBlock: false,
        isSamePage: true,
        isSilent: dialogType === 'quickNote' // Quick Note重复调用时静默处理
      };
    } else {
      return {
        canOpen: false,
        reason: getDialogConflictMessage(globalDialogState.currentDialogType, dialogType),
        isGlobalBlock: false,
        isSamePage: true,
        isSilent: false
      };
    }
  } else {
    // 不同标签页，全局阻止
    return {
      canOpen: false,
      reason: getGlobalBlockMessage(globalDialogState.currentDialogType, globalDialogState.activeTabTitle),
      isGlobalBlock: true,
      isSamePage: false,
      activeTabId: globalDialogState.activeTabId,
      activeTabTitle: globalDialogState.activeTabTitle,
      activeTabUrl: globalDialogState.activeTabUrl,
      isSilent: false
    };
  }
}

// 获取弹窗已打开的消息
function getDialogAlreadyOpenMessage(dialogType) {
  if (dialogType === 'save') {
    return chrome.i18n.getMessage('saveDialogAlreadyOpen') || '已有保存对话框打开，请先关闭后再试';
  } else if (dialogType === 'quickNote') {
    return chrome.i18n.getMessage('quickNoteDialogAlreadyOpen') || '已有快速笔记对话框打开，请先关闭后再试';
  }
  return chrome.i18n.getMessage('dialogAlreadyOpen') || '已有对话框打开，请先关闭后再试';
}

// 获取弹窗冲突的消息
function getDialogConflictMessage(activeType, requestType) {
  if (activeType === 'save' && requestType === 'quickNote') {
    return chrome.i18n.getMessage('quickNoteBlockedBySave') || '无法打开快速笔记：保存对话框正在使用中';
  } else if (activeType === 'quickNote' && requestType === 'save') {
    return chrome.i18n.getMessage('saveBlockedByQuickNote') || '无法打开保存对话框：快速笔记正在使用中';
  }
  return chrome.i18n.getMessage('dialogConflict') || '无法打开：其他对话框正在使用中';
}

// 获取全局阻止的消息
function getGlobalBlockMessage(activeDialogType, activeTabTitle) {
  // 使用国际化消息获取对话框类型名称
  const dialogTypeName = activeDialogType === 'save' 
    ? (chrome.i18n.getMessage('saveDialogTitle') || '保存笔记')
    : (chrome.i18n.getMessage('quickNoteTitle') || '快速笔记');
  
  console.log('🌐 [全局阻止] 生成消息:', { activeDialogType, dialogTypeName });
  
  // 使用Chrome扩展的国际化消息系统（现在只需要对话框类型名称）
  const i18nMessage = chrome.i18n.getMessage('globalDialogBlock', [dialogTypeName]);
  if (i18nMessage) {
    console.log('🌐 [全局阻止] 使用国际化消息:', i18nMessage);
    return i18nMessage;
  }
  
  // 回退到默认消息
  const fallbackMessage = `Phoebe使用中：${dialogTypeName}正在另一个标签页运行`;
  console.log('🌐 [全局阻止] 使用回退消息:', fallbackMessage);
  return fallbackMessage;
}

// 更新右键菜单状态
function updateContextMenuState(disabled, dialogType = null) {
  contextMenuState.disabled = disabled;
  contextMenuState.currentDialogType = dialogType;
  
  console.log(`🔄 [右键菜单] 更新状态: disabled=${disabled}, dialogType=${dialogType}`);
  
  // 更新右键菜单标题以反映当前状态
  let title;
  let enabled = true; // 默认启用右键菜单
  
  if (disabled) {
    if (dialogType === 'quickNote') {
      title = chrome.i18n.getMessage('contextMenuDisabledQuickNote') || "保存笔记 (快速笔记使用中)";
      // 注意：这里不再禁用菜单，因为跨页面冲突时应该允许点击但显示跳转提示
    } else if (dialogType === 'save') {
      title = chrome.i18n.getMessage('contextMenuDisabledSave') || "保存笔记 (保存对话框使用中)";
    } else {
      title = chrome.i18n.getMessage('contextMenuDisabled') || "保存笔记 (有对话框在使用中)";
    }
  } else {
    title = chrome.i18n.getMessage('contextMenuSave') || "保存笔记";
  }
  
  chrome.contextMenus.update("saveToNotion", {
    title: title,
    enabled: enabled // 始终启用右键菜单
  });
}

// 处理快捷键事件
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'quick-note') {
    try {
      // 获取当前活动标签页
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!activeTab) {
        console.log('未找到活动标签页');
        return;
      }

      // 检查全局弹窗状态
      const checkResult = canOpenDialogInTab(activeTab.id, 'quickNote');
      if (!checkResult.canOpen) {
        if (FEATURE_FLAGS.DEBUG_LOGGING) {
          console.log(`🚫 [快捷键] 快速笔记被阻止: ${checkResult.reason}, 静默: ${checkResult.isSilent}`);
        }
        
        // 如果是静默模式（同页面Quick Note重复调用），直接返回不显示提示
        if (checkResult.isSilent) {
          if (FEATURE_FLAGS.DEBUG_LOGGING) {
            console.log('🔇 [快捷键] 静默忽略重复的快速笔记调用');
          }
          return;
        }
        
        // 发送阻止提示消息
        if (checkResult.isGlobalBlock) {
          // 跨页面阻止，显示可跳转的"Phoebe正忙碌中"风格的提示
          chrome.tabs.sendMessage(activeTab.id, {
            action: "showPhoebeWorkingNotificationWithJump",
            message: checkResult.reason,
            activeTabId: checkResult.activeTabId,
            activeTabTitle: checkResult.activeTabTitle,
            activeTabUrl: checkResult.activeTabUrl
          });
        } else {
          // 同页面阻止，显示普通错误提示
          chrome.tabs.sendMessage(activeTab.id, {
            action: "showError",
            message: checkResult.reason
          });
        }
        return;
      }
      
      // 检查配置
      const config = await chrome.storage.sync.get(['notionToken', 'mode', 'targetPageId', 'targetDatabaseId', 'databaseId']);
      
      if (!config.notionToken) {
        chrome.tabs.sendMessage(activeTab.id, {
          action: "showError",
          message: chrome.i18n.getMessage('errorNotConfigured') || "请先在插件设置中配置Notion API密钥"
        });
        return;
      }
      
      const mode = config.mode || 'database'; // 默认数据库模式，兼容旧配置
      
      // 根据模式检查必要的配置
      if (mode === 'page' && !config.targetPageId) {
        chrome.tabs.sendMessage(activeTab.id, {
          action: "showError",
          message: chrome.i18n.getMessage('pageModeRequiresTargetPage') || "页面模式需要先在设置中配置目标页面"
        });
        return;
      } else if (mode === 'database') {
        const databaseId = config.targetDatabaseId || config.databaseId; // 兼容旧配置
        if (!databaseId) {
          chrome.tabs.sendMessage(activeTab.id, {
            action: "showError",
            message: chrome.i18n.getMessage('databaseModeRequiresTargetDatabase') || "数据库模式需要先在设置中配置目标数据库"
          });
          return;
        }
      }
      
      // 发送快速笔记事件到内容脚本
      chrome.tabs.sendMessage(activeTab.id, {
        action: "showQuickNote",
        data: {
          url: activeTab.url,
          title: activeTab.title,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('处理快捷键事件失败:', error);
    }
  }
});

// 处理右键菜单点击
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "saveToNotion") {
    // 检查全局弹窗状态
    const checkResult = canOpenDialogInTab(tab.id, 'save');
    if (!checkResult.canOpen) {
      if (FEATURE_FLAGS.DEBUG_LOGGING) {
        console.log(`🚫 [右键菜单] 保存功能被阻止: ${checkResult.reason}, 静默: ${checkResult.isSilent}`);
      }
      
      // 如果是静默模式，直接返回不显示提示
      if (checkResult.isSilent) {
        if (FEATURE_FLAGS.DEBUG_LOGGING) {
          console.log('🔇 [右键菜单] 静默忽略重复的保存调用');
        }
        return;
      }
      
      // 发送阻止提示消息
      if (checkResult.isGlobalBlock) {
        // 跨页面阻止，显示可跳转的"Phoebe正忙碌中"风格的提示
        chrome.tabs.sendMessage(tab.id, {
          action: "showPhoebeWorkingNotificationWithJump",
          message: checkResult.reason,
          activeTabId: checkResult.activeTabId,
          activeTabTitle: checkResult.activeTabTitle,
          activeTabUrl: checkResult.activeTabUrl
        });
      } else {
        // 同页面阻止，显示普通错误提示
        chrome.tabs.sendMessage(tab.id, {
          action: "showError",
          message: checkResult.reason
        });
      }
      return;
    }
    
    const selectedText = info.selectionText;
    const url = tab.url;
    const title = tab.title;
    
    // 检查新的配置系统
    const config = await chrome.storage.sync.get(['notionToken', 'mode', 'targetPageId', 'targetDatabaseId', 'databaseId']);
    
    console.log('右键菜单：获取配置', config);
    
    if (!config.notionToken) {
      chrome.tabs.sendMessage(tab.id, {
        action: "showError",
        message: chrome.i18n.getMessage('errorNotConfigured') || "请先在插件设置中配置Notion API密钥"
      });
      return;
    }
    
    const mode = config.mode || 'database'; // 默认数据库模式，兼容旧配置
    
    // 根据模式检查必要的配置
    if (mode === 'page' && !config.targetPageId) {
      chrome.tabs.sendMessage(tab.id, {
        action: "showError",
        message: chrome.i18n.getMessage('pageModeRequiresTargetPage') || "页面模式需要先在设置中配置目标页面"
      });
      return;
    } else if (mode === 'database') {
      const databaseId = config.targetDatabaseId || config.databaseId; // 兼容旧配置
      if (!databaseId) {
        chrome.tabs.sendMessage(tab.id, {
          action: "showError",
          message: chrome.i18n.getMessage('databaseModeRequiresTargetDatabase') || "数据库模式需要先在设置中配置目标数据库"
        });
        return;
      }
    }
    
    // 发送到内容脚本处理
    chrome.tabs.sendMessage(tab.id, {
      action: "saveToNotion",
      data: {
        content: selectedText,
        url: url,
        title: title,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveToNotionAPI") {
    // 使用立即调用的异步函数来处理
    (async () => {
      try {
        console.log('收到保存请求:', request.data);
        const config = await chrome.storage.sync.get(['notionToken', 'mode', 'targetPageId', 'targetDatabaseId', 'databaseId']);
        console.log('获取配置:', config);
        
        if (!config.notionToken) {
          throw new Error(chrome.i18n.getMessage('errorNotConfigured') || '未找到配置，请先设置API密钥');
        }
        
        const mode = config.mode || 'database'; // 默认数据库模式，兼容旧配置
        
        // 根据模式检查必要的配置
        if (mode === 'page' && !config.targetPageId) {
          throw new Error(chrome.i18n.getMessage('pageModeNeedsConfig') || '页面模式需要配置目标页面');
        } else if (mode === 'database') {
          const databaseId = config.targetDatabaseId || config.databaseId; // 兼容旧配置
          if (!databaseId) {
            throw new Error(chrome.i18n.getMessage('databaseModeNeedsConfig') || '数据库模式需要配置目标数据库');
          }
          // 更新config中的databaseId以便saveToNotion函数使用
          config.databaseId = databaseId;
        }
        
        const result = await saveToNotion(request.data, config);
        sendResponse({ success: true, result });
      } catch (error) {
        console.error('保存失败:', error);
        sendResponse({ success: false, error: error.message });
      }
    })();
    
    return true; // 保持消息通道开启
  } else if (request.action === "getDatabasePages") {
    // 获取Database下的Page列表
    (async () => {
      try {
        const config = await chrome.storage.sync.get(['notionToken', 'mode', 'targetDatabaseId', 'databaseId']);
        
        if (!config.notionToken) {
          throw new Error('未找到API密钥');
        }
        
        const databaseId = config.targetDatabaseId || config.databaseId; // 兼容旧配置
        if (!databaseId) {
          throw new Error('未找到数据库配置');
        }
        
        // 确保config中包含databaseId字段
        const configWithDatabaseId = {
          ...config,
          databaseId: databaseId
        };
        
        const pages = await getDatabasePages(configWithDatabaseId);
        sendResponse({ success: true, pages });
      } catch (error) {
        console.error('获取页面列表失败:', error);
        sendResponse({ success: false, error: error.message });
      }
    })();
    
    return true;
  } else if (request.action === "createPageInDatabase") {
    // 在Database中创建新Page
    (async () => {
      try {
        const config = await chrome.storage.sync.get(['notionToken', 'mode', 'targetDatabaseId', 'databaseId']);
        
        if (!config.notionToken) {
          throw new Error('未找到API密钥');
        }
        
        const databaseId = config.targetDatabaseId || config.databaseId; // 兼容旧配置
        if (!databaseId) {
          throw new Error('未找到数据库配置');
        }
        
        // 确保config中包含databaseId字段
        const configWithDatabaseId = {
          ...config,
          databaseId: databaseId
        };
        
        const newPage = await createNewPageInDatabase(request.pageTitle, configWithDatabaseId);
        sendResponse({ success: true, page: newPage });
      } catch (error) {
        console.error('创建页面失败:', error);
        sendResponse({ success: false, error: error.message });
      }
    })();
    
    return true;
  } else if (request.action === "saveTagsToHistory") {
    // 保存标签到历史记录
    (async () => {
      try {
        await saveTagsToHistory(request.tags);
        sendResponse({ success: true });
      } catch (error) {
        console.error('保存标签失败:', error);
        sendResponse({ success: false, error: error.message });
      }
    })();
    
    return true;
  } else if (request.action === "getTagHistory") {
    // 获取标签历史
    (async () => {
      try {
        const tags = await getTagHistory();
        sendResponse({ success: true, tags });
      } catch (error) {
        console.error('获取标签历史失败:', error);
        sendResponse({ success: false, error: error.message });
      }
    })();
    
    return true;
  } else if (request.action === "updateContextMenuState") {
    // 更新右键菜单状态
    updateContextMenuState(request.disabled, request.dialogType);
    sendResponse({ success: true });
    return true;
  } else if (request.action === "updateGlobalDialogState") {
    // 更新全局弹窗状态
    (async () => {
      try {
        await updateGlobalDialogStateWithTimeout(
          request.isOpen, 
          request.dialogType, 
          sender.tab?.id, 
          sender.tab?.title, 
          sender.tab?.url
        );
        // 同时更新右键菜单状态以保持兼容
        updateContextMenuState(request.isOpen, request.dialogType);
        sendResponse({ success: true });
      } catch (error) {
        console.error('更新全局弹窗状态失败:', error);
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true;
  } else if (request.action === "switchToTab") {
    // 跳转到指定标签页
    try {
      if (request.tabId) {
        chrome.tabs.update(request.tabId, { active: true }, (tab) => {
          if (chrome.runtime.lastError) {
            console.error('切换标签页失败:', chrome.runtime.lastError);
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
          } else if (tab) {
            // 也要切换到该标签页所在的窗口
            chrome.windows.update(tab.windowId, { focused: true }, () => {
              if (chrome.runtime.lastError) {
                console.log('切换窗口焦点失败:', chrome.runtime.lastError);
              }
              sendResponse({ success: true });
            });
          } else {
            sendResponse({ success: false, error: '标签页不存在' });
          }
        });
      } else {
        sendResponse({ success: false, error: '无效的标签页ID' });
      }
    } catch (error) {
      console.error('跳转标签页出错:', error);
      sendResponse({ success: false, error: error.message });
    }
    return true;
  } else if (request.action === "getI18nTexts") {
    // 获取常用的本地化文本供content script使用
    const texts = {
      saveDialogTitle: chrome.i18n.getMessage('saveDialogTitle') || '保存笔记',
      saveDialogContent: chrome.i18n.getMessage('saveDialogContent') || '选中内容:',
      saveDialogNote: chrome.i18n.getMessage('saveDialogNote') || '备注 (必填):',
      saveDialogNotePlaceholder: chrome.i18n.getMessage('saveDialogNotePlaceholder') || '请输入笔记内容（必填）...',
      saveDialogTags: chrome.i18n.getMessage('saveDialogTags') || '标签 (可选):',
      saveDialogTagsPlaceholder: chrome.i18n.getMessage('saveDialogTagsPlaceholder') || '输入标签，回车添加，或从下拉列表选择',
      buttonCancel: chrome.i18n.getMessage('buttonCancel') || '取消',
      buttonSave: chrome.i18n.getMessage('buttonSave') || '保存',
      buttonSaving: chrome.i18n.getMessage('buttonSaving') || '保存中...',
      saveSuccess: chrome.i18n.getMessage('saveSuccess') || '笔记保存成功!',
      saveFailed: chrome.i18n.getMessage('saveFailed') || '保存失败',
      errorNetwork: chrome.i18n.getMessage('errorNetwork') || '未知错误，请检查网络连接',
      // 新增的国际化文本
      selectPage: chrome.i18n.getMessage('selectPage') || '选择页面:',
      createNewPage: chrome.i18n.getMessage('createNewPage') || '新建页面',
      loadingPages: chrome.i18n.getMessage('loadingPages') || '加载中...',
      configureFirst: chrome.i18n.getMessage('configureFirst') || '请先配置Notion API密钥和Database ID',
      noPagesInDatabase: chrome.i18n.getMessage('noPagesInDatabase') || '数据库中暂无页面',
      loadPagesFailed: chrome.i18n.getMessage('loadPagesFailed') || '加载页面失败',
      extensionNotInitialized: chrome.i18n.getMessage('extensionNotInitialized') || '扩展未初始化',
      createPageDialogTitle: chrome.i18n.getMessage('createPageDialogTitle') || '创建新页面',
      createPageDialogDesc: chrome.i18n.getMessage('createPageDialogDesc') || '请输入页面的名称，Phoebe会帮你自动创建到Notion中 ✨',
      createPagePlaceholder: chrome.i18n.getMessage('createPagePlaceholder') || '例如：灵感收集、工作笔记...',
      buttonCreate: chrome.i18n.getMessage('buttonCreate') || '创建',
      pageNameEmpty: chrome.i18n.getMessage('pageNameEmpty') || '页面名称不能为空',
      pageNameExists: chrome.i18n.getMessage('pageNameExists') || '已存在同名页面，请使用其他名称',
      createPageFailed: chrome.i18n.getMessage('createPageFailed') || '创建页面失败',
      phoebeWorking: chrome.i18n.getMessage('phoebeWorking') || 'Phoebe正在工作中',
      creatingPage: chrome.i18n.getMessage('creatingPage') || '正在努力帮你创建页面"$PAGE$"...<br>请稍等片刻 ✨',
      phoebeSaving: chrome.i18n.getMessage('phoebeSaving') || 'Phoebe正在保存',
      savingToNotion: chrome.i18n.getMessage('savingToNotion') || '正在保存笔记...<br>请稍等片刻 ✨',
      pageCreatedSuccess: chrome.i18n.getMessage('pageCreatedSuccess') || '新页面 "$PAGE$" 创建成功',
      extensionNotInitializedRetry: chrome.i18n.getMessage('extensionNotInitializedRetry') || '扩展未初始化，请刷新页面重试',
      pleaseSelectPage: chrome.i18n.getMessage('pleaseSelectPage') || '请选择一个页面',
      pleaseFillApiAndDatabase: chrome.i18n.getMessage('pleaseFillApiAndDatabase') || '请填写API密钥和Database ID',
      configVerifyFailed: chrome.i18n.getMessage('configVerifyFailed') || '配置验证失败: $ERROR$',
      configSaveSuccess: chrome.i18n.getMessage('configSaveSuccess') || '配置已保存并验证！',
      configSaveSuccessPage: chrome.i18n.getMessage('configSaveSuccessPage') || '配置已保存并验证！',
      configSaveSuccessDatabase: chrome.i18n.getMessage('configSaveSuccessDatabase') || '配置已保存并验证！',
      connectionSuccess: chrome.i18n.getMessage('connectionSuccess') || '连接成功！',
      connectionSuccessPage: chrome.i18n.getMessage('connectionSuccessPage') || '连接成功！',
      connectionSuccessDatabase: chrome.i18n.getMessage('connectionSuccessDatabase') || '连接成功！',
      connectionFailed: chrome.i18n.getMessage('connectionFailed') || '连接失败: $ERROR$',
      connectionError: chrome.i18n.getMessage('connectionError') || '连接错误: $ERROR$',
      targetDatabase: chrome.i18n.getMessage('targetDatabase') || '目标数据库: $TITLE$',
      untitledDatabase: chrome.i18n.getMessage('untitledDatabase') || '未命名数据库',
      setupStepMode: chrome.i18n.getMessage('setupStepMode') || '选择使用模式：普通文档模式（直接追加内容）或数据库模式（可选择页面或创建新页面）',
      setupStepShare: chrome.i18n.getMessage('setupStepShare') || '在Notion中将目标页面或数据库共享给你的集成，并给予编辑权限',
      setupStepComplete: chrome.i18n.getMessage('setupStepComplete') || '完成设置后即可开始使用！',
      labelMode: chrome.i18n.getMessage('labelMode') || '使用模式',
      modePageTitle: chrome.i18n.getMessage('modePageTitle') || '📄 普通文档模式',
      modePageDesc: chrome.i18n.getMessage('modePageDesc') || '内容直接追加到选定的页面末尾，适合简单的内容收集',
      modeDatabaseTitle: chrome.i18n.getMessage('modeDatabaseTitle') || '🗄️ 数据库模式',
      modeDatabaseDesc: chrome.i18n.getMessage('modeDatabaseDesc') || '保存时可选择现有页面或创建新页面，适合结构化的内容管理',
      labelTargetPage: chrome.i18n.getMessage('labelTargetPage') || '目标页面',
      labelTargetDatabase: chrome.i18n.getMessage('labelTargetDatabase') || '目标数据库',
      helpTargetPage: chrome.i18n.getMessage('helpTargetPage') || '选择要追加内容的页面',
      helpTargetDatabase: chrome.i18n.getMessage('helpTargetDatabase') || '选择要保存内容的数据库',
      loadingResources: chrome.i18n.getMessage('loadingResources') || '正在加载...',
      noResourcesFound: chrome.i18n.getMessage('noResourcesFound') || '未找到可用资源',
      loadResourcesFailed: chrome.i18n.getMessage('loadResourcesFailed') || '加载失败，请检查API密钥',
      buttonRefresh: chrome.i18n.getMessage('buttonRefresh') || '刷新',
      targetPageConfigured: chrome.i18n.getMessage('targetPageConfigured') || '已配置目标页面',
      untitledPage: chrome.i18n.getMessage('untitledPage') || '无标题页面',
      noTagsFound: chrome.i18n.getMessage('noTagsFound') || '暂无标签历史',
      saveToTargetPage: chrome.i18n.getMessage('saveToTargetPage') || '保存到目标页面:',
      contentWillAppend: chrome.i18n.getMessage('contentWillAppend') || '内容将直接追加到此页面末尾',
      loadingPageInfo: chrome.i18n.getMessage('loadingPageInfo') || '正在获取页面信息...',
      // 补充缺失的国际化key
      buttonSavingSettings: chrome.i18n.getMessage('buttonSavingSettings') || 'Saving...',
      buttonTesting: chrome.i18n.getMessage('buttonTesting') || 'Testing...',
      buttonRefreshing: chrome.i18n.getMessage('buttonRefreshing') || 'Refreshing...',
      buttonClearing: chrome.i18n.getMessage('buttonClearing') || 'Clearing...',
      confirmClearTags: chrome.i18n.getMessage('confirmClearTags') || 'Are you sure you want to clear all tag history? This action cannot be undone.',
      tagsLoading: chrome.i18n.getMessage('tagsLoading') || 'Loading tag history...',
      tagsCleared: chrome.i18n.getMessage('tagsCleared') || 'Tag history cleared',
      clearFailed: chrome.i18n.getMessage('clearFailed') || 'Clear failed',
      clickToDelete: chrome.i18n.getMessage('clickToDelete') || 'Click to delete',
      tagDeleted: chrome.i18n.getMessage('tagDeleted') || 'Tag deleted',
      deleteFailed: chrome.i18n.getMessage('deleteFailed') || 'Delete failed',
      // 快速笔记相关翻译
      quickNoteTitle: chrome.i18n.getMessage('quickNoteTitle') || '快速笔记',
      quickNotePageInfo: chrome.i18n.getMessage('quickNotePageInfo') || '当前网页：',
      notePlaceholder: chrome.i18n.getMessage('notePlaceholder') || '请在此输入您的笔记内容（必填）...',
      pleaseEnterNote: chrome.i18n.getMessage('pleaseEnterNote') || '请输入笔记内容',
      // 页面和数据库模式错误提示
      pageModeRequiresTargetPage: chrome.i18n.getMessage('pageModeRequiresTargetPage') || '页面模式需要先在设置中配置目标页面',
      databaseModeRequiresTargetDatabase: chrome.i18n.getMessage('databaseModeRequiresTargetDatabase') || '数据库模式需要先在设置中配置目标数据库',
      pageModeNeedsConfig: chrome.i18n.getMessage('pageModeNeedsConfig') || '页面模式需要配置目标页面',
      databaseModeNeedsConfig: chrome.i18n.getMessage('databaseModeNeedsConfig') || '数据库模式需要配置目标数据库',
      // 友好对话框相关翻译
      friendlyTip: chrome.i18n.getMessage('friendlyTip') || 'Phoebe 提示',
      requiredFieldTitle: chrome.i18n.getMessage('requiredFieldTitle') || '必填项提醒',
      buttonOK: chrome.i18n.getMessage('buttonOK') || '好的',
      confirmTitle: chrome.i18n.getMessage('confirmTitle') || 'Phoebe 确认',
      confirmClearTagsTitle: chrome.i18n.getMessage('confirmClearTagsTitle') || '确认清空标签',
      buttonConfirm: chrome.i18n.getMessage('buttonConfirm') || '确认'
    };
    sendResponse({ success: true, texts });
    return true;
  }

  // 获取可访问的页面
  if (request.action === 'getAccessiblePages') {
    (async () => {
      try {
        const pages = await getAccessiblePages(request.apiToken);
        sendResponse({ success: true, pages });
      } catch (error) {
        console.error('获取页面列表失败:', error);
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true;
  }

  // 获取可访问的数据库
  if (request.action === 'getAccessibleDatabases') {
    (async () => {
      try {
        const databases = await getAccessibleDatabases(request.apiToken);
        sendResponse({ success: true, databases });
      } catch (error) {
        console.error('获取数据库列表失败:', error);
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true;
  }

  // 获取页面信息
  if (request.action === 'getPageInfo') {
    (async () => {
      try {
        const pageInfo = await getPageInfo(request.pageId, request.notionToken);
        sendResponse({ success: true, pageInfo });
      } catch (error) {
        console.error('获取页面信息失败:', error);
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true;
  }
});

// 保存笔记的函数
async function saveToNotion(data, config) {
  console.log('开始保存笔记:', { data, config });
  
  // 如果有pageId，追加到现有页面；否则在database中创建新页面
  if (data.pageId) {
    return await appendToPage(data, config);
  } else {
    return await createPageInDatabase(data, config);
  }
}

// 追加内容到现有页面
async function appendToPage(data, config) {
  const notionApiUrl = `https://api.notion.com/v1/blocks/${data.pageId}/children`;
  
  // 创建时间戳
  const now = new Date();
  const timeStr = now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  
  // 构建要追加的内容块
  const children = [
    {
      object: "block",
      type: "divider",
      divider: {}
    },
    {
      object: "block",
      type: "heading_3",
      heading_3: {
        rich_text: [
          {
            type: "text",
            text: {
              content: `📝 ${timeStr}`
            }
          }
        ]
      }
    },
    {
      object: "block",
      type: "quote",
      quote: {
        rich_text: [
          {
            type: "text",
            text: {
              content: data.content
            }
          }
        ]
      }
    }
  ];

  // 添加来源信息块（根据是否有有效URL决定格式）
  if (data.url && data.url.trim() && data.url !== '') {
    // 有有效URL，添加链接格式
    children.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: {
              content: "🔗 来源: "
            }
          },
          {
            type: "text",
            text: {
              content: data.title,
              link: {
                url: data.url
              }
            }
          }
        ]
      }
    });
  } else if (data.title && data.title.trim() && !data.title.startsWith('快速笔记')) {
    // 没有URL但有标题（且不是快速笔记标题），显示普通文本
    children.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: {
              content: `📄 来源: ${data.title}`
            }
          }
        ]
      }
    });
  }
  // 如果是快速笔记（title以'快速笔记'开头且没有URL），则不添加来源信息

  // 如果有备注，添加备注块
  if (data.note && data.note.trim()) {
    children.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: {
              content: `💭 备注: ${data.note}`
            }
          }
        ]
      }
    });
  }

  // 如果有标签，添加标签块
  if (data.tags && data.tags.length > 0) {
    children.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: {
              content: `🏷️ 标签: ${data.tags.join(', ')}`
            }
          }
        ]
      }
    });
  }

  const payload = {
    children: children
  };

  const response = await fetch(notionApiUrl, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${config.notionToken}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Notion API 错误:', errorText);
    throw new Error(`保存失败: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

// 在Database中创建新页面
async function createPageInDatabase(data, config) {
  const notionApiUrl = 'https://api.notion.com/v1/pages';
  
  // 创建时间戳
  const now = new Date();
  const timeStr = now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  
  // 构建页面属性
  const properties = {
    "title": {
      "title": [
        {
          "type": "text",
          "text": {
            "content": `${data.title} - ${timeStr}`
          }
        }
      ]
    }
  };

  // MVP版本暂时不支持标签属性，专注核心功能

  // 构建页面内容
  const children = [
    {
      object: "block",
      type: "quote",
      quote: {
        rich_text: [
          {
            type: "text",
            text: {
              content: data.content
            }
          }
        ]
      }
    }
  ];

  // 添加来源信息块（根据是否有有效URL决定格式）
  if (data.url && data.url.trim() && data.url !== '') {
    // 有有效URL，添加链接格式
    children.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: {
              content: "🔗 来源: "
            }
          },
          {
            type: "text",
            text: {
              content: data.title,
              link: {
                url: data.url
              }
            }
          }
        ]
      }
    });
  } else if (data.title && data.title.trim() && !data.title.startsWith('快速笔记')) {
    // 没有URL但有标题（且不是快速笔记标题），显示普通文本
    children.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: {
              content: `📄 来源: ${data.title}`
            }
          }
        ]
      }
    });
  }
  // 如果是快速笔记（title以'快速笔记'开头且没有URL），则不添加来源信息

  // 如果有备注，添加备注块
  if (data.note && data.note.trim()) {
    children.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: {
              content: `💭 备注: ${data.note}`
            }
          }
        ]
      }
    });
  }

  // 如果有标签，添加标签块
  if (data.tags && data.tags.length > 0) {
    children.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: {
              content: `🏷️ 标签: ${data.tags.join(', ')}`
            }
          }
        ]
      }
    });
  }

  const payload = {
    parent: {
      database_id: config.databaseId
    },
    properties: properties,
    children: children
  };

  const response = await fetch(notionApiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.notionToken}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Notion API 错误:', errorText);
    throw new Error(`创建页面失败: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

// 标签历史管理函数
async function saveTagsToHistory(newTags) {
  try {
    // 获取现有标签历史
    const result = await chrome.storage.local.get(['tagHistory']);
    let tagHistory = result.tagHistory || [];
    
    // 添加新标签（去重）
    newTags.forEach(tag => {
      if (!tagHistory.includes(tag)) {
        tagHistory.push(tag);
      }
    });
    
    // 按使用频率排序（最近使用的在前面）
    // 这里简化处理，新标签放在前面
    const uniqueTags = [...new Set([...newTags, ...tagHistory])];
    
    // 限制历史记录数量（最多保存100个标签）
    if (uniqueTags.length > 100) {
      uniqueTags.splice(100);
    }
    
    // 保存到本地存储
    await chrome.storage.local.set({ tagHistory: uniqueTags });
    console.log('标签历史已更新:', uniqueTags);
  } catch (error) {
    console.error('保存标签历史失败:', error);
    throw error;
  }
}

async function getTagHistory() {
  try {
    const result = await chrome.storage.local.get(['tagHistory']);
    return result.tagHistory || [];
  } catch (error) {
    console.error('获取标签历史失败:', error);
    return [];
  }
}

// 获取Database下的Page列表
async function getDatabasePages(config) {
  const response = await fetch(`https://api.notion.com/v1/databases/${config.databaseId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.notionToken}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify({})
  });

  if (!response.ok) {
    throw new Error(`获取页面列表失败: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.results.map(page => ({
    id: page.id,
    title: getPageTitle(page.properties)
  }));
}

// 创建新Page到Database
async function createNewPageInDatabase(pageTitle, config) {
  const payload = {
    parent: {
      database_id: config.databaseId
    },
    properties: {
      "title": {
        "title": [
          {
            "type": "text",
            "text": {
              "content": pageTitle
            }
          }
        ]
      }
    }
  };

  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.notionToken}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`创建页面失败: ${response.status} ${response.statusText}`);
  }

  const newPage = await response.json();
  return {
    id: newPage.id,
    title: pageTitle
  };
}

// 从页面属性中提取标题
function getPageTitle(properties) {
  // 查找title类型的属性
  for (const [key, value] of Object.entries(properties)) {
    if (value.type === 'title' && value.title && value.title.length > 0) {
      return value.title[0].plain_text || '无标题';
    }
  }
  return '无标题';
}

// 搜索用户可访问的页面和数据库
async function searchNotionResources(apiToken, filter = null) {
  const notionApiUrl = 'https://api.notion.com/v1/search';
  
  const payload = {
    page_size: 100
  };
  
  // 如果有过滤条件，添加过滤器
  if (filter) {
    payload.filter = filter;
  }
  
  try {
    const response = await fetch(notionApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('搜索Notion资源失败:', errorText);
      throw new Error(`搜索失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('搜索Notion资源错误:', error);
    throw error;
  }
}

// 获取用户可访问的页面
async function getAccessiblePages(apiToken) {
  try {
    const filter = {
      value: "page",
      property: "object"
    };
    
    const results = await searchNotionResources(apiToken, filter);
    
    // 过滤掉没有有效标题的页面
    const validPages = results.filter(page => {
      const title = getResourceTitle(page);
      return title && title.trim() !== ''; // 只保留有有效标题的页面
    }).map(page => ({
      id: page.id,
      title: getResourceTitle(page),
      url: page.url,
      object: page.object
    }));
    
    console.log(`过滤后的页面数量: ${validPages.length}, 原始数量: ${results.length}`);
    return validPages;
  } catch (error) {
    console.error('获取可访问页面失败:', error);
    throw error;
  }
}

// 获取用户可访问的数据库
async function getAccessibleDatabases(apiToken) {
  try {
    const filter = {
      value: "database",
      property: "object"
    };
    
    const results = await searchNotionResources(apiToken, filter);
    
    // 过滤掉没有有效标题的数据库
    const validDatabases = results.filter(database => {
      const title = getResourceTitle(database);
      return title && title.trim() !== ''; // 只保留有有效标题的数据库
    }).map(database => ({
      id: database.id,
      title: getResourceTitle(database),
      url: database.url,
      object: database.object
    }));
    
    console.log(`过滤后的数据库数量: ${validDatabases.length}, 原始数量: ${results.length}`);
    return validDatabases;
  } catch (error) {
    console.error('获取可访问数据库失败:', error);
    throw error;
  }
}

// 获取资源标题的通用函数
function getResourceTitle(resource) {
  try {
    console.log('获取资源标题:', resource.object, resource.id);
    
    if (resource.object === 'page') {
      // 页面标题 - 尝试多种可能的结构
      if (resource.properties) {
        // 查找title类型的属性
        for (const [key, value] of Object.entries(resource.properties)) {
          if (value.type === 'title') {
            console.log('找到页面title属性:', key, value);
            // 尝试多种可能的结构
            if (value.title && value.title.length > 0) {
              // 结构1: value.title[0].plain_text
              if (value.title[0].plain_text) {
                const title = value.title[0].plain_text.trim();
                console.log('使用plain_text:', title);
                return title || null;
              }
              // 结构2: value.title[0].text.content
              if (value.title[0].text && value.title[0].text.content) {
                const title = value.title[0].text.content.trim();
                console.log('使用text.content:', title);
                return title || null;
              }
            }
          }
        }
      }
      console.log('页面无标题或标题为空');
      return null; // 无标题页面
    } else if (resource.object === 'database') {
      // 数据库标题
      console.log('数据库title结构:', resource.title);
      if (resource.title && resource.title.length > 0) {
        // 尝试多种可能的结构
        if (resource.title[0].plain_text) {
          const title = resource.title[0].plain_text.trim();
          console.log('数据库使用plain_text:', title);
          return title || null;
        }
        if (resource.title[0].text && resource.title[0].text.content) {
          const title = resource.title[0].text.content.trim();
          console.log('数据库使用text.content:', title);
          return title || null;
        }
      }
      console.log('数据库无标题或标题为空');
      return null; // 无标题数据库
    }
    return null; // 未知资源
  } catch (error) {
    console.error('获取资源标题失败:', error, resource);
    return null; // 出错时返回null
  }
}

// 获取页面信息
async function getPageInfo(pageId, notionToken) {
  const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${notionToken}`,
      'Notion-Version': '2022-06-28'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Notion API 错误:', errorText);
    throw new Error(`获取页面信息失败: ${response.status} ${response.statusText}`);
  }

  const pageData = await response.json();
  let pageTitle = '无标题页面';
  
  // 尝试获取页面标题 - 支持多种可能的结构
  if (pageData.properties) {
    for (const [key, value] of Object.entries(pageData.properties)) {
      if (value.type === 'title') {
        // 尝试多种可能的结构
        if (value.title && value.title.length > 0) {
          // 结构1: value.title[0].plain_text
          if (value.title[0].plain_text) {
            pageTitle = value.title[0].plain_text;
            break;
          }
          // 结构2: value.title[0].text.content
          if (value.title[0].text && value.title[0].text.content) {
            pageTitle = value.title[0].text.content;
            break;
          }
        }
      }
    }
  }
  
  return {
    id: pageData.id,
    title: pageTitle,
    url: pageData.url,
    created_time: pageData.created_time,
    last_edited_time: pageData.last_edited_time
  };
}