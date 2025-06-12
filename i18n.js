// 国际化工具脚本
// 统一处理所有页面的多语言支持

/**
 * 初始化页面国际化
 */
function initI18n() {
    // 处理所有带有 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const messageKey = element.getAttribute('data-i18n');
        const localizedText = chrome.i18n.getMessage(messageKey);
        if (localizedText) {
            if (element.tagName === 'INPUT' && (element.type === 'button' || element.type === 'submit')) {
                element.value = localizedText;
            } else if (element.hasAttribute('placeholder')) {
                element.placeholder = localizedText;
            } else {
                element.textContent = localizedText;
            }
        }
    });
    
    // 处理带有 data-i18n-placeholder 的元素
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const messageKey = element.getAttribute('data-i18n-placeholder');
        const localizedText = chrome.i18n.getMessage(messageKey);
        if (localizedText) {
            element.placeholder = localizedText;
        }
    });
    
    // 处理带有 data-i18n-title 的元素
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const messageKey = element.getAttribute('data-i18n-title');
        const localizedText = chrome.i18n.getMessage(messageKey);
        if (localizedText) {
            element.title = localizedText;
        }
    });
    
    // 更新文档标题
    const titleElement = document.querySelector('title[data-i18n]');
    if (titleElement) {
        const messageKey = titleElement.getAttribute('data-i18n');
        const localizedTitle = chrome.i18n.getMessage(messageKey);
        if (localizedTitle) {
            document.title = localizedTitle;
        }
    }
}

/**
 * 获取本地化文本
 * @param {string} messageKey 消息键
 * @param {string[]} substitutions 替换参数
 * @returns {string} 本地化文本
 */
function getI18nMessage(messageKey, substitutions = []) {
    return chrome.i18n.getMessage(messageKey, substitutions) || messageKey;
}

/**
 * 动态更新元素文本
 * @param {string} elementId 元素ID
 * @param {string} messageKey 消息键
 * @param {string[]} substitutions 替换参数
 */
function updateElementText(elementId, messageKey, substitutions = []) {
    const element = document.getElementById(elementId);
    if (element) {
        const localizedText = getI18nMessage(messageKey, substitutions);
        if (element.tagName === 'INPUT' && (element.type === 'button' || element.type === 'submit')) {
            element.value = localizedText;
        } else {
            element.textContent = localizedText;
        }
    }
}

/**
 * 动态更新按钮状态文本
 * @param {string} buttonId 按钮ID
 * @param {string} normalKey 正常状态消息键
 * @param {string} loadingKey 加载状态消息键
 * @param {boolean} isLoading 是否为加载状态
 */
function updateButtonState(buttonId, normalKey, loadingKey, isLoading) {
    const button = document.getElementById(buttonId);
    if (button) {
        const messageKey = isLoading ? loadingKey : normalKey;
        const localizedText = getI18nMessage(messageKey);
        button.textContent = localizedText;
        button.disabled = isLoading;
    }
} 