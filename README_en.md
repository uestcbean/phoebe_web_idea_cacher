# 🐕 Phoebe - Smart Content Collector

*Other languages: [中文](README.md) | [日本語](README_ja.md) | [한국어](README_ko.md) | [Deutsch](README_de.md)*

---

## 📖 About Phoebe

Phoebe is an intelligent Chrome extension named after a smart little dog. She helps you quickly collect web content to Notion with tag management and multilingual interface support.

## ✨ Key Features

- 🔍 **Smart Selection**: Select any web text and save with right-click
- 📝 **Notes Feature**: Add personal notes to collected content
- 🏷️ **Tag Management**: Smart tag suggestions and history
- 🌍 **Multilingual**: Chinese, English, Japanese, Korean, German
- ⚡ **Quick Sync**: Save directly to your Notion pages
- 🎨 **Beautiful UI**: Modern design with easy operation

## 🚀 Installation

1. Download the `phoebe-v1.0.1.zip` file
2. Open Chrome extensions page (`chrome://extensions/`)
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extracted folder
5. Configure your Notion API token and page ID in settings

## ⚙️ Setup Guide

### Step 1: Create Notion Integration
1. Visit [Notion Integrations](https://www.notion.so/my-integrations)
2. Click "New integration" button
3. Fill in integration name (e.g., Phoebe)
4. Select associated workspace
5. Copy the generated API token (secret)

### Step 2: Setup Target Page
1. Create or select a page in Notion as collection target
2. Click "Share" button in the top-right corner of the page
3. Click "Invite", search for the integration name you just created
4. Grant "Edit" permissions to the integration
5. Copy the page ID from the page URL (32-character string)
   ```
   Example: https://notion.so/workspace/page-title-123abc456def789...
   Page ID is the last 32-character string: 123abc456def789...
   ```

### Step 3: Configure Extension
1. Click the Phoebe extension icon in your browser
2. Click "Settings" button
3. Paste the API token from Step 1 into "Notion API Token"
4. Paste the page ID from Step 2 into "Page ID"
5. Click "Test Connection" to verify configuration
6. Click "Save Settings" after successful configuration

## 📱 How to Use

### Basic Usage
1. Select text you want to collect on any webpage
2. Right-click and choose "Save to Notion"
3. In the popup dialog:
   - Review the selected content
   - Add notes (optional)
   - Add tags (optional)
4. Click "Save" button

### Tag Management Tips
- **Add new tags**: Type in the tag input field and press Enter
- **Select from history**: Click the input field to see tag suggestions
- **Search tags**: Type keywords to filter tag suggestions
- **Remove tags**: Click the × button next to added tags
- **Manage history**: View and manage all tag history in settings page

## 🏷️ Tag Management Features

Phoebe provides powerful tag management functionality:

- **Smart Suggestions**: Provides tag suggestions based on usage history
- **Auto-complete**: Automatically searches matching historical tags while typing
- **History Recording**: Automatically saves all tags you've used
- **Batch Management**: View and delete tag history in settings page
- **Instant Sync**: Newly added tags immediately appear in suggestion list

## 🌍 Multilingual Support

Phoebe supports the following languages and automatically switches based on your browser language:

- 🇨🇳 Simplified Chinese
- 🇺🇸 English
- 🇯🇵 Japanese
- 🇰🇷 Korean
- 🇩🇪 German

## 🛠️ Project Structure

```
phoebe/
├── manifest.json           # Extension manifest
├── _locales/              # Internationalization files
│   ├── zh_CN/messages.json  # Simplified Chinese
│   ├── en/messages.json     # English
│   ├── ja/messages.json     # Japanese
│   ├── ko/messages.json     # Korean
│   └── de/messages.json     # German
├── icons/                 # Extension icons
├── popup_page.html        # Popup page
├── popup_script.js        # Popup functionality
├── options_page.html      # Settings page
├── options_script.js      # Settings functionality
├── background_script.js   # Background service worker
├── content_script.js      # Content script
└── i18n.js               # Internationalization utilities
```

## 🚫 Troubleshooting

### Connection Failed?
1. Check if API token is correctly copied
2. Verify page ID format is correct (32-character string)
3. Confirm integration is invited to target page
4. Ensure "Edit" permissions are granted

### Tags Not Displaying?
1. Try refreshing extension status
2. Check browser console for errors
3. Reopen the save dialog

### Content Save Failed?
1. Check network connection
2. Verify Notion page is accessible
3. Confirm API token permissions are correct

## 🤝 Contributing

We welcome issue reports and feature suggestions!

## 📄 License

This project is open-sourced under the MIT License.

## 🐕 About the Name

Phoebe is named after a smart and lovely dog. Just like her, this extension is designed to be intelligent, practical, and reliable in helping you collect valuable web content.

---

*Made with ❤️ for content collectors everywhere* 