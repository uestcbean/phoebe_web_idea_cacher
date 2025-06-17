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
    
    // 检查配置
    const config = await chrome.storage.sync.get(['notionToken', 'databaseId']);
    if (!config.notionToken || !config.databaseId) {
      chrome.tabs.sendMessage(tab.id, {
        action: "showError",
        message: chrome.i18n.getMessage('errorNotConfigured') || "请先在插件设置中配置Notion API密钥和Database ID"
      });
      return;
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
        const config = await chrome.storage.sync.get(['notionToken', 'databaseId']);
        console.log('获取配置:', config);
        
        if (!config.notionToken || !config.databaseId) {
          throw new Error(chrome.i18n.getMessage('errorNotConfigured') || '未找到配置，请先设置API密钥和Database ID');
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
        const config = await chrome.storage.sync.get(['notionToken', 'databaseId']);
        if (!config.notionToken || !config.databaseId) {
          throw new Error('配置不完整');
        }
        
        const pages = await getDatabasePages(config);
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
        const config = await chrome.storage.sync.get(['notionToken', 'databaseId']);
        if (!config.notionToken || !config.databaseId) {
          throw new Error('配置不完整');
        }
        
        const newPage = await createNewPageInDatabase(request.pageTitle, config);
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
      untitledDatabase: chrome.i18n.getMessage('untitledDatabase') || '未命名数据库'
    };
    sendResponse({ success: true, texts });
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