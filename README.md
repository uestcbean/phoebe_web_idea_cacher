# ![Logo](icons/icon48.png) Phoebe - 智能内容收集器

*其他语言版本: [English](docs/README_en.md) | [日本語](docs/README_ja.md) | [한국어](docs/README_ko.md) | [Deutsch](docs/README_de.md)*

## 🌍 支持的语言

- 🇨🇳 简体中文
- 🇺🇸 English
- 🇯🇵 日本語
- 🇰🇷 한국어
- 🇩🇪 Deutsch

## 📖 关于 Phoebe

Phoebe 是一个智能的Chrome浏览器插件，以一只聪明的小狗命名。她可以帮助您快速收集网页精华内容到 Notion，支持Notion页面和数据库两种模式、快速笔记、标签管理和多语言界面。

## ✨ 主要功能

### ⚡ 快速笔记功能 (v1.0.3 全面优化)
- 🎯 **独立快速笔记**：支持无关网页内容的纯粹思维记录
- ⌨️ **自定义快捷键**：可配置快捷键快速唤起笔记对话框
- 🎨 **简洁UI设计**：专注内容输入，去除不必要的界面元素
- 💾 **智能保存逻辑**：自动适配页面模式和数据库模式

### 🎯 智能模式选择 (v1.0.2)
- 📄 **普通文档模式**：内容直接追加到选定页面，适合简单收集
- 🗄️ **数据库模式**：支持选择页面或创建新页面，适合结构化管理

### 💫 用户体验优化 (v1.0.3 重点改进)
- 🎨 **品牌化UI**：精美的Phoebe logo对话框设计
- 🔄 **智能加载**：创建和保存过程的实时状态提示
- 🛡️ **错误处理优化**：改进验证提示显示和对话框行为
- ⚡ **防重复操作**：操作期间自动禁用按钮，提升稳定性
- 🏷️ **设置页面优化**：标签管理状态提示位置修正

### 🔧 核心功能
- 🔍 **智能选择**：选中任意网页文本，右键即可保存
- 📝 **备注功能**：为收集的内容添加个人备注
- 🏷️ **标签管理**：智能标签建议和历史记录，支持一键清除
- 🌍 **多语言支持**：中文、英文、日文、韩文、德文
- ⚡ **快速同步**：直接保存到您的 Notion 空间

## 🚀 安装步骤

1. 下载 `phoebe-v1.0.3.zip` 文件
2. 打开 Chrome 浏览器的扩展程序页面 (`chrome://extensions/`)
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"，选择解压后的文件夹
5. 在插件设置中配置您的 Notion API 密钥和使用模式

## ⚙️ 配置指南

### 第一步：创建 Notion 集成
1. 访问 [Notion集成页面](https://www.notion.so/my-integrations)
2. 点击"新集成"按钮
3. 填写集成名称（如：Phoebe）
4. 选择关联的工作区
5. 复制生成的 API 密钥（保密令牌）

### 第二步：选择使用模式

#### 📄 普通文档模式
- 适合：简单内容收集，日记式追加，快速笔记
- 特点：选择一个目标页面，内容将直接追加到页面末尾
- 优点：配置简单，内容按时间顺序组织

#### 🗄️ 数据库模式  
- 适合：结构化内容管理，分类收集
- 特点：选择一个数据库，每次保存可选择页面或创建新页面
- 优点：灵活管理，支持分类和搜索

### 第三步：智能配置
1. 点击浏览器中的 Phoebe 插件图标
2. 点击"设置"按钮
3. 输入"Notion API 密钥"
4. 选择使用模式（普通文档/数据库）
5. **智能获取**：Phoebe 自动获取您可访问的页面和数据库列表
6. 从列表中选择目标页面或数据库
7. 点击"测试连接"验证配置
8. 保存设置

### 第四步：快捷键配置 (v1.0.3 新增)
1. 在设置页面的"快捷键设置"区域
2. 点击"更改快捷键"按钮
3. 在打开的Chrome扩展快捷键页面中设置您喜欢的组合键

### 💡 权限配置提示
在使用过程中，如果 Phoebe 提示权限不足，请：
1. 打开对应的 Notion 页面或数据库
2. 点击右上角"共享"按钮
3. 搜索并邀请您的集成（如：Phoebe）
4. 给予"编辑"权限
5. 返回插件刷新资源列表

## 📱 使用方法

### 📝 快速笔记 (v1.0.3 推荐功能)
1. 使用快捷键快速唤起笔记对话框
2. 在弹出的简洁对话框中：
   - 查看目标页面/数据库信息
   - 输入您的想法、灵感或笔记内容
   - 添加标签（可选）
3. 点击"保存"按钮即可保存到笔记

### 🔍 网页内容收集
1. 在任意网页上选中想要收集的文本
2. 右键选择"保存到笔记"
3. 在弹出的Phoebe对话框中：
   - 查看选中的内容
   - 添加备注（可选）
   - 添加标签（可选）
   - **数据库模式**：选择目标页面或创建新页面
4. 点击"保存"按钮

### 🗄️ 数据库模式特色功能
- **页面选择**：从数据库中的现有页面中选择
- **一键创建**：快速在数据库中创建新页面
- **同名检测**：自动检测重复页面名称，提供友好提示
- **实时加载**：创建过程显示"Phoebe正在努力帮你创建中..."

### 📄 普通文档模式特色功能
- **直接追加**：内容自动追加到预设页面末尾
- **时间标记**：每次保存都添加时间戳
- **页面信息**：显示目标页面名称确认
- **快速笔记支持**：完美支持快速思维记录

### 🏷️ 标签管理技巧 (v1.0.3 体验优化)
- **输入新标签**：在标签输入框中直接输入，按回车添加
- **选择历史标签**：点击输入框查看历史标签建议
- **搜索标签**：输入关键字过滤标签建议
- **删除标签**：点击已添加标签旁的 × 按钮
- **一键清除历史**：在设置页面可清除所有标签历史
- **状态提示优化**：清除和删除操作的提示显示在标签管理区域内

## 🛠️ 项目结构

```
phoebe/
├── manifest.json           # 插件清单文件
├── _locales/              # 国际化翻译文件
│   ├── zh_CN/messages.json  # 简体中文
│   ├── en/messages.json     # 英文
│   ├── ja/messages.json     # 日文
│   ├── ko/messages.json     # 韩文
│   └── de/messages.json     # 德文
├── icons/                 # 插件图标
├── popup_page.html        # 弹窗页面
├── popup_script.js        # 弹窗功能脚本
├── options_page.html      # 设置页面
├── options_script.js      # 设置功能脚本
├── background_script.js   # 后台服务脚本
├── content_script.js      # 内容脚本
└── i18n.js               # 国际化工具
```

## 🚫 常见问题

### 快速笔记无法保存？
1. 检查是否已正确配置目标页面或数据库
2. 确认笔记内容不为空（必填字段）
3. 验证网络连接和Notion API权限

### 目标页面名称显示为空？
- 这通常是权限配置问题，请确认已将集成邀请到目标资源并给予编辑权限

### 连接失败怎么办？
1. 检查 API 密钥是否正确复制
2. 确认页面/数据库 ID 格式正确（32位字符串）
3. 验证集成是否已邀请到目标资源
4. 确保给予了"编辑"权限

### 模式选择建议
- **快速笔记用户推荐**：普通文档模式，简单直接
- **内容收集用户推荐**：数据库模式，便于分类管理
- **可随时切换**：在设置中可以随时更改模式

### 创建页面失败？
1. 检查是否已存在同名页面
2. 确认数据库权限配置正确
3. 验证网络连接稳定

## 📋 版本历史

详细的版本更新记录请查看：**[CHANGELOG.md](docs/CHANGELOG.md)**

**当前版本**: v1.0.3 🎉
- ⚡ 快速笔记功能全面优化
- 🎨 UI结构优化，错误处理改进
- 💾 保存逻辑修复，修复400错误
- 🏷️ 标签管理体验提升

## 🤝 贡献

欢迎提交问题报告和功能建议！

## 📄 许可证

本项目基于 MIT 许可证开源。

## 🐕 关于命名

Phoebe 是以一只聪明可爱的小狗命名的。就像她一样，这个插件被设计得智能、实用、可靠，帮助您收集珍贵的网页内容和记录灵感想法。

---

*用 ❤️ 为内容收集者和思维记录者们打造*