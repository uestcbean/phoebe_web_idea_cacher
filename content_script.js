// 本地化文本缓存
let i18nTexts = {};

// 初始化本地化文本
async function initI18nTexts() {
  try {
    const response = await chrome.runtime.sendMessage({
      action: "getI18nTexts"
    });
    if (response && response.success) {
      i18nTexts = response.texts;
    }
  } catch (error) {
    console.log('获取本地化文本失败:', error);
  }
}

// 获取本地化文本
function getI18nText(key, defaultText = '') {
  return i18nTexts[key] || defaultText;
}

// 监听来自后台脚本的消息
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "saveToNotion") {
    await initI18nTexts(); // 每次显示对话框前获取最新的本地化文本
    showSaveDialog(request.data);
  } else if (request.action === "showError") {
    showNotification(request.message, 'error');
  }
});

// 显示保存对话框
function showSaveDialog(data) {
  // 创建对话框
  const dialog = document.createElement('div');
  dialog.id = 'notion-save-dialog';
  dialog.innerHTML = `
    <div style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      width: 480px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <h3 style="margin: 0 0 15px 0; color: #333;">${getI18nText('saveDialogTitle', '保存到Notion')}</h3>
      
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-weight: 500;">${getI18nText('selectPage', '选择页面:')}</label>
        <div style="display: flex; gap: 8px; align-items: center;">
          <select id="notion-page-select" style="
            flex: 1;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            background: white;
          ">
            <option value="">${getI18nText('loadingPages', '加载中...')}</option>
          </select>
          <button id="notion-create-page" style="
            padding: 8px 12px;
            background: #f0f0f0;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            white-space: nowrap;
          ">${getI18nText('createNewPage', '新建页面')}</button>
        </div>
      </div>
      
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-weight: 500;">${getI18nText('saveDialogContent', '选中内容:')}</label>
        <div style="
          max-height: 120px;
          overflow-y: auto;
          padding: 8px;
          background: #f5f5f5;
          border-radius: 4px;
          font-size: 14px;
          line-height: 1.4;
        ">${data.content}</div>
      </div>
      
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-weight: 500;">${getI18nText('saveDialogNote', '备注 (可选):')}</label>
        <textarea id="notion-note" placeholder="${getI18nText('saveDialogNotePlaceholder', '添加备注...')}" style="
          width: 100%;
          height: 60px;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          resize: vertical;
          box-sizing: border-box;
        "></textarea>
      </div>
      
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 5px; font-weight: 500;">${getI18nText('saveDialogTags', '标签 (可选):')}</label>
        <div id="notion-tags-container" style="
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 8px;
          min-height: 40px;
          background: white;
          cursor: text;
        ">
          <div id="selected-tags" style="
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            margin-bottom: 4px;
          "></div>
          <input id="notion-tag-input" type="text" placeholder="${getI18nText('saveDialogTagsPlaceholder', '输入标签，回车添加，或从下拉列表选择')}" style="
            border: none;
            outline: none;
            width: 100%;
            font-size: 14px;
            background: transparent;
          ">
        </div>
        <div id="tag-suggestions" style="
          max-height: 120px;
          overflow-y: auto;
          border: 1px solid #ddd;
          border-top: none;
          background: white;
          display: none;
        "></div>
      </div>
      
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button id="notion-cancel" style="
          padding: 8px 16px;
          background: #f0f0f0;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        ">${getI18nText('buttonCancel', '取消')}</button>
        <button id="notion-save" style="
          padding: 8px 16px;
          background: #0066cc;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        ">${getI18nText('buttonSave', '保存')}</button>
      </div>
    </div>
    
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 9999;
    "></div>
  `;
  
  document.body.appendChild(dialog);
  
  // 初始化页面选择和标签管理
  initPageSelection();
  initTagManagement();
  
  // 绑定事件
  document.getElementById('notion-cancel').onclick = () => {
    document.body.removeChild(dialog);
  };
  
  document.getElementById('notion-create-page').onclick = async () => {
    await showCreatePageDialog();
  };
  
  document.getElementById('notion-save').onclick = async () => {
    // 显示保存加载状态
    await showSaveLoading();
    
    // 禁用所有操作按钮
    disableDialogButtons(true);
    
    try {
      await saveContent();
      hideSaveLoading();
      closeDialog();
    } catch (error) {
      hideSaveLoading();
      console.error('保存失败:', error);
      showNotification(`❌ 保存失败: ${error.message}`, 'error');
    } finally {
      // 重新启用按钮
      disableDialogButtons(false);
    }
  };
  
  // 点击背景关闭
  dialog.children[1].onclick = () => {
    document.body.removeChild(dialog);
  };
}

// 初始化页面选择
async function initPageSelection() {
  const pageSelect = document.getElementById('notion-page-select');
  
  try {
    // 检查background script是否可用
    if (chrome.runtime && chrome.runtime.id) {
      // 获取配置
      const config = await chrome.storage.sync.get(['notionToken', 'databaseId']);
      if (!config.notionToken || !config.databaseId) {
        pageSelect.innerHTML = `<option value="">${getI18nText('configureFirst', '请先配置Notion API密钥和Database ID')}</option>`;
        return;
      }
      
      // 获取真实的页面列表
      const response = await chrome.runtime.sendMessage({
        action: "getDatabasePages"
      });
      
      if (response && response.success) {
        if (response.pages.length === 0) {
          pageSelect.innerHTML = `<option value="">${getI18nText('noPagesInDatabase', '数据库中暂无页面')}</option>`;
        } else {
          pageSelect.innerHTML = response.pages.map(page => 
            `<option value="${page.id}">${page.title}</option>`
          ).join('');
        }
      } else {
        pageSelect.innerHTML = `<option value="">${getI18nText('loadPagesFailed', '加载页面失败')}</option>`;
      }
    } else {
      pageSelect.innerHTML = `<option value="">${getI18nText('extensionNotInitialized', '扩展未初始化')}</option>`;
    }
    
  } catch (error) {
    console.error('加载页面列表失败:', error);
    pageSelect.innerHTML = `<option value="">${getI18nText('loadPagesFailed', '加载页面失败')}</option>`;
  }
}

// 显示创建页面的自定义弹窗
async function showCreatePageDialog() {
  // 获取正确的图标URL
  const iconUrl = chrome.runtime.getURL('icons/icon48.png');
  
  const dialog = document.createElement('div');
  dialog.id = 'create-page-dialog';
  dialog.innerHTML = `
    <div style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 25px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10001;
      width: 350px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <img src="${iconUrl}" style="width: 24px; height: 24px; margin-right: 8px;">
        <h3 style="margin: 0; color: #333; font-size: 16px;">${getI18nText('createPageDialogTitle', '创建新页面')}</h3>
      </div>
      
      <p style="margin: 0 0 15px 0; color: #666; font-size: 14px; line-height: 1.4;">
        ${getI18nText('createPageDialogDesc', '请输入页面的名称，Phoebe会帮你自动创建到Notion中 ✨')}
      </p>
      
      <input type="text" id="page-title-input" placeholder="${getI18nText('createPagePlaceholder', '例如：灵感收集、工作笔记...')}" style="
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        box-sizing: border-box;
        margin-bottom: 15px;
      ">
      
      <div id="page-name-error" style="
        color: #d32f2f;
        font-size: 13px;
        margin-bottom: 10px;
        display: none;
      "></div>
      
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button id="cancel-create-page" style="
          padding: 8px 16px;
          background: #f0f0f0;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        ">${getI18nText('buttonCancel', '取消')}</button>
        <button id="confirm-create-page" style="
          padding: 8px 16px;
          background: #0066cc;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        ">${getI18nText('buttonCreate', '创建')}</button>
      </div>
    </div>
    
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 10000;
    "></div>
  `;
  
  document.body.appendChild(dialog);
  
  // 聚焦输入框
  const input = document.getElementById('page-title-input');
  input.focus();
  
  // 绑定事件
  document.getElementById('cancel-create-page').onclick = () => {
    document.body.removeChild(dialog);
  };
  
  document.getElementById('confirm-create-page').onclick = async () => {
    const pageTitle = input.value.trim();
    if (!pageTitle) {
      showPageNameError(getI18nText('pageNameEmpty', '页面名称不能为空'));
      return;
    }
    
    // 检查是否有同名页面
    if (await checkPageNameExists(pageTitle)) {
      showPageNameError(getI18nText('pageNameExists', '已存在同名页面，请使用其他名称'));
      return;
    }
    
    // 开始创建
    await startPageCreation(pageTitle);
    document.body.removeChild(dialog);
  };
  
  // 回车创建
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('confirm-create-page').click();
    }
  });
  
  // 点击背景关闭
  dialog.children[1].onclick = () => {
    document.body.removeChild(dialog);
  };
}

// 显示页面名称错误
function showPageNameError(message) {
  const errorEl = document.getElementById('page-name-error');
  errorEl.textContent = message;
  errorEl.style.display = 'block';
  setTimeout(() => {
    errorEl.style.display = 'none';
  }, 3000);
}

// 检查页面名称是否已存在
async function checkPageNameExists(pageTitle) {
  try {
    const pageSelect = document.getElementById('notion-page-select');
    const options = pageSelect.querySelectorAll('option');
    
    for (const option of options) {
      if (option.textContent.trim() === pageTitle.trim()) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.log('检查页面名称失败:', error);
    return false;
  }
}

// 开始创建页面（带加载状态）
async function startPageCreation(pageTitle) {
  // 显示加载提示
  await showCreatePageLoading(pageTitle);
  
  // 禁用所有操作按钮
  disableDialogButtons(true);
  
  try {
    await createNewPage(pageTitle);
    hideCreatePageLoading();
  } catch (error) {
    hideCreatePageLoading();
    console.error('创建页面失败:', error);
    showNotification(`❌ ${getI18nText('createPageFailed', '创建页面失败')}: ${error.message}`, 'error');
  } finally {
    // 重新启用按钮
    disableDialogButtons(false);
  }
}

// 显示创建页面加载状态
async function showCreatePageLoading(pageTitle) {
  // 获取正确的图标URL
  const iconUrl = chrome.runtime.getURL('icons/icon48.png');
  
  const loadingDialog = document.createElement('div');
  loadingDialog.id = 'create-page-loading';
  loadingDialog.innerHTML = `
    <div style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 25px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10002;
      width: 300px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      text-align: center;
    ">
      <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
        <img src="${iconUrl}" style="width: 24px; height: 24px; margin-right: 8px;">
        <h3 style="margin: 0; color: #333; font-size: 16px;">${getI18nText('phoebeWorking', 'Phoebe正在工作中')}</h3>
      </div>
      
      <div style="
        width: 40px;
        height: 40px;
        border: 3px solid #f0f0f0;
        border-top: 3px solid #0066cc;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 15px auto;
      "></div>
      
      <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.4;">
        ${getI18nText('creatingPage', '正在努力帮你创建页面"$PAGE$"...<br>请稍等片刻 ✨').replace('$PAGE$', pageTitle)}
      </p>
    </div>
    
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.7);
      z-index: 10001;
    "></div>
    
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
  
  document.body.appendChild(loadingDialog);
}

// 隐藏创建页面加载状态
function hideCreatePageLoading() {
  const loadingDialog = document.getElementById('create-page-loading');
  if (loadingDialog) {
    document.body.removeChild(loadingDialog);
  }
}

// 禁用/启用对话框按钮
function disableDialogButtons(disable) {
  const buttons = [
    'notion-cancel',
    'notion-save', 
    'notion-create-page'
  ];
  
  buttons.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.disabled = disable;
      btn.style.opacity = disable ? '0.6' : '1';
      btn.style.cursor = disable ? 'not-allowed' : 'pointer';
    }
  });
}

// 显示通知
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    z-index: 10001;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    max-width: 300px;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}

// 标签管理功能
let selectedTags = [];
let allTags = [];

async function initTagManagement() {
  // 获取标签历史
  try {
    // 检查background script是否可用
    if (chrome.runtime && chrome.runtime.id) {
      const response = await chrome.runtime.sendMessage({
        action: "getTagHistory"
      });
      // 修复：从response.tags中获取标签数组
      allTags = (response && response.success && response.tags) ? response.tags : [];
      console.log('已加载标签历史:', allTags);
    } else {
      console.log('Background script未初始化，跳过标签历史加载');
      allTags = [];
    }
  } catch (error) {
    console.log('获取标签历史失败:', error);
    allTags = [];
  }
  
  const tagInput = document.getElementById('notion-tag-input');
  const tagContainer = document.getElementById('notion-tags-container');
  const suggestions = document.getElementById('tag-suggestions');
  
  // 输入框事件
  tagInput.addEventListener('input', handleTagInput);
  tagInput.addEventListener('keydown', handleTagKeydown);
  tagInput.addEventListener('focus', showSuggestions);
  tagInput.addEventListener('blur', hideSuggestionsDelayed);
  
  // 容器点击聚焦到输入框
  tagContainer.addEventListener('click', () => tagInput.focus());
}

function handleTagInput(event) {
  const input = event.target.value;
  if (input.length > 0) {
    showFilteredSuggestions(input);
  } else {
    showSuggestions();
  }
}

function handleTagKeydown(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    const tagText = event.target.value.trim();
    if (tagText && !selectedTags.includes(tagText)) {
      addTag(tagText);
      event.target.value = '';
      hideSuggestions();
    }
  } else if (event.key === 'Backspace' && event.target.value === '' && selectedTags.length > 0) {
    removeTag(selectedTags[selectedTags.length - 1]);
  }
}

function addTag(tagText) {
  selectedTags.push(tagText);
  if (!allTags.includes(tagText)) {
    allTags.push(tagText);
    // 立即保存新标签到历史记录
    if (chrome.runtime && chrome.runtime.id) {
      chrome.runtime.sendMessage({
        action: "saveTagsToHistory",
        tags: [tagText]
      }).catch(error => {
        console.log('保存标签失败:', error);
      });
    }
  }
  renderSelectedTags();
}

function removeTag(tagText) {
  selectedTags = selectedTags.filter(tag => tag !== tagText);
  renderSelectedTags();
}

function renderSelectedTags() {
  const container = document.getElementById('selected-tags');
  container.innerHTML = '';
  
  selectedTags.forEach(tag => {
    const tagElement = document.createElement('span');
    tagElement.style.cssText = `
      background: #e3f2fd;
      color: #1976d2;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
    `;
    
    const tagText = document.createElement('span');
    tagText.textContent = tag;
    
    const removeBtn = document.createElement('span');
    removeBtn.innerHTML = '×';
    removeBtn.style.cssText = `
      cursor: pointer;
      font-weight: bold;
      opacity: 0.7;
    `;
    removeBtn.onclick = () => removeTag(tag);
    
    tagElement.appendChild(tagText);
    tagElement.appendChild(removeBtn);
    container.appendChild(tagElement);
  });
}

function showSuggestions() {
  const suggestions = document.getElementById('tag-suggestions');
  suggestions.innerHTML = '';
  
  const availableTags = allTags.filter(tag => !selectedTags.includes(tag));
  
  if (availableTags.length === 0) {
    suggestions.style.display = 'none';
    return;
  }
  
  availableTags.forEach(tag => {
    const item = document.createElement('div');
    item.style.cssText = `
      padding: 8px 12px;
      cursor: pointer;
      border-bottom: 1px solid #f0f0f0;
      font-size: 14px;
    `;
    item.textContent = tag;
    
    item.onmouseenter = () => item.style.background = '#f5f5f5';
    item.onmouseleave = () => item.style.background = 'white';
    item.onclick = () => {
      addTag(tag);
      document.getElementById('notion-tag-input').value = '';
      hideSuggestions();
    };
    
    suggestions.appendChild(item);
  });
  
  suggestions.style.display = 'block';
}

function showFilteredSuggestions(filter) {
  const suggestions = document.getElementById('tag-suggestions');
  suggestions.innerHTML = '';
  
  const filteredTags = allTags.filter(tag => 
    !selectedTags.includes(tag) && 
    tag.toLowerCase().includes(filter.toLowerCase())
  );
  
  if (filteredTags.length === 0) {
    suggestions.style.display = 'none';
    return;
  }
  
  filteredTags.forEach(tag => {
    const item = document.createElement('div');
    item.style.cssText = `
      padding: 8px 12px;
      cursor: pointer;
      border-bottom: 1px solid #f0f0f0;
      font-size: 14px;
    `;
    item.textContent = tag;
    
    item.onmouseenter = () => item.style.background = '#f5f5f5';
    item.onmouseleave = () => item.style.background = 'white';
    item.onclick = () => {
      addTag(tag);
      document.getElementById('notion-tag-input').value = '';
      hideSuggestions();
    };
    
    suggestions.appendChild(item);
  });
  
  suggestions.style.display = 'block';
}

function hideSuggestions() {
  const suggestions = document.getElementById('tag-suggestions');
  suggestions.style.display = 'none';
}

function hideSuggestionsDelayed() {
  setTimeout(hideSuggestions, 150);
}

function getSelectedTags() {
  return selectedTags;
}

// 创建新页面
async function createNewPage(pageTitle) {
  try {
    // 检查background script是否可用
    if (!chrome.runtime || !chrome.runtime.id) {
      throw new Error(getI18nText('extensionNotInitializedRetry', '扩展未初始化，请刷新页面重试'));
    }
    
    const response = await chrome.runtime.sendMessage({
      action: "createPageInDatabase",
      pageTitle: pageTitle
    });
    
    if (response && response.success) {
      const pageSelect = document.getElementById('notion-page-select');
      
      const option = document.createElement('option');
      option.value = response.page.id;
      option.textContent = response.page.title;
      pageSelect.appendChild(option);
      pageSelect.value = response.page.id;
      
      showNotification(`✅ ${getI18nText('pageCreatedSuccess', '新页面 "$PAGE$" 创建成功').replace('$PAGE$', pageTitle)}`, 'success');
    } else {
      throw new Error(response.error || getI18nText('createPageFailed', '创建页面失败'));
    }
  } catch (error) {
    throw error; // 重新抛出错误给上层处理
  }
}

// 显示保存加载状态
async function showSaveLoading() {
  // 获取正确的图标URL
  const iconUrl = chrome.runtime.getURL('icons/icon48.png');
  
  const loadingDialog = document.createElement('div');
  loadingDialog.id = 'save-loading';
  loadingDialog.innerHTML = `
    <div style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 25px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10002;
      width: 280px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      text-align: center;
    ">
      <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
        <img src="${iconUrl}" style="width: 24px; height: 24px; margin-right: 8px;">
        <h3 style="margin: 0; color: #333; font-size: 16px;">${getI18nText('phoebeSaving', 'Phoebe正在保存')}</h3>
      </div>
      
      <div style="
        width: 40px;
        height: 40px;
        border: 3px solid #f0f0f0;
        border-top: 3px solid #0066cc;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 15px auto;
      "></div>
      
      <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.4;">
        ${getI18nText('savingToNotion', '正在保存到Notion中...<br>请稍等片刻 ✨')}
      </p>
    </div>
    
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.7);
      z-index: 10001;
    "></div>
    
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
  
  document.body.appendChild(loadingDialog);
}

// 隐藏保存加载状态
function hideSaveLoading() {
  const loadingDialog = document.getElementById('save-loading');
  if (loadingDialog) {
    document.body.removeChild(loadingDialog);
  }
}

// 保存内容到Notion
async function saveContent() {
  const selectedPageId = document.getElementById('notion-page-select').value;
  const note = document.getElementById('notion-note').value;
  const tags = getSelectedTags();
  
  if (!selectedPageId) {
    throw new Error(getI18nText('pleaseSelectPage', '请选择一个页面'));
  }
  
  // 检查background script是否可用
  if (!chrome.runtime || !chrome.runtime.id) {
    throw new Error(getI18nText('extensionNotInitializedRetry', '扩展未初始化，请刷新页面重试'));
  }
  
  const response = await chrome.runtime.sendMessage({
    action: "saveToNotionAPI",
    data: {
      ...data,
      pageId: selectedPageId,
      note: note,
      tags: tags
    }
  });
  
  if (response && response.success) {
    // 保存使用过的标签到历史记录
    if (tags.length > 0) {
      chrome.runtime.sendMessage({
        action: "saveTagsToHistory",
        tags: tags
      }).catch(error => {
        console.log('保存标签历史失败:', error);
      });
    }
    
    showNotification(getI18nText('saveSuccess', '成功保存到Notion!'), 'success');
  } else {
    const errorMsg = response && response.error ? response.error : getI18nText('errorNetwork', '未知错误，请检查网络连接');
    throw new Error(errorMsg);
  }
}

// 关闭对话框
function closeDialog() {
  const dialog = document.getElementById('notion-dialog');
  if (dialog) {
    document.body.removeChild(dialog);
  }
}