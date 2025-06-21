# ![Logo](../icons/icon48.png) Phoebe - Changelog

*Other Language Versions: [中文](CHANGELOG.md) | [日本語](CHANGELOG_ja.md) | [한국어](CHANGELOG_ko.md) | [Deutsch](CHANGELOG_de.md)*

## 📋 Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.3] 🎉

### Added
- ⚡ **Complete Quick Note Reconstruction**: Enhanced configuration retrieval logic, fixed target page name display issue
- ⌨️ **Enhanced Shortcut Support**: Improved shortcut configuration functionality with custom key combination support
- 🏷️ **Dedicated Tag Management Status**: Added independent status notification area for tag management section

### Changed
- 🎨 **Quick Note UI Structure Optimization**: Removed irrelevant current webpage information display for cleaner, focused interface
- 💾 **Save Logic Improvement**: Quick notes no longer include source URL information, perfectly adapted for pure thought recording
- 🛡️ **Error Handling Optimization**: Improved dialog behavior on validation failure, ensuring consistent user experience

### Fixed
- 🔧 **Fixed Quick Note Configuration Issue**: Added missing notionToken parameter, resolved root cause of page information retrieval failure
- 💥 **Fixed 400 Error**: Resolved Notion API error caused by empty URL in quick note saving
- 📍 **Fixed Tag Management Notification Position**: Clear tag success notifications now correctly display within tag management area
- 🔄 **Fixed Inconsistent Dialog Behavior**: Unified validation failure handling logic for right-click save and quick note

### Technical Improvements
- 🔄 **Refactored showQuickNoteDialog Function**: Enhanced configuration retrieval and optimized UI structure
- 🛠️ **Optimized Background Script**: Improved URL handling logic in appendToPage and createPageInDatabase functions
- 📝 **Enhanced Error Validation Logic**: Used throw Error instead of return to ensure proper exception handling flow

---

## [1.0.2]

### Added
- 🎯 **Intelligent Mode Selection**: Support for both Page Mode and Database Mode
- ✨ **Branded UI Design**: New Phoebe logo dialog for enhanced visual experience
- 🔄 **Smart Loading Status**: Real-time status notifications during creation and saving processes
- 🛡️ **Duplicate Page Detection**: Automatic detection of duplicate page names to avoid confusion

### Changed
- 🎨 **Button State Optimization**: Smart disable during operations to prevent duplicate submissions
- 💬 **Humanized Notification Text**: Warmer user guidance and feedback messages
- 📋 **Settings Page Optimization**: Smart retrieval of page and database lists

### Fixed
- 🔧 **CORS Issue Resolution**: Solved technical issues with page information retrieval
- 🌐 **Cross-origin Request Optimization**: Improved API call stability

### Features
- 📄 **Page Mode**: Content directly appended to selected page, suitable for simple collection
- 🗄️ **Database Mode**: Support for page selection or new page creation, suitable for structured management
- 🎨 **Real-time Status Notifications**: Friendly messages like "Phoebe is working hard to create for you..."

---

## [1.0.1]

### Added
- 🗃️ **Database Mode Support**: Support for Notion Database API, replacing simple page connections
- 📋 **Page Selection Feature**: Select target pages from database
- ➕ **Quick New Page Creation**: One-click new page creation in database
- 🏷️ **Tag Property Configuration**: Support for database tag property configuration
- 🌍 **Complete Multi-language Support**: Support for Chinese, English, Japanese, Korean, and German

### Changed
- 🔄 **API Call Optimization**: Upgraded from Page API to Database API
- 📝 **Simplified Configuration Process**: Automatic retrieval of accessible database lists
- 🎯 **Enhanced User Experience**: More intuitive page selection and creation process

### Features
- 🗄️ **Database Integration**: Complete Notion database functionality support
- 🏷️ **Tag System**: Smart tag suggestions and history records
- 🌐 **Internationalized Interface**: Automatic interface language switching based on browser language

---

## [1.0.0]

### Added
- 📝 **Basic Content Collection**: Select webpage text, right-click to save to Notion
- 🏷️ **Tag Management System**: Support for adding and managing tags
- 🌍 **Multi-language Interface**: Initial support for Chinese and English
- ⚙️ **Notion API Integration**: Basic API connection and authentication
- 🎨 **User Interface**: Clean popup and settings pages

### Features
- 🔍 **Smart Selection**: Automatic recognition of selected webpage text
- 📋 **Simple Configuration**: Connect to Notion via API key
- 💾 **Direct Save**: Content directly appended to specified page
- 🏷️ **Tag Support**: Add category tags to saved content

---

## 🔗 Related Links

- [Main Project README](README_en.md)
- [Chinese Changelog](CHANGELOG.md)
- [Japanese Changelog](CHANGELOG_ja.md)
- [Korean Changelog](CHANGELOG_ko.md)
- [German Changelog](CHANGELOG_de.md)
- [Installation Guide](README_en.md#🚀-installation-steps)
- [Usage Instructions](README_en.md#📱-usage)

---

## 📝 Version Naming Convention

This project follows [Semantic Versioning](https://semver.org/) specification:

- **Major version**: Incompatible API changes
- **Minor version**: Backward-compatible functionality additions
- **Patch version**: Backward-compatible bug fixes

---

*🐕 Every version makes Phoebe smarter and more reliable!* 