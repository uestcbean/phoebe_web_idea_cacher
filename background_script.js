// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveToNotion",
    title: chrome.i18n.getMessage('contextMenuSave') || "保存到Notion",
    contexts: ["selection"]
  });
});

// 处理右键菜单点击
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "saveToNotion") {
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
        message: "页面模式需要先在设置中配置目标页面"
      });
      return;
    } else if (mode === 'database') {
      const databaseId = config.targetDatabaseId || config.databaseId; // 兼容旧配置
      if (!databaseId) {
        chrome.tabs.sendMessage(tab.id, {
          action: "showError",
          message: "数据库模式需要先在设置中配置目标数据库"
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
          throw new Error('页面模式需要配置目标页面');
        } else if (mode === 'database') {
          const databaseId = config.targetDatabaseId || config.databaseId; // 兼容旧配置
          if (!databaseId) {
            throw new Error('数据库模式需要配置目标数据库');
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
  } else if (request.action === "getI18nTexts") {
    // 获取常用的本地化文本供content script使用
    const texts = {
      saveDialogTitle: chrome.i18n.getMessage('saveDialogTitle') || '保存到Notion',
      saveDialogContent: chrome.i18n.getMessage('saveDialogContent') || '选中内容:',
      saveDialogNote: chrome.i18n.getMessage('saveDialogNote') || '备注 (可选):',
      saveDialogNotePlaceholder: chrome.i18n.getMessage('saveDialogNotePlaceholder') || '添加备注...',
      saveDialogTags: chrome.i18n.getMessage('saveDialogTags') || '标签 (可选):',
      saveDialogTagsPlaceholder: chrome.i18n.getMessage('saveDialogTagsPlaceholder') || '输入标签，回车添加，或从下拉列表选择',
      buttonCancel: chrome.i18n.getMessage('buttonCancel') || '取消',
      buttonSave: chrome.i18n.getMessage('buttonSave') || '保存',
      buttonSaving: chrome.i18n.getMessage('buttonSaving') || '保存中...',
      saveSuccess: chrome.i18n.getMessage('saveSuccess') || '成功保存到Notion!',
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
      creatingPage: chrome.i18n.getMessage('creatingPage') || '正在努力帮你创建页面\"$PAGE$\"...<br>请稍等片刻 ✨',
      phoebeSaving: chrome.i18n.getMessage('phoebeSaving') || 'Phoebe正在保存',
      savingToNotion: chrome.i18n.getMessage('savingToNotion') || '正在保存到Notion中...<br>请稍等片刻 ✨',
      pageCreatedSuccess: chrome.i18n.getMessage('pageCreatedSuccess') || '新页面 \"$PAGE$\" 创建成功',
      extensionNotInitializedRetry: chrome.i18n.getMessage('extensionNotInitializedRetry') || '扩展未初始化，请刷新页面重试',
      pleaseSelectPage: chrome.i18n.getMessage('pleaseSelectPage') || '请选择一个页面',
      pleaseFillApiAndDatabase: chrome.i18n.getMessage('pleaseFillApiAndDatabase') || '请填写API密钥和Database ID',
      configVerifyFailed: chrome.i18n.getMessage('configVerifyFailed') || '配置验证失败: $ERROR$',
      configSaveSuccess: chrome.i18n.getMessage('configSaveSuccess') || '配置已保存并验证！目标数据库: $DATABASE$',
      connectionSuccess: chrome.i18n.getMessage('connectionSuccess') || '连接成功！目标数据库: $DATABASE$',
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
      deleteFailed: chrome.i18n.getMessage('deleteFailed') || 'Delete failed'
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

// 保存到Notion的函数
async function saveToNotion(data, config) {
  console.log('开始保存到Notion:', { data, config });
  
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
    },
    {
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
    }
  ];

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
    },
    {
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
    }
  ];

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
    if (resource.object === 'page') {
      // 页面标题
      if (resource.properties && resource.properties.title && resource.properties.title.title) {
        const titleArray = resource.properties.title.title;
        if (titleArray.length > 0) {
          const title = titleArray[0].text.content || '';
          return title.trim() || null; // 返回null表示无效标题
        }
      }
      return null; // 无标题页面
    } else if (resource.object === 'database') {
      // 数据库标题
      if (resource.title && resource.title.length > 0) {
        const title = resource.title[0].text.content || '';
        return title.trim() || null; // 返回null表示无效标题
      }
      return null; // 无标题数据库
    }
    return null; // 未知资源
  } catch (error) {
    console.error('获取资源标题失败:', error);
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