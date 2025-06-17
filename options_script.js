// Notion文摘收集器 - 选项页面脚本

// 加载已保存的设置
async function loadSettings() {
    try {
        const config = await chrome.storage.sync.get(['notionToken', 'databaseId']);
        
        if (config.notionToken) {
            document.getElementById('notionToken').value = config.notionToken;
        }
        
        if (config.databaseId) {
            document.getElementById('databaseId').value = config.databaseId;
        }
    } catch (error) {
        console.error('加载设置失败:', error);
    }
}

// 保存设置
async function saveSettings(event) {
    event.preventDefault();
    
    const token = document.getElementById('notionToken').value.trim();
    const databaseId = document.getElementById('databaseId').value.trim();
    
    if (!token || !databaseId) {
        showStatus(getI18nMessage('pleaseFillApiAndDatabase') || '请填写API密钥和Database ID', 'error');
        return;
    }
    
    const saveBtn = event.target.querySelector('button[type="submit"]');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = getI18nMessage('buttonSavingSettings') || '💾 保存中...';
    saveBtn.disabled = true;
    
    try {
        // 先测试连接
        const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Notion-Version': '2022-06-28'
            }
        });
        
        if (response.ok) {
            // 保存到Chrome存储
            await chrome.storage.sync.set({
                notionToken: token,
                databaseId: databaseId
            });
            
            const data = await response.json();
            const dbTitle = data.title?.[0]?.plain_text || getI18nMessage('untitledDatabase') || '未命名数据库';
            const successMsg = getI18nMessage('configSaveSuccess') || '配置已保存并验证！目标数据库: $DATABASE$';
            showStatus(`✅ ${successMsg.replace('$DATABASE$', dbTitle)}`, 'success');
        } else {
            const errorData = await response.json();
            const errorMsg = getI18nMessage('configVerifyFailed') || '配置验证失败: $ERROR$';
            const defaultError = getI18nMessage('pleaseFillApiAndDatabase') || '请检查API密钥和Database ID';
            showStatus(`❌ ${errorMsg.replace('$ERROR$', errorData.message || defaultError)}`, 'error');
        }
    } catch (error) {
        const saveFailedMsg = getI18nMessage('saveFailed') || '保存失败: $ERROR$';
        showStatus(`❌ ${saveFailedMsg.replace('$ERROR$', error.message)}`, 'error');
    } finally {
        saveBtn.textContent = originalText;
        saveBtn.disabled = false;
    }
}

// 测试Notion API连接
async function testConnection() {
    const token = document.getElementById('notionToken').value.trim();
    const databaseId = document.getElementById('databaseId').value.trim();
    
    if (!token || !databaseId) {
        showStatus(getI18nMessage('pleaseFillApiAndDatabase') || '请先填写API密钥和Database ID', 'error');
        return;
    }
    
    const testBtn = document.getElementById('testConnection');
    const originalText = testBtn.textContent;
    testBtn.textContent = getI18nMessage('buttonTesting') || '🔄 测试中...';
    testBtn.disabled = true;
    
    try {
        const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const dbTitle = data.title?.[0]?.plain_text || getI18nMessage('untitledDatabase') || '未命名数据库';
            const successMsg = getI18nMessage('connectionSuccess') || '连接成功！目标数据库: $DATABASE$';
            showStatus(`✅ ${successMsg.replace('$DATABASE$', dbTitle)}`, 'success');
        } else {
            const errorData = await response.json();
            const failedMsg = getI18nMessage('connectionFailed') || '连接失败: $ERROR$';
            showStatus(`❌ ${failedMsg.replace('$ERROR$', errorData.message || '未知错误')}`, 'error');
        }
    } catch (error) {
        const errorMsg = getI18nMessage('connectionError') || '连接错误: $ERROR$';
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

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化国际化
    initI18n();
    
    // 绑定事件
    document.getElementById('settingsForm').addEventListener('submit', saveSettings);
    document.getElementById('testConnection').addEventListener('click', testConnection);
    document.getElementById('loadTags').addEventListener('click', loadTagHistory);
    document.getElementById('clearTags').addEventListener('click', clearTagHistory);
    
    // 加载已保存的设置
    loadSettings();
    
    // 自动加载标签历史
    loadTagHistory();
});

// 标签管理功能
async function loadTagHistory() {
    const loadBtn = document.getElementById('loadTags');
    const originalText = loadBtn.textContent;
    loadBtn.textContent = getI18nMessage('buttonRefreshing') || '🔄 刷新中...';
    loadBtn.disabled = true;
    
    try {
        const response = await chrome.runtime.sendMessage({
            action: "getTagHistory"
        });
        
        if (response && response.success) {
            displayTags(response.tags);
        } else {
            // 首次加载时不显示错误，只有手动刷新时才显示
            if (originalText !== '🔄 刷新标签') {
                displayTags([]); // 显示空状态
            } else {
                showStatus('❌ 刷新标签失败', 'error');
            }
        }
    } catch (error) {
        // 首次加载时不显示错误，只有手动刷新时才显示
        if (originalText !== '🔄 刷新标签') {
            displayTags([]); // 显示空状态
        } else {
            showStatus(`❌ 刷新标签错误: ${error.message}`, 'error');
        }
    } finally {
        loadBtn.textContent = originalText;
        loadBtn.disabled = false;
    }
}

async function clearTagHistory() {
    if (!confirm(getI18nMessage('confirmClearTags') || '确定要清空所有标签历史记录吗？此操作不可撤销。')) {
        return;
    }
    
    const clearBtn = document.getElementById('clearTags');
    const originalText = clearBtn.textContent;
    clearBtn.textContent = getI18nMessage('buttonClearing') || '🗑️ 清空中...';
    clearBtn.disabled = true;
    
    try {
        await chrome.storage.local.remove(['tagHistory']);
        displayTags([]);
        showStatus('✅ 标签历史已清空', 'success');
    } catch (error) {
        showStatus(`❌ 清空失败: ${error.message}`, 'error');
    } finally {
        clearBtn.textContent = originalText;
        clearBtn.disabled = false;
    }
}

function displayTags(tags) {
    const tagList = document.getElementById('tagList');
    
    if (tags.length === 0) {
        tagList.innerHTML = `<p style="color: #999; text-align: center; margin: 0;">${getI18nMessage('tagsEmpty') || '暂无标签历史记录'}</p>`;
        return;
    }
    
    tagList.innerHTML = `
        <p style="margin: 0 0 10px 0; color: #666;">${getI18nMessage('tagsCount', [tags.length]) || `共 ${tags.length} 个标签：`}</p>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${tags.map(tag => `
                <span style="
                    background: #e3f2fd;
                    color: #1976d2;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 13px;
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                ">
                    ${tag}
                    <button onclick="removeTag('${tag}')" style="
                        background: none;
                        border: none;
                        color: #1976d2;
                        cursor: pointer;
                        padding: 0;
                        font-size: 16px;
                        line-height: 1;
                        opacity: 0.7;
                    " title="删除此标签">×</button>
                </span>
            `).join('')}
        </div>
    `;
}

async function removeTag(tagToRemove) {
    if (!confirm(getI18nMessage('confirmDeleteTag', [tagToRemove]) || `确定要删除标签 "${tagToRemove}" 吗？`)) {
        return;
    }
    
    try {
        const result = await chrome.storage.local.get(['tagHistory']);
        let tagHistory = result.tagHistory || [];
        tagHistory = tagHistory.filter(tag => tag !== tagToRemove);
        
        await chrome.storage.local.set({ tagHistory });
        displayTags(tagHistory);
        showStatus(`✅ 已删除标签 "${tagToRemove}"`, 'success');
    } catch (error) {
        showStatus(`❌ 删除失败: ${error.message}`, 'error');
    }
} 