# OpenResume 中文版

基于 [OpenResume](https://github.com/xitanggg/open-resume) 的中文定制版简历生成器，提供完整的中文界面、中文 PDF 导出与解析支持。

## ✨ 特性

| **特性** | **说明** |
|---|---|
| **中文界面** | 所有表单标签、按钮、提示信息均已汉化（姓名、求职目标、工作经历、教育背景等） |
| **中文 PDF 导出** | 使用思源黑体（Noto Sans SC）字体，导出的 PDF 中文字符显示正常，支持复制粘贴 |
| **中文 PDF 解析** | 支持导入中文简历 PDF，自动识别中文姓名、手机号、地址、工作经历、教育背景等 |
| **实时预览** | 编辑简历信息时 PDF 实时更新 |
| **自动单页排版** | 根据内容量自动调整间距与边距，确保简历始终适配单页 |
| **头像支持** | 支持上传个人照片，在简历头部展示圆形头像 |
| **描述可选** | 工作经历描述字段可选，未填写时不占用 PDF 空间 |
| **隐私优先** | 所有数据仅在浏览器本地运行，无需注册，数据不会上传到任何服务器 |
| **YAML 导出** | 支持将简历导出为 YAML 格式，方便版本管理和批量编辑 |
| **PWA 支持** | 可安装为桌面应用，支持离线使用 |
| **PDF 命名** | 导出文件名格式为 `姓名-求职目标-电话.pdf` |
| **A4 纸张** | 默认使用 A4 纸张尺寸 |

## 技术栈

| **类别** | **选择** | **说明** |
|---|---|---|
| **语言** | [TypeScript](https://github.com/microsoft/TypeScript) | 静态类型检查，减少运行时错误 |
| **UI 框架** | [React](https://github.com/facebook/react) | 声明式语法，组件化开发 |
| **状态管理** | [Redux Toolkit](https://github.com/reduxjs/redux-toolkit) | 管理复杂的简历数据状态 |
| **CSS 框架** | [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) | 实用优先的 CSS 框架 |
| **Web 框架** | [Next.js](https://github.com/vercel/next.js) | 支持静态生成和 SEO 优化 |
| **PDF 读取** | [PDF.js](https://github.com/mozilla/pdf.js) | 解析 PDF 文件内容 |
| **PDF 渲染** | [React-pdf](https://github.com/diegomura/react-pdf) | 生成可下载的 PDF 文件 |
| **YAML** | [js-yaml](https://github.com/nodeca/js-yaml) | YAML 序列化与反序列化 |
| **PWA** | [next-pwa](https://github.com/shadowwalker/next-pwa) | 渐进式 Web 应用支持 |

## 项目结构

源代码位于 `src/app`，主要页面路由如下：

| **路由** | **代码路径** | **说明** |
|---|---|---|
| / | /page.tsx | 首页 |
| /resume-import | /resume-import/page.tsx | 简历导入页，支持从已有 PDF 导入数据 |
| /resume-builder | /resume-builder/page.tsx | 简历编辑页，编辑并下载 PDF / YAML |
| /resume-parser | /resume-parser/page.tsx | 简历解析页，测试 PDF 的 ATS 可读性 |
| /offline | /offline/page.tsx | 离线提示页 |

## 本地开发

### 方法一：pnpm

```bash
git clone https://github.com/plantree/open-resume.git
cd open-resume
pnpm install
pnpm dev
```

打开浏览器访问 [http://localhost:2345](http://localhost:2345)

### 方法二：Docker

```bash
git clone https://github.com/plantree/open-resume.git
cd open-resume
docker build -t open-resume .
docker run -p 3000:3000 open-resume
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 致谢

本项目基于 [OpenResume](https://github.com/xitanggg/open-resume) 开发，感谢原作者 [xitanggg](https://github.com/xitanggg) 的开源贡献。

## 许可证

[MIT](LICENSE)
