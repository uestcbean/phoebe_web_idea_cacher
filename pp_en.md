# 📄 Privacy Policy

**Extension Name:** Phoebe  
**Last Updated:** June 2025

English Version | [中文版](pp.md)

---

## 1. Data Collection & Usage

This extension does not collect, store, or share any personally identifiable information (PII).

It only runs when the user explicitly performs the following:

- Selects text on a webpage
- Clicks "Save to Notion" from the context menu
- Uses Chrome's native selectionText API to retrieve the selected text
- Sends the selected text to the user's Notion database via Notion API

> ⚠️ The extension does not scrape or access any non-selected content or run in the background.

## 2. Permission Usage

This extension uses the following permissions:

- `activeTab`: Only accesses the current tab when the user selects text
- `contextMenus`: Provides right-click menu functionality
- `storage`: Stores user configuration
- `host_permissions`: Only accesses Notion API (https://api.notion.com/*)

All permissions follow the principle of least privilege and are used only when necessary.

## 3. Local Storage

The extension saves the following information locally in the user's browser:

- Notion integration token provided by the user
- Default Notion database ID set by the user

This information is never transmitted to any external server.

## 4. Third-party Services

The extension uses only the official Notion API to interact with the user's workspace. No ads, analytics, or tracking services are included.

## 5. User Control

Users can:

- Disable or uninstall the extension anytime
- Clear all stored data from Chrome local storage
- Update their Notion token and default database ID

## 6. Data Security

- All operations are triggered by explicit user actions
- Communication with Notion is encrypted via HTTPS
- The extension does not run background processes

## 7. Policy Updates

If this privacy policy changes, we will update the version and date here. Continued use of the extension implies acceptance of the updated terms.

## 8. Contact

For questions or concerns, please contact the developer:

- 📧 Email: sheeplinbean@163.com
- 📂 GitHub: https://github.com/uestcbean/phoebe