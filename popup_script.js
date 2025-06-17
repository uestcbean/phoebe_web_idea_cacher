// Notion文摘收集器 - 弹窗页面脚本

// 初始化国际化
function initI18n() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const messageKey = element.getAttribute('data-i18n');
        const localizedText = chrome.i18n.getMessage(messageKey);
        if (localizedText) {
            element.textContent = localizedText;
        }
    });
    
    // 更新文档标题
    document.title = chrome.i18n.getMessage('popupTitle') || 'Notion文摘收集器';
}

// 检查配置状态
async function checkStatus() {
    const config = await chrome.storage.sync.get(['notionToken', 'databaseId']);
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    
    if (config.notionToken && config.databaseId) {
        statusDot.classList.add('connected');
        statusText.textContent = chrome.i18n.getMessage('statusConfigured') || '已配置，可以使用';
        
        // 测试连接
        try {
            const response = await fetch(`https://api.notion.com/v1/databases/${config.databaseId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${config.notionToken}`,
                    'Notion-Version': '2022-06-28'
                }
            });
            
            if (response.ok) {
                statusText.textContent = '✅ ' + (chrome.i18n.getMessage('statusConnected') || '连接正常');
                const data = await response.json();
                const dbTitle = data.title?.[0]?.plain_text || chrome.i18n.getMessage('untitledDatabase') || '未命名数据库';
                document.getElementById('stats').textContent = chrome.i18n.getMessage('targetDatabase', [dbTitle]) || `目标数据库: ${dbTitle}`;
            } else {
                statusDot.classList.remove('connected');
                statusText.textContent = '❌ ' + (chrome.i18n.getMessage('statusDisconnected') || '连接失败');
                document.getElementById('stats').textContent = chrome.i18n.getMessage('statusCheckConfig') || '请检查配置';
            }
        } catch (error) {
            statusDot.classList.remove('connected');
            statusText.textContent = '❌ ' + (chrome.i18n.getMessage('statusError') || '连接错误');
            document.getElementById('stats').textContent = chrome.i18n.getMessage('statusCheckNetwork') || '请检查网络连接';
        }
    } else {
        statusText.textContent = chrome.i18n.getMessage('statusNotConfigured') || '未配置，请先设置';
        document.getElementById('stats').textContent = chrome.i18n.getMessage('statusClickSettings') || '点击设置按钮进行配置';
    }
}

// 打开设置页面
function openSettings() {
    chrome.runtime.openOptionsPage();
}

// 刷新状态
function refreshStatus() {
    checkStatus();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化国际化
    initI18n();
    
    // 绑定事件
    document.getElementById('openSettings').addEventListener('click', openSettings);
    document.getElementById('refreshStatus').addEventListener('click', refreshStatus);
    
    // 检查状态
    checkStatus();
}); 