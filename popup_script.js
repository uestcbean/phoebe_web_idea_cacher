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
    // 读取所有相关配置字段，包括新的mode字段
    const config = await chrome.storage.sync.get(['notionToken', 'mode', 'targetPageId', 'targetDatabaseId', 'databaseId']);
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    
    console.log('🔍 [Popup检查配置] 读取到的配置:', config);
    
    // 根据模式确定需要检查的字段
    let isConfigured = false;
    let targetId = null;
    let targetTitle = null;
    
    if (config.notionToken) {
        if (config.mode === 'page' && config.targetPageId) {
            // 页面模式：需要API密钥和目标页面ID
            isConfigured = true;
            targetId = config.targetPageId;
            console.log('✅ [页面模式] 配置检查通过');
        } else if (config.mode === 'database' && config.targetDatabaseId) {
            // 数据库模式：需要API密钥和目标数据库ID
            isConfigured = true;
            targetId = config.targetDatabaseId;
            console.log('✅ [数据库模式] 配置检查通过');
        } else if (config.databaseId) {
            // 向后兼容：旧版本的databaseId
            isConfigured = true;
            targetId = config.databaseId;
            console.log('✅ [兼容模式] 配置检查通过，使用旧版databaseId');
        } else {
            console.log('❌ [配置不完整] API密钥存在但缺少目标配置');
        }
    } else {
        console.log('❌ [配置不完整] 缺少API密钥');
    }
    
    if (isConfigured) {
        statusDot.classList.add('connected');
        statusText.textContent = chrome.i18n.getMessage('statusConfigured') || '已配置，可以使用';
        
        // 测试连接
        try {
            let apiUrl;
            let resourceType;
            
            // 根据模式确定API端点
            if (config.mode === 'page') {
                apiUrl = `https://api.notion.com/v1/pages/${targetId}`;
                resourceType = 'page';
            } else {
                // 数据库模式或兼容模式
                apiUrl = `https://api.notion.com/v1/databases/${targetId}`;
                resourceType = 'database';
            }
            
            console.log(`📡 [连接测试] 模式: ${config.mode || '兼容模式'}, 类型: ${resourceType}, URL: ${apiUrl}`);
            
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${config.notionToken}`,
                    'Notion-Version': '2022-06-28'
                }
            });
            
            if (response.ok) {
                statusText.textContent = '✅ ' + (chrome.i18n.getMessage('statusConnected') || '连接正常');
                const data = await response.json();
                
                // 根据资源类型解析标题
                if (resourceType === 'page') {
                    // 页面标题解析
                    if (data.properties) {
                        for (const [key, value] of Object.entries(data.properties)) {
                            if (value.type === 'title' && value.title && value.title.length > 0) {
                                targetTitle = value.title[0].plain_text || chrome.i18n.getMessage('untitledPage') || '无标题页面';
                                break;
                            }
                        }
                    }
                    if (!targetTitle) {
                        targetTitle = chrome.i18n.getMessage('untitledPage') || '无标题页面';
                    }
                    document.getElementById('stats').textContent = chrome.i18n.getMessage('saveToTargetPage') + ' ' + targetTitle;
                } else {
                    // 数据库标题解析
                    targetTitle = data.title?.[0]?.plain_text || chrome.i18n.getMessage('untitledDatabase') || '未命名数据库';
                    document.getElementById('stats').textContent = chrome.i18n.getMessage('targetDatabase', [targetTitle]) || `目标数据库: ${targetTitle}`;
                }
                
                console.log(`✅ [连接成功] ${resourceType}: ${targetTitle}`);
            } else {
                statusDot.classList.remove('connected');
                statusText.textContent = '❌ ' + (chrome.i18n.getMessage('statusDisconnected') || '连接失败');
                document.getElementById('stats').textContent = chrome.i18n.getMessage('statusCheckConfig') || '请检查配置';
                console.log(`❌ [连接失败] HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            statusDot.classList.remove('connected');
            statusText.textContent = '❌ ' + (chrome.i18n.getMessage('statusError') || '连接错误');
            document.getElementById('stats').textContent = chrome.i18n.getMessage('statusCheckNetwork') || '请检查网络连接';
            console.log('❌ [连接异常]', error);
        }
    } else {
        // 配置不完整的处理
        statusDot.classList.remove('connected');
        statusText.textContent = chrome.i18n.getMessage('statusNotConfigured') || '未配置，请先设置';
        
        // 提供具体的配置指导
        if (!config.notionToken) {
            document.getElementById('stats').textContent = chrome.i18n.getMessage('statusClickSettings') || '点击设置按钮进行配置';
        } else if (config.mode === 'page') {
            document.getElementById('stats').textContent = '请在设置中选择目标页面';
        } else if (config.mode === 'database') {
            document.getElementById('stats').textContent = '请在设置中选择目标数据库';
        } else {
            document.getElementById('stats').textContent = '请在设置中选择使用模式和目标';
        }
        
        console.log('❌ [配置不完整] 缺少必要配置项');
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