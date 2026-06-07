# 🚀 Dify 集成完整设置指南

## ❌ 为什么前端无法调用 Dify？

你遇到的问题是：**代理服务器 (proxy.js) 未启动**

### 关键概念
- **Live Server** 只能提供静态HTML/CSS/JS文件
- 无法运行Node.js代码（比如proxy.js）
- 前端需要通过代理服务器访问Dify API

---

## ✅ 正确的启动步骤

### **步骤 1️⃣：安装依赖**

打开终端，进入项目目录：
```bash
cd /path/to/yidongduan1
npm install
```

你会看到类似的输出：
```
added 78 packages, and audited 79 packages in 3s
found 0 vulnerabilities
```

---

### **步骤 2️⃣：启动代理服务器**

在**第一个终端**中运行：
```bash
npm start
```

成功启动后，你会看到：
```
🚀 Dify 代理服务器已启动
📍 地址: http://localhost:3001
🔑 API Key: app-hOVj9O...
✅ 用 Live Server 打开 index.html
```

⚠️ **重要**: 不要关闭这个终端窗口！保持运行状态。

---

### **步骤 3️⃣：打开前端（在另一个窗口）**

在 VS Code 中：
1. 右键点击 `index.html`
2. 选择 "Open with Live Server"
3. 自动打开浏览器，通常是 `http://localhost:5500` 或 `http://127.0.0.1:5500`

---

### **步骤 4️⃣：验证连接**

在前端界面尝试输入内容，比如：
```
我收到一条短信说要转账到安全账户，这是什么情况？
```

✅ 如果成功调用 Dify，你会看到：
- 先显示 "🤔 正在分析，请稍候..."
- 然后出现 Dify 返回的详细反诈建议

❌ 如果失败，检查：
1. 代理服务器是否还在运行（第一个终端窗口）
2. 浏览器控制台有什么错误（F12 打开开发者工具）

---

## 🔧 配置详解

### **前端配置** (`index.html` 第540行)
```javascript
const DIFY_BASE_URL = "http://localhost:3001/proxy";
```

- `localhost:3001` = 代理服务器地址
- `/proxy` = 前缀路径

### **代理服务器配置** (`proxy.js` 第16-17行)
```javascript
const DIFY_API_KEY = process.env.DIFY_API_KEY || "app-hOVj9O5CJ5MpZTDoLlrl1a1W";
const DIFY_BASE_URL = process.env.DIFY_BASE_URL || "https://api.dify.ai";
```

- 如果你有自己的 Dify API Key，可以创建 `.env` 文件：
```
DIFY_API_KEY=app-xxxxx
DIFY_BASE_URL=https://api.dify.ai
```

---

## 🐛 常见问题排查

### **问题1：ERR_CONNECTION_REFUSED**
```
Failed to fetch: http://localhost:3001/proxy/workflows/run
```

**解决方案**：确保代理服务器在运行
```bash
# 在第一个终端中
npm start
```

### **问题2：CORS 错误**
```
Access to XMLHttpRequest blocked by CORS policy
```

**解决方案**：代理服务器已启用 CORS，但需要确保：
- 代理服务器正在运行
- 前端调用的是 `http://localhost:3001/proxy/*` 而非直接调用 Dify API

### **问题3：API Key 无效**
```json
{
  "error": "Unauthorized: Invalid API key"
}
```

**解决方案**：
- 检查 `proxy.js` 第16行的 API Key 是否正确
- 确保在 [Dify 官网](https://dify.ai) 创建了有效的 API Key
- 或在 `.env` 文件中设置正确的 API Key

### **问题4：工作流未返回结果**
```
Error: 工作流未返回有效内容
```

**解决方案**：
- 确保在 Dify 后台创建了 Workflow（工作流）
- Workflow 的输出字段命名为 `answer` 或 `text`
- 检查 Workflow 权限是否公开或 API 可访问

---

## 🎯 完整流程图

```
用户输入 (浏览器)
    ↓
前端 JavaScript (index.html)
    ↓
fetch() → http://localhost:3001/proxy/workflows/run
    ↓
代理服务器 (proxy.js - localhost:3001)
    ↓
添加 Authorization 头部和 API Key
    ↓
转发请求 → https://api.dify.ai/v1/workflows/run
    ↓
Dify API 处理
    ↓
返回结果 → 代理服务器 → 前端显示
```

---

## 📝 双终端启动速查

### 方式 A：VS Code (推荐)

**终端1**：
```bash
npm start
```

**终端2**：
```bash
# 如果要在命令行测试
curl http://localhost:3001/health
# 应该返回: {"status":"ok"}
```

然后用 Live Server 打开 `index.html`

### 方式 B：分离的终端窗口

**第1个终端窗口**：
```bash
cd /path/to/yidongduan1
npm start
```

**第2个终端窗口**：
```bash
# 在 VS Code 中右键 → Open with Live Server
# 或者用其他 HTTP 服务器：
python -m http.server 8000
# 然后访问 http://localhost:8000
```

---

## ✨ 验证一切正常

### 1. 测试代理服务器健康检查
```bash
curl http://localhost:3001/health
# 应该返回: {"status":"ok"}
```

### 2. 在浏览器开发者工具中查看请求
- 按 `F12` 打开开发者工具
- 切换到 "Network" 标签
- 在前端输入信息并发送
- 查看 `XHR` 请求，应该看到：
  - 请求地址：`http://localhost:3001/proxy/workflows/run`
  - 状态码：`200`
  - 响应包含 AI 回复

### 3. 查看控制台日志
- 在开发者工具的 "Console" 标签
- 成功调用会看到：`接收到 Dify 回复:` 日志
- 失败会看到错误信息

---

## 🚀 优化建议

### 1. 使用 .env 文件管理 API Key

创建 `.env` 文件（项目根目录）：
```
DIFY_API_KEY=your-actual-api-key-here
DIFY_BASE_URL=https://api.dify.ai
```

这样可以避免在代码中硬编码敏感信息。

### 2. 生产环境部署

如果要部署到服务器：
- 使用 `PM2` 或 `forever` 保持进程运行
- 配置反向代理（nginx/Apache）
- 设置适当的 CORS 规则
- 使用 HTTPS

---

## 📞 获取帮助

如果仍有问题：

1. **检查代理服务器日志**
   - 代理服务器输出的任何错误信息都会显示在终端中

2. **查看浏览器控制台错误**
   - F12 → Console → 查找红色错误

3. **验证 Dify API Key**
   - 登录 [Dify 官网](https://dify.ai)
   - 创建 API Key
   - 确保 Workflow 已发布

4. **测试 API 端点**
   ```bash
   curl -X POST http://localhost:3001/health
   ```

---

祝您使用愉快！🎉
