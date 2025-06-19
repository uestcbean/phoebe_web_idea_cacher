# ![Logo](icons/icon48.png) Phoebe - Smart Content Collector

*Other Languages: [简体中文](README.md) | [日本語](README_ja.md) | [한국어](README_ko.md) | [Deutsch](README_de.md)*

## 🌍 Supported Languages

- 🇺🇸 English
- 🇨🇳 简体中文
- 🇯🇵 日本語
- 🇰🇷 한국어
- 🇩🇪 Deutsch

## 📖 About Phoebe

Phoebe is an intelligent Chrome browser extension named after a smart little dog. She helps you quickly collect valuable web content to Notion with intelligent mode selection, tag management, and multilingual interface support.

## ✨ Key Features

### 🎯 Intelligent Mode Selection (v1.0.2 New)
- 📄 **Page Mode**: Content is directly appended to selected pages, perfect for simple collection
- 🗄️ **Database Mode**: Support for page selection or creating new pages, ideal for structured management

### 💫 User Experience Optimization (v1.0.2 New)
- 🎨 **Branded UI**: Beautiful Phoebe logo dialog design
- 🔄 **Smart Loading**: Real-time status indicators for creation and saving processes
- 🛡️ **Duplicate Detection**: Automatic detection of duplicate page names to avoid confusion
- ⚡ **Prevent Duplicate Operations**: Buttons automatically disabled during operations for improved stability

### 🔧 Core Features
- 🔍 **Smart Selection**: Select any web text and right-click to save
- 📝 **Note Function**: Add personal notes to collected content
- 🏷️ **Tag Management**: Smart tag suggestions and history
- 🌍 **Multilingual Support**: Chinese, English, Japanese, Korean, German
- ⚡ **Quick Sync**: Save directly to your Notion workspace

## 🚀 Installation Steps

1. Download the `phoebe-v1.0.2.zip` file
2. Open Chrome browser's extensions page (`chrome://extensions/`)
3. Enable "Developer mode"
4. Click "Load unpacked extension" and select the unzipped folder
5. Configure your Notion API key and usage mode in plugin settings

## ⚙️ Configuration Guide

### Step 1: Create Notion Integration
1. Visit [Notion Integrations page](https://www.notion.so/my-integrations)
2. Click "New integration" button
3. Fill in integration name (e.g., Phoebe)
4. Select associated workspace
5. Copy the generated API key (secret token)

### Step 2: Choose Usage Mode (v1.0.2 New)

#### 📄 Page Mode
- Suitable for: Simple content collection, diary-style appending
- Features: Select a target page where content will be directly appended to the end
- Advantages: Simple configuration, content organized chronologically

#### 🗄️ Database Mode
- Suitable for: Structured content management, categorized collection
- Features: Select a database, choose pages or create new ones for each save
- Advantages: Flexible management with support for categorization and search

### Step 3: Smart Configuration (v1.0.2 New)
1. Click the Phoebe plugin icon in your browser
2. Click the "Settings" button
3. Enter "Notion API Key"
4. Select usage mode (Page/Database)
5. **Smart Retrieval**: Phoebe automatically fetches your accessible pages and databases
6. Select target page or database from the list
7. Click "Test Connection" to verify configuration
8. Save settings

### 💡 Permission Configuration Tips
If Phoebe prompts for insufficient permissions during use:
1. Open the corresponding Notion page or database
2. Click the "Share" button in the top-right corner
3. Search for and invite your integration (e.g., Phoebe)
4. Grant "Edit" permissions
5. Return to the plugin and refresh the resource list

## 📱 Usage

### Basic Usage
1. Select the text you want to collect on any webpage
2. Right-click and select "Save to Notion"
3. In the Phoebe dialog that appears:
   - Review the selected content
   - Add notes (optional)
   - Add tags (optional)
   - **Database Mode**: Select target page or create new page
4. Click "Save" button

### 🗄️ Database Mode Features
- **Page Selection**: Choose from existing pages in the database
- **One-Click Creation**: Quickly create new pages in the database
- **Duplicate Detection**: Automatic detection of duplicate page names with friendly prompts
- **Real-time Loading**: Creation process shows "Phoebe is working hard to create for you..."

### 📄 Page Mode Features
- **Direct Append**: Content automatically appended to the end of preset page
- **Time Stamps**: Each save adds a timestamp
- **Page Info**: Display target page name for confirmation

### 🏷️ Tag Management Tips
- **Add New Tags**: Type directly in tag input box, press Enter to add
- **Select History Tags**: Click input box to see historical tag suggestions
- **Search Tags**: Type keywords to filter tag suggestions
- **Remove Tags**: Click the × button next to added tags

## 🛠️ Project Structure

```
phoebe/
├── manifest.json           # Extension manifest file
├── _locales/              # Internationalization files
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
└── i18n.js               # Internationalization utilities
```

## 🚫 Troubleshooting

### Connection Failed?
1. Check if API key is correctly copied
2. Verify page/database ID format is correct (32-character string)
3. Confirm integration has been invited to target resource
4. Ensure "Edit" permissions are granted

### Mode Selection Recommendations
- **New Users**: Try Page Mode first, simple and easy to use
- **Advanced Users**: Use Database Mode for more powerful features
- **Flexible Switching**: You can change modes anytime in settings

### Page Creation Failed?
1. Check if a page with the same name already exists
2. Confirm database permissions are configured correctly
3. Verify network connection is stable

## 📋 Version History

### v1.0.2 (Latest Version) 🎉
**Intelligent Mode Selection + Major UI Experience Improvements**
- 🎯 **Dual Mode Support**: Page Mode + Database Mode to meet different needs
- ✨ **Branded UI**: New Phoebe logo dialogs for better visual experience
- 🔄 **Smart Loading States**: Real-time indicators for creation and saving processes
- 🛡️ **Duplicate Page Detection**: Automatic detection of duplicate names to avoid confusion
- 🎨 **Button State Optimization**: Smart disabling during operations to prevent duplicate submissions
- 💬 **Warm User Messages**: Humanized user guidance and feedback
- 🔧 **CORS Issue Fix**: Resolved technical issues with page information retrieval

### v1.0.1
**Database Mode Support**
- 🗃️ Notion Database API support, replacing simple page connections
- 📋 Page selection functionality from databases
- ➕ Quick new page creation feature
- 🏷️ Tag property configuration support
- 🌍 Complete multilingual support (5 languages)

### v1.0.0
**Basic Features**
- 📝 Basic content collection and saving
- 🏷️ Tag management system
- 🌍 Multilingual interface support
- ⚙️ Notion API integration

## 🤝 Contributing

Welcome to submit issue reports and feature suggestions!

## 📄 License

This project is open source under the MIT License.

## 🐕 About the Name

Phoebe is named after a smart and lovely little dog. Just like her, this extension is designed to be intelligent, practical, and reliable, helping you collect precious web content.

---

*Built with ❤️ for content collectors* 