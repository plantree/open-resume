# PWA功能使用说明

## 概述

OpenResume 现在支持 PWA (Progressive Web App) 功能，您可以将应用安装到设备的主屏幕上，就像原生应用一样使用。

## 主要特性

### 🚀 安装到主屏幕
- 在支持的浏览器中，您会看到安装提示
- 点击安装后，OpenResume 将添加到您的设备主屏幕
- 支持桌面和移动设备

### 📱 离线功能
- 应用的核心功能可以在离线状态下使用
- 自动缓存静态资源，提升加载速度
- 离线时显示专门的离线页面

### 🔄 自动更新
- Service Worker 自动缓存新版本
- 智能缓存策略，优先使用网络最新内容
- 后台自动下载更新

## 安装方式

### Chrome/Edge 浏览器
1. 访问 OpenResume 网站
2. 在地址栏旁会出现安装图标 📱
3. 点击安装图标，然后点击"安装"
4. 应用将添加到桌面/应用列表

### Safari 浏览器
1. 访问 OpenResume 网站  
2. 点击分享按钮 📤
3. 选择"添加到主屏幕"
4. 确认安装

### 移动设备
- Android：Chrome 浏览器会自动显示安装横幅
- iOS：使用 Safari 的"添加到主屏幕"功能

## 技术特性

- **Manifest 文件**: 定义应用图标、名称、主题色等
- **Service Worker**: 提供离线缓存和后台同步
- **智能缓存**: NetworkFirst 策略，确保内容最新
- **响应式设计**: 适配各种屏幕尺寸
- **原生体验**: 全屏显示，无浏览器地址栏

## 图标生成

项目包含了完整的图标集：
- 72x72, 96x96, 128x128, 144x144
- 152x152, 192x192, 384x384, 512x512
- 支持 maskable 图标，在所有平台都有良好显示

## 开发说明

PWA 配置文件：
- `public/manifest.json` - 应用清单
- `public/sw.js` - Service Worker (自动生成)
- `next.config.js` - PWA 配置
- `src/app/layout.tsx` - Meta 标签配置

## 浏览器支持

- ✅ Chrome 67+
- ✅ Firefox 44+
- ✅ Safari 11.1+
- ✅ Edge 17+
- ✅ iOS Safari 11.3+
- ✅ Android Chrome 67+

## 故障排除

### 安装按钮不显示
- 确保使用 HTTPS 协议
- 检查浏览器是否支持 PWA
- 清除浏览器缓存后重试

### 离线功能不工作
- 确保 Service Worker 已注册
- 检查网络连接
- 在开发者工具中查看 Service Worker 状态

### 更新不生效
- 关闭所有标签页后重新打开
- 清除浏览器缓存
- 在开发者工具中手动更新 Service Worker
