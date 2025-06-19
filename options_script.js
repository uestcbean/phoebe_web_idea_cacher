// Phoebe - 选项页面脚本

let currentI18nTexts = {};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async () => {
    // 立即应用基础国际化（使用Chrome的i18n API）
    applyI18n();
    
    // 初始化国际化（获取background script的补充文本）
    await initI18n();
    
    // 调用i18n.js中的initI18n函数作为补充
    if (typeof window.initI18n === 'function') {
        window.initI18n();
    }
    
    // 绑定事件
    document.getElementById('settingsForm').addEventListener('submit', saveSettings);
    document.getElementById('testConnection').addEventListener('click', testConnection);
    document.getElementById('loadTags').addEventListener('click', loadTagHistory);
    document.getElementById('clearTags').addEventListener('click', clearTagHistory);
    
    // 绑定模式选择事件
    initModeSelection();
    
    // 绑定API密钥输入事件
    document.getElementById('notionToken').addEventListener('input', onApiTokenChange);
    
    // 绑定刷新按钮事件
    document.getElementById('refreshPages').addEventListener('click', () => refreshPages());
    document.getElementById('refreshDatabases').addEventListener('click', () => refreshDatabases());
    
    // 加载已保存的设置
    await loadSettings();
    
    // 自动加载标签历史
    loadTagHistory();
});

// 初始化国际化
async function initI18n() {
    try {
        const response = await chrome.runtime.sendMessage({ action: 'getI18nTexts' });
        if (response && response.success) {
            currentI18nTexts = response.texts;
            applyI18n();
        }
    } catch (error) {
        console.error('初始化国际化失败:', error);
    }
}

// 应用国际化文本
function applyI18n() {
    const elements = document.querySelectorAll('[data-i18n]');
    console.log(`正在应用国际化，找到 ${elements.length} 个元素`);
    console.log(`当前语言: ${chrome.i18n.getUILanguage()}`);
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        // 直接使用Chrome的i18n API，如果没有则使用background script的texts作为后备
        const chromeText = chrome.i18n.getMessage(key);
        const fallbackText = currentI18nTexts[key];
        const localizedText = chromeText || fallbackText;
        
        console.log(`Key: ${key}, Chrome: "${chromeText}", Fallback: "${fallbackText}", Used: "${localizedText}"`);
        
        if (localizedText) {
            if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = localizedText;
            } else if (element.tagName === 'BUTTON') {
                element.textContent = localizedText;
            } else {
                // 对于其他元素，使用innerHTML以支持HTML标记（如链接）
                element.innerHTML = localizedText;
            }
        }
    });
}

// 获取国际化消息
function getI18nMessage(key) {
    return chrome.i18n.getMessage(key) || currentI18nTexts[key] || key;
}

// 初始化模式选择
// 更新required属性的全局函数
function updateRequiredAttributes(mode) {
    const targetPageSelect = document.getElementById('targetPage');
    const targetDatabaseSelect = document.getElementById('targetDatabase');
    
    if (mode === 'page') {
        // 页面模式：targetPage必填，targetDatabase不必填
        targetPageSelect.required = true;
        targetDatabaseSelect.required = false;
    } else if (mode === 'database') {
        // 数据库模式：targetDatabase必填，targetPage不必填
        targetPageSelect.required = false;
        targetDatabaseSelect.required = true;
    } else {
        // 未选择模式：都不必填
        targetPageSelect.required = false;
        targetDatabaseSelect.required = false;
    }
    console.log(`模式 ${mode}: targetPage.required=${targetPageSelect.required}, targetDatabase.required=${targetDatabaseSelect.required}`);
}

function initModeSelection() {
    const modeOptions = document.querySelectorAll('.mode-option');
    const pageSelection = document.getElementById('pageSelection');
    const databaseSelection = document.getElementById('databaseSelection');
    
    modeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const radio = option.querySelector('input[type="radio"]');
            const mode = option.dataset.mode;
            
            // 更新选中状态
            modeOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            radio.checked = true;
            
            // 显示对应的选择区域
            if (mode === 'page') {
                pageSelection.classList.add('show');
                databaseSelection.classList.remove('show');
                // 如果有API密钥，自动加载页面
                const apiToken = document.getElementById('notionToken').value.trim();
                if (apiToken) {
                    refreshPages();
                }
            } else if (mode === 'database') {
                databaseSelection.classList.add('show');
                pageSelection.classList.remove('show');
                // 如果有API密钥，自动加载数据库
                const apiToken = document.getElementById('notionToken').value.trim();
                if (apiToken) {
                    refreshDatabases();
                }
            }
            
            // 更新required属性
            updateRequiredAttributes(mode);
        });
    });
    
    // 初始化时清除required属性，等待用户选择模式
    updateRequiredAttributes(null);
}

// API密钥输入变化时的处理
function onApiTokenChange() {
    const apiToken = document.getElementById('notionToken').value.trim();
    const refreshPagesBtn = document.getElementById('refreshPages');
    const refreshDatabasesBtn = document.getElementById('refreshDatabases');
    const targetPageSelect = document.getElementById('targetPage');
    const targetDatabaseSelect = document.getElementById('targetDatabase');
    
    if (apiToken) {
        // 启用刷新按钮
        refreshPagesBtn.disabled = false;
        refreshDatabasesBtn.disabled = false;
        targetPageSelect.disabled = false;
        targetDatabaseSelect.disabled = false;
        
        // 根据当前模式自动刷新
        const selectedMode = document.querySelector('input[name="mode"]:checked');
        if (selectedMode) {
            if (selectedMode.value === 'page') {
                refreshPages();
            } else if (selectedMode.value === 'database') {
                refreshDatabases();
            }
        }
    } else {
        // 禁用相关控件
        refreshPagesBtn.disabled = true;
        refreshDatabasesBtn.disabled = true;
        targetPageSelect.disabled = true;
        targetDatabaseSelect.disabled = true;
        
        // 重置选择框
        resetSelect(targetPageSelect, getI18nMessage('loadingPages'));
        resetSelect(targetDatabaseSelect, getI18nMessage('loadingPages'));
    }
}

// 重置选择框
function resetSelect(selectElement, placeholder) {
    selectElement.innerHTML = '';
    
    const option = document.createElement('option');
    option.value = '';
    option.textContent = placeholder;
    option.disabled = true;
    option.selected = true;
    selectElement.appendChild(option);
    
    selectElement.disabled = true;
}

// 刷新页面列表
async function refreshPages() {
    const apiToken = document.getElementById('notionToken').value.trim();
    if (!apiToken) {
        showStatus(getI18nMessage('loadResourcesFailed'), 'error');
        return;
    }
    
    const refreshBtn = document.getElementById('refreshPages');
    const targetPageSelect = document.getElementById('targetPage');
    const originalText = getI18nMessage('buttonRefresh');
    
    refreshBtn.textContent = getI18nMessage('buttonRefreshing');
    refreshBtn.disabled = true;
    targetPageSelect.innerHTML = `<option value="">${getI18nMessage('loadingResources')}</option>`;
    
    try {
        const response = await chrome.runtime.sendMessage({
            action: 'getAccessiblePages',
            apiToken: apiToken
        });
        
        if (response && response.success) {
            populateSelect(targetPageSelect, response.pages, getI18nMessage('labelTargetPage'));
        } else {
            resetSelect(targetPageSelect, getI18nMessage('loadResourcesFailed'));
            showStatus(response.error || getI18nMessage('loadResourcesFailed'), 'error');
        }
    } catch (error) {
        resetSelect(targetPageSelect, getI18nMessage('loadResourcesFailed'));
        showStatus(error.message, 'error');
    } finally {
        refreshBtn.textContent = originalText;
        refreshBtn.disabled = false;
    }
}

// 刷新数据库列表
async function refreshDatabases() {
    const apiToken = document.getElementById('notionToken').value.trim();
    if (!apiToken) {
        showStatus(getI18nMessage('loadResourcesFailed'), 'error');
        return;
    }
    
    const refreshBtn = document.getElementById('refreshDatabases');
    const targetDatabaseSelect = document.getElementById('targetDatabase');
    const originalText = getI18nMessage('buttonRefresh');
    
    refreshBtn.textContent = getI18nMessage('buttonRefreshing');
    refreshBtn.disabled = true;
    targetDatabaseSelect.innerHTML = `<option value="">${getI18nMessage('loadingResources')}</option>`;
    
    try {
        const response = await chrome.runtime.sendMessage({
            action: 'getAccessibleDatabases',
            apiToken: apiToken
        });
        
        if (response && response.success) {
            populateSelect(targetDatabaseSelect, response.databases, getI18nMessage('labelTargetDatabase'));
        } else {
            resetSelect(targetDatabaseSelect, getI18nMessage('loadResourcesFailed'));
            showStatus(response.error || getI18nMessage('loadResourcesFailed'), 'error');
        }
    } catch (error) {
        resetSelect(targetDatabaseSelect, getI18nMessage('loadResourcesFailed'));
        showStatus(error.message, 'error');
    } finally {
        refreshBtn.textContent = originalText;
        refreshBtn.disabled = false;
    }
}

// 填充选择框
function populateSelect(selectElement, items, placeholder) {
    // 清空现有选项
    selectElement.innerHTML = '';
    
    // 添加默认占位符选项（不可选择）
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = placeholder;
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectElement.appendChild(defaultOption);
    
    if (items && items.length > 0) {
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.title;
            selectElement.appendChild(option);
        });
        selectElement.disabled = false;
        
        // 尝试恢复之前保存的选择
        restoreSavedSelection(selectElement);
    } else {
        // 如果没有项目，添加"未找到资源"选项
        const noItemsOption = document.createElement('option');
        noItemsOption.value = '';
        noItemsOption.textContent = getI18nMessage('noResourcesFound');
        noItemsOption.disabled = true;
        selectElement.appendChild(noItemsOption);
        selectElement.disabled = true;
    }
}

// 恢复保存的选择
function restoreSavedSelection(selectElement) {
    if (!pendingConfig) return;
    
    let targetId = null;
    if (selectElement.id === 'targetPage' && pendingConfig.targetPageId) {
        targetId = pendingConfig.targetPageId;
    } else if (selectElement.id === 'targetDatabase' && pendingConfig.targetDatabaseId) {
        targetId = pendingConfig.targetDatabaseId;
    }
    
    if (targetId) {
        const option = selectElement.querySelector(`option[value="${targetId}"]`);
        if (option) {
            selectElement.value = targetId;
            // 取消默认选项的选中状态
            const defaultOption = selectElement.querySelector('option[value=""]');
            if (defaultOption) {
                defaultOption.selected = false;
            }
            console.log(`恢复选择: ${selectElement.id} = ${targetId} (${option.textContent})`);
        } else {
            console.warn(`无法找到保存的选项: ${selectElement.id} = ${targetId}`);
        }
    }
}

// 全局变量存储待恢复的配置
let pendingConfig = null;

// 加载已保存的设置
async function loadSettings() {
    try {
        const config = await chrome.storage.sync.get(['notionToken', 'mode', 'targetPageId', 'targetDatabaseId']);
        console.log('加载配置:', config);
        
        // 保存配置供后续使用
        pendingConfig = config;
        
        if (config.notionToken) {
            document.getElementById('notionToken').value = config.notionToken;
            onApiTokenChange(); // 触发API密钥变化处理
        }
        
        // 设置模式
        const mode = config.mode || 'database'; // 默认数据库模式
        const modeRadio = document.querySelector(`input[name="mode"][value="${mode}"]`);
        if (modeRadio) {
            modeRadio.checked = true;
            modeRadio.closest('.mode-option').classList.add('selected');
            
            // 显示对应的选择区域并触发资源加载
            if (mode === 'page') {
                document.getElementById('pageSelection').classList.add('show');
                // 如果有API密钥，立即加载页面列表
                if (config.notionToken) {
                    await refreshPages();
                }
            } else if (mode === 'database') {
                document.getElementById('databaseSelection').classList.add('show');
                // 如果有API密钥，立即加载数据库列表
                if (config.notionToken) {
                    await refreshDatabases();
                }
            }
            
            // 更新required属性
            updateRequiredAttributes(mode);
        } else {
            // 如果没有保存的模式，清除required属性
            updateRequiredAttributes(null);
        }
    } catch (error) {
        console.error('加载设置失败:', error);
    }
}

// 保存设置
async function saveSettings(event) {
    event.preventDefault();
    
    const token = document.getElementById('notionToken').value.trim();
    const selectedMode = document.querySelector('input[name="mode"]:checked');
    
    if (!token) {
        showStatus(getI18nMessage('pleaseFillApiAndDatabase'), 'error');
        return;
    }
    
    if (!selectedMode) {
        showStatus(getI18nMessage('labelMode'), 'error');
        return;
    }
    
    const mode = selectedMode.value;
    let targetId = null;
    let targetTitle = null;
    
    if (mode === 'page') {
        const targetPageSelect = document.getElementById('targetPage');
        targetId = targetPageSelect.value;
        targetTitle = targetPageSelect.options[targetPageSelect.selectedIndex]?.text;
        
        if (!targetId) {
            showStatus(getI18nMessage('labelTargetPage'), 'error');
            return;
        }
    } else if (mode === 'database') {
        const targetDatabaseSelect = document.getElementById('targetDatabase');
        targetId = targetDatabaseSelect.value;
        targetTitle = targetDatabaseSelect.options[targetDatabaseSelect.selectedIndex]?.text;
        
        if (!targetId) {
            showStatus(getI18nMessage('labelTargetDatabase'), 'error');
            return;
        }
    }
    
    const saveBtn = event.target.querySelector('button[type="submit"]');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = getI18nMessage('buttonSavingSettings');
    saveBtn.disabled = true;
    
    try {
        // 构建配置对象
        const config = {
            notionToken: token,
            mode: mode
        };
        
        if (mode === 'page') {
            config.targetPageId = targetId;
            // 为了兼容现有代码，也保存为pageId
            config.pageId = targetId;
        } else if (mode === 'database') {
            config.targetDatabaseId = targetId;
            // 为了兼容现有代码，也保存为databaseId
            config.databaseId = targetId;
        }
        
        // 保存到Chrome存储
        await chrome.storage.sync.set(config);
        
        const successMsg = getI18nMessage('configSaveSuccess');
        showStatus(`✅ ${successMsg.replace('$DATABASE$', targetTitle || targetId)}`, 'success');
    } catch (error) {
        const saveFailedMsg = getI18nMessage('saveFailed');
        showStatus(`❌ ${saveFailedMsg.replace('$ERROR$', error.message)}`, 'error');
    } finally {
        saveBtn.textContent = originalText;
        saveBtn.disabled = false;
    }
}

// 测试连接
async function testConnection() {
    const token = document.getElementById('notionToken').value.trim();
    const selectedMode = document.querySelector('input[name="mode"]:checked');
    
    if (!token) {
        showStatus(getI18nMessage('pleaseFillApiAndDatabase'), 'error');
        return;
    }
    
    if (!selectedMode) {
        showStatus(getI18nMessage('labelMode'), 'error');
        return;
    }
    
    const mode = selectedMode.value;
    let targetId = null;
    let apiUrl = null;
    
    if (mode === 'page') {
        targetId = document.getElementById('targetPage').value;
        if (!targetId) {
            showStatus(getI18nMessage('labelTargetPage'), 'error');
            return;
        }
        apiUrl = `https://api.notion.com/v1/pages/${targetId}`;
    } else if (mode === 'database') {
        targetId = document.getElementById('targetDatabase').value;
        if (!targetId) {
            showStatus(getI18nMessage('labelTargetDatabase'), 'error');
            return;
        }
        apiUrl = `https://api.notion.com/v1/databases/${targetId}`;
    }
    
    const testBtn = document.getElementById('testConnection');
    const originalText = testBtn.textContent;
    testBtn.textContent = getI18nMessage('buttonTesting');
    testBtn.disabled = true;
    
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            let title = '';
            
            if (mode === 'page') {
                // 获取页面标题
                if (data.properties) {
                    for (const [key, value] of Object.entries(data.properties)) {
                        if (value.type === 'title' && value.title && value.title.length > 0) {
                            title = value.title[0].plain_text || getI18nMessage('untitledPage');
                            break;
                        }
                    }
                }
            } else if (mode === 'database') {
                // 获取数据库标题
                title = data.title?.[0]?.plain_text || getI18nMessage('untitledDatabase');
            }
            
            const successMsg = getI18nMessage('connectionSuccess');
            showStatus(`✅ ${successMsg.replace('$DATABASE$', title)}`, 'success');
        } else {
            const errorData = await response.json();
            const failedMsg = getI18nMessage('connectionFailed');
            showStatus(`❌ ${failedMsg.replace('$ERROR$', errorData.message || 'Unknown error')}`, 'error');
        }
    } catch (error) {
        const errorMsg = getI18nMessage('connectionError');
        showStatus(`❌ ${errorMsg.replace('$ERROR$', error.message)}`, 'error');
    } finally {
        testBtn.textContent = originalText;
        testBtn.disabled = false;
    }
}

// 显示状态消息
function showStatus(message, type = 'success') {
    const statusEl = document.getElementById('status');
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
    statusEl.style.display = 'block';
    
    // 3秒后自动隐藏
    setTimeout(() => {
        statusEl.style.display = 'none';
    }, 3000);
}

// 标签管理功能
async function loadTagHistory() {
    const loadBtn = document.getElementById('loadTags');
    const originalText = loadBtn.textContent;
    loadBtn.textContent = getI18nMessage('buttonRefreshing');
    loadBtn.disabled = true;
    
    try {
        const response = await chrome.runtime.sendMessage({
            action: "getTagHistory"
        });
        
        if (response && response.success) {
            displayTags(response.tags);
        } else {
            displayTags([]);
        }
    } catch (error) {
        displayTags([]);
    } finally {
        loadBtn.textContent = originalText;
        loadBtn.disabled = false;
    }
}

async function clearTagHistory() {
    if (!confirm(getI18nMessage('confirmClearTags'))) {
        return;
    }
    
    const clearBtn = document.getElementById('clearTags');
    const originalText = clearBtn.textContent;
    clearBtn.textContent = getI18nMessage('buttonClearing');
    clearBtn.disabled = true;
    
    try {
        await chrome.storage.local.remove(['tagHistory']);
        displayTags([]);
        showStatus(`✅ ${getI18nMessage('tagsCleared') || 'Tag history cleared'}`, 'success');
    } catch (error) {
        showStatus(`❌ ${getI18nMessage('clearFailed') || 'Clear failed'}: ${error.message}`, 'error');
    } finally {
        clearBtn.textContent = originalText;
        clearBtn.disabled = false;
    }
}

function displayTags(tags) {
    const tagList = document.getElementById('tagList');
    
    if (!tags || tags.length === 0) {
        tagList.innerHTML = `<p style="color: #999; text-align: center; margin: 0;">${getI18nMessage('noTagsFound')}</p>`;
        return;
    }
    
    const tagElements = tags.map(tag => 
        `<span style="
            display: inline-block;
            background: #e7f3ff;
            color: #0066cc;
            padding: 4px 12px;
            border-radius: 12px;
            margin: 2px;
            font-size: 12px;
            border: 1px solid #b3d9ff;
            position: relative;
            cursor: pointer;
        " onclick="removeTag('${tag.replace(/'/g, '\\\'')}')" title="${getI18nMessage('clickToDelete') || 'Click to delete'}">
            ${tag} ×
        </span>`
    ).join('');
    
    tagList.innerHTML = tagElements;
}

async function removeTag(tagToRemove) {
    try {
        const result = await chrome.storage.local.get(['tagHistory']);
        let tagHistory = result.tagHistory || [];
        
        tagHistory = tagHistory.filter(tag => tag !== tagToRemove);
        
        await chrome.storage.local.set({ tagHistory });
        displayTags(tagHistory);
        showStatus(`✅ ${getI18nMessage('tagDeleted') || 'Tag deleted'}: ${tagToRemove}`, 'success');
    } catch (error) {
        showStatus(`❌ ${getI18nMessage('deleteFailed') || 'Delete failed'}: ${error.message}`, 'error');
    }
} 