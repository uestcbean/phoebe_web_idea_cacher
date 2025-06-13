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
    const config = await chrome.storage.sync.get(['notionToken', 'pageId']);
    if (!config.notionToken || !config.pageId) {
      chrome.tabs.sendMessage(tab.id, {
        action: "showError",
        message: "请先在插件设置中配置Notion API密钥和页面ID"
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
        const config = await chrome.storage.sync.get(['notionToken', 'pageId']);
        console.log('获取配置:', config);
        
        if (!config.notionToken || !config.pageId) {
          throw new Error(chrome.i18n.getMessage('errorNotConfigured') || '未找到配置，请先设置API密钥和页面ID');
        }
        
        const result = await saveToNotion(request.data, config);
        sendResponse({ success: true, result });
      } catch (error) {
        sendResponse({ success: false, error: error.message });
      }
    })();
    
    return true; // 保持消息通道开启
  } else if (request.action === "saveTagsToHistory") {
    // 保存标签到历史记录
    (async () => {
      try {
        await saveTagsToHistory(request.tags);
        sendResponse({ success: true });
      } catch (error) {
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
      errorNetwork: chrome.i18n.getMessage('errorNetwork') || '未知错误，请检查网络连接'
    };
    sendResponse({ success: true, texts });
    return true;
  }
});

// 保存到Notion的函数
async function saveToNotion(data, config) {
  const notionApiUrl = `https://api.notion.com/v1/blocks/${config.pageId}/children`;
  
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
    
    try {
      const errorData = JSON.parse(errorText);
      throw new Error(`Notion API错误: ${errorData.message || errorData.code || response.status}`);
    } catch (parseError) {
      throw new Error(`Notion API错误: HTTP ${response.status} - ${errorText}`);
    }
  }

  const result = await response.json();
  return result;
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