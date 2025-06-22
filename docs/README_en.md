# ![Logo](../icons/icon48.png) Phoebe - Intelligent Content Collector

*Other Language Versions: [中文](../README.md) | [日本語](README_ja.md) | [한국어](README_ko.md) | [Deutsch](README_de.md)*

## 🌍 Supported Languages

- 🇨🇳 简体中文
- 🇺🇸 English
- 🇯🇵 日本語
- 🇰🇷 한국어
- 🇩🇪 Deutsch

## 📖 About Phoebe

Phoebe is an intelligent Chrome browser extension named after a smart little dog. She can help you quickly collect selected content from web pages to Notion, supporting two modes (Notion pages and databases), quick notes, tag management, and multilingual interfaces.

## ✨ Key Features

### ⚡ Quick Note Feature (v1.0.3 Complete Optimization)
- 🎯 **Independent Quick Notes**: Support pure thought recording independent of webpage content
- ⌨️ **Custom Shortcut Keys**: Configurable shortcut keys for quick note dialog invocation
- 🎨 **Clean UI Design**: Focus on content input, removing unnecessary interface elements
- 💾 **Intelligent Save Logic**: Automatic adaptation to page mode and database mode

### 🎯 Intelligent Mode Selection (v1.0.2)
- 📄 **Normal Document Mode**: Content directly added to selected page, suitable for simple collection
- 🗄️ **Database Mode**: Support page selection or new page creation, suitable for structured management

### 💫 User Experience Optimization (v1.0.3 Key Improvements)
- 🎨 **Branded UI**: Beautiful Phoebe logo dialog design
- 🔄 **Intelligent Loading**: Real-time status display for creation and save processes
- 🛡️ **Error Handling Optimization**: Improved validation prompt display and dialog behavior
- ⚡ **Prevent Duplicate Operations**: Automatic button disabling during operations for enhanced stability
- 🏷️ **Settings Page Optimization**: Tag management status display position correction

### 🔧 Core Features
- 🔍 **Intelligent Selection**: Select any webpage text and right-click to save
- 📝 **Note Function**: Add personal notes to collected content
- 🏷️ **Tag Management**: Intelligent tag suggestions and history records, one-click clear supported
- 🌍 **Multilingual Support**: Chinese, English, Japanese, Korean, German
- ⚡ **Quick Sync**: Direct save to your Notion space

## 🚀 Installation Steps

1. Download the `phoebe-v1.0.3.zip` file
2. Open Chrome browser's extensions page (`chrome://extensions/`)
3. Enable "Developer mode"
4. Click "Load unpacked extension" and select the unzipped folder
5. Configure your Notion API key and usage mode in extension settings

## ⚙️ Configuration Guide

### Step 1: Create Notion Integration
1. Visit [Notion Integrations page](https://www.notion.so/my-integrations)
2. Click "New integration" button
3. Enter integration name (e.g.: Phoebe)
4. Select associated workspace
5. Copy the generated API key (secret token)

### Step 2: Choose Usage Mode

#### 📄 Normal Document Mode
- Suitable for: Simple content collection, diary-style appending, quick notes
- Feature: Select one target page, content will be directly added to the end of the page
- Advantage: Simple configuration, content organized chronologically

#### 🗄️ Database Mode
- Suitable for: Structured content management, categorized collection
- Feature: Select one database, each save allows page selection or new page creation
- Advantage: Flexible management, supports categorization and search

### Step 3: Intelligent Configuration
1. Click the Phoebe extension icon in your browser
2. Click the "Settings" button
3. Enter "Notion API Key"
4. Select usage mode (Normal Document/Database)
5. **Intelligent Retrieval**: Phoebe automatically retrieves accessible page and database lists
6. Select target page or database from the list
7. Click "Test Connection" to verify configuration
8. Save settings

### Step 4: Shortcut Key Configuration (v1.0.3 New Addition)
1. In the "Shortcut Settings" area of the settings page
2. Click "Change Shortcut" button
3. Set your preferred key combination on the opened Chrome extension shortcuts page

### 💡 Permission Configuration Tips
If Phoebe shows insufficient permissions during use:
1. Open the corresponding Notion page or database
2. Click the "Share" button in the top-right corner
3. Search for and invite your integration (e.g.: Phoebe)
4. Grant "Edit" permissions
5. Return to the extension and refresh the resource list

## 📱 Usage

### 📝 Quick Notes (v1.0.3 Recommended Feature)
1. Use shortcut keys to quickly invoke the note dialog
2. In the popped-up clean dialog:
   - Check target page/database information
   - Enter your ideas, inspiration, or note content
   - Add tags (optional)
3. Click "Save" button to save to Notes

### 🔍 Web Content Collection
1. Select the text you want to collect on any webpage
2. Right-click and select "Save to Notes"
3. In the popped-up Phoebe dialog:
   - Review the selected content
   - Add notes (optional)
   - Add tags (optional)
   - **Database Mode**: Select target page or create new page
4. Click "Save" button

### 🗄️ Database Mode Special Features
- **Page Selection**: Choose from existing pages in the database
- **One-Click Creation**: Quickly create new pages in the database
- **Duplicate Name Detection**: Automatic detection of duplicate page names with friendly hints
- **Real-time Loading**: Shows "Phoebe is working hard to create..." during creation process

### 📄 Normal Document Mode Special Features
- **Direct Append**: Content automatically appended to the end of preset page
- **Time Marking**: Timestamp added with each save
- **Page Information**: Display target page name for confirmation
- **Quick Note Support**: Perfect support for rapid thought recording

### 🏷️ Tag Management Tips (v1.0.3 Experience Optimization)
- **Enter New Tags**: Type directly in tag input box, press Enter to add
- **Select History Tags**: Click input box to view history tag suggestions
- **Search Tags**: Enter keywords to filter tag suggestions
- **Delete Tags**: Click the × button next to added tags
- **One-Click History Clear**: Clear all tag history on settings page
- **Status Display Optimization**: Clear and delete operation prompts displayed within tag management area

## 🛠️ Project Structure

```
phoebe/
├── manifest.json           # Extension manifest file
├── _locales/              # Internationalization translation files
│   ├── zh_CN/messages.json  # Simplified Chinese
│   ├── en/messages.json     # English
│   ├── ja/messages.json     # Japanese
│   ├── ko/messages.json     # Korean
│   └── de/messages.json     # German
├── icons/                 # Extension icons
├── popup_page.html        # Popup page
├── popup_script.js        # Popup functionality script
├── options_page.html      # Settings page
├── options_script.js      # Settings functionality script
├── background_script.js   # Background service script
├── content_script.js      # Content script
└── i18n.js               # Internationalization tool
```

## 🚫 Frequently Asked Questions

### Can't save quick notes?
1. Check if target page or database is correctly configured
2. Confirm note content is not empty (required field)
3. Verify network connection and Notion API permissions

### Target page name displays empty?
- This is usually a permission configuration issue. Please confirm you have invited the integration to the target resource and granted edit permissions

### Connection failed?
1. Check if API key is correctly copied
2. Confirm page/database ID format is correct (32-character string)
3. Verify integration has been invited to target resource
4. Ensure "Edit" permissions are granted

### Mode Selection Recommendations
- **Quick Note Users Recommended**: Normal Document Mode, simple and direct
- **Content Collectors Recommended**: Database Mode, convenient for categorized management
- **Switch Anytime**: Mode can be changed anytime in settings

### Page creation failed?
1. Check if a page with the same name already exists
2. Confirm database permissions are correctly configured
3. Verify network connection stability

## 📋 Version History

For detailed version update records, please see: **[CHANGELOG_en.md](CHANGELOG_en.md)**

**Current Version**: v1.0.3 🎉
- ⚡ Complete optimization of quick note functionality
- 🎨 UI structure optimization, error handling improvements
- 💾 Save logic fixes, 400 error resolution
- 🏷️ Tag management experience enhancement

## 🤝 Contributing

Welcome to submit issue reports and feature suggestions!

## 📄 License

This project is open source under the MIT License.

## 🐕 About the Name

Phoebe is named after a smart and lovely little dog. Just like her, this extension is designed to be intelligent, practical, and reliable, helping you collect precious web content and record inspirational thoughts.

---

*Built with ❤️ for content collectors and thought recorders* 