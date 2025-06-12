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
      width: 400px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <h3 style="margin: 0 0 15px 0; color: #333;">${getI18nText('saveDialogTitle', '保存到Notion')}</h3>
      
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-weight: 500;">${getI18nText('saveDialogContent', '选中内容:')}</label>
        <div style="
          max-height: 100px;
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
  
  // 初始化标签管理
  initTagManagement();
  
  // 绑定事件
  document.getElementById('notion-cancel').onclick = () => {
    document.body.removeChild(dialog);
  };
  
  document.getElementById('notion-save').onclick = async () => {
    const note = document.getElementById('notion-note').value;
    const tags = getSelectedTags();
    
    const saveButton = document.getElementById('notion-save');
    saveButton.textContent = getI18nText('buttonSaving', '保存中...');
    saveButton.disabled = true;
    
    try {
      const response = await chrome.runtime.sendMessage({
        action: "saveToNotionAPI",
        data: {
          ...data,
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
          });
        }
        
        showNotification(getI18nText('saveSuccess', '成功保存到Notion!'), 'success');
        document.body.removeChild(dialog);
      } else {
        const errorMsg = response && response.error ? response.error : getI18nText('errorNetwork', '未知错误，请检查网络连接');
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('保存错误:', error);
      showNotification(`${getI18nText('saveFailed', '保存失败')}: ${error.message}`, 'error');
      saveButton.textContent = getI18nText('buttonSave', '保存');
      saveButton.disabled = false;
    }
  };
  
  // 点击背景关闭
  dialog.children[1].onclick = () => {
    document.body.removeChild(dialog);
  };
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
    const response = await chrome.runtime.sendMessage({
      action: "getTagHistory"
    });
    // 修复：从response.tags中获取标签数组
    allTags = (response && response.success && response.tags) ? response.tags : [];
    console.log('已加载标签历史:', allTags);
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
    chrome.runtime.sendMessage({
      action: "saveTagsToHistory",
      tags: [tagText]
    }).catch(error => {
      console.log('保存标签失败:', error);
    });
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