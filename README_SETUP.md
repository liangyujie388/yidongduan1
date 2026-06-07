# Dify 代理集成 - 使用说明

## 问题概述
原前端代码直接调用 Dify API 会遇到浏览器的 CORS（跨域资源共享）限制，导致无法成功通信。这个方案通过创建一个本地代理服务器来解决这个问题。

## 解决方案架构
```
浏览器 (Live Server)  →  本地代理服务器  →  Dify API
  index.html              proxy.js          https://api.dify.ai
```

## 快速开始

### 1️⃣ 安装依赖
在项目文件夹运行：
```bash
npm install
```

这会安装以下依赖：
- `express` - Web 服务器框架
- `cors` - 跨域资源共享
- `express-fileupload` - 文件上传处理
- `node-fetch` - HTTP 请求库
- `dotenv` - 环境变量管理

### 2️⃣ 启动代理服务器
```bash
node proxy.js
```

成功启动后你会看到：
```
🚀 Dify 代理服务器已启动
📍 地址: http://localhost:3001
🔑 API Key: app-hOVj9...
✅ 现在可以用 Live Server 打开 index.html
```

### 3️⃣ 启动 Live Server
用你的编辑器打开 Live Server 打开 `index.html`，或在命令行运行：
```bash
npx live-server
```

### 4️⃣ 测试
在打开的网页上发送消息给 AI 助手，消息应该会正常通过代理服务器到达 Dify。

## 修改了什么

### 前端修改 (index.html)
- ✅ 改变 `DIFY_BASE_URL` 从 `https://api.dify.ai` 到 `http://localhost:3001/proxy`
- ✅ 移除前端的 API Key 暴露（改由代理服务器处理）
- ✅ 移除前端请求的 `Authorization` header（代理服务器会添加）
- ✅ 改变 API 端点：`/v1/files/upload` → `/files/upload` 和 `/v1/workflows/run` → `/workflows/run`

### 新增文件
- **proxy.js** - Node.js 代理服务器脚本
- **package.json** - 依赖管理文件
- **README_SETUP.md** - 本说明文件

## 如何工作

### 代理服务器的作用
1. **处理 CORS** - 服务器响应中包含 CORS headers，允许浏览器调用它
2. **保护 API Key** - API Key 存储在服务器端，而不是前端代码中
3. **转发请求** - 代理将请求转发到真实的 Dify API
4. **处理文件上传** - 处理文件数据的转发

### 请求流程
```
前端请求:
POST http://localhost:3001/proxy/workflows/run
{
  inputs: { text: "...", ... },
  response_mode: "blocking",
  user: "mobile_user"
}
    ↓
代理服务器添加 Authorization header:
Authorization: ******
    ↓
转发到:
POST https://api.dify.ai/v1/workflows/run
    ↓
返回结果给前端
```

## 故障排除

### 问题：端口 3001 已被占用
```bash
# 修改 proxy.js 中的 PORT 变量为其他端口（如 3002）
# 然后修改 index.html 中的 DIFY_BASE_URL 为新端口
```

### 问题：npm install 失败
```bash
# 清除 npm 缓存
npm cache clean --force

# 重试安装
npm install
```

### 问题：代理显示"无API Key"
确保 proxy.js 中的 `DIFY_API_KEY` 是有效的 Dify 工作流 APP ID。

### 问题：Live Server 无法连接到代理
1. 确保代理服务器正在运行（检查是否有错误信息）
2. 确保用的是 `http://localhost:3001` 而不是 `https://`
3. 在浏览器开发者工具 (F12) → Network 标签查看请求状态

## 环境变量（可选）

你可以创建 `.env` 文件来配置 API Key：
```env
DIFY_API_KEY=your_api_key_here
DIFY_BASE_URL=https://api.dify.ai
```

## 生产部署

如果要部署到生产环境：
1. 将代理服务器部署到你的服务器（如 Heroku, AWS, 阿里云等）
2. 在 index.html 中改变 `DIFY_BASE_URL` 为生产服务器地址
3. 确保使用 HTTPS 和正确的安全配置

## 安全性说明
⚠️ **重要** - 仅在开发环境使用此配置。生产环境应该：
- 使用环境变量存储 API Key
- 启用身份验证（验证请求来源）
- 使用 HTTPS
- 限制请求速率
- 验证用户输入

## 支持
如有问题，请检查：
1. Node.js 是否正确安装 (`node --version`)
2. 依赖是否正确安装 (`npm list express`)
3. 代理服务器的控制台输出是否有错误
4. 浏览器开发者工具 (F12) 中的 Network 和 Console 标签
