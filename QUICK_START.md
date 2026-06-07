# ⚡ Dify 集成 - 快速启动 (3步)

## 🎯 问题症状
- 前端无法调用 Dify，显示错误或没有反应
- 只用 Live Server 打开前端但代理服务器未启动

## ✅ 解决方案（3个步骤）

### 📌 步骤 1: 安装依赖 (仅需一次)
```bash
cd /path/to/yidongduan1
npm install
```

### 📌 步骤 2: 启动代理服务器
**在第一个终端运行**：
```bash
npm start
```

✅ 看到这个就说明成功了：
```
🚀 Dify 代理服务器已启动
📍 地址: http://localhost:3001
✅ 用 Live Server 打开 index.html
```

⚠️ **不要关闭这个终端，保持运行！**

### 📌 步骤 3: 打开前端
**在 VS Code 中**：
1. 右键点击 `index.html`
2. 选择 "Open with Live Server"
3. 浏览器自动打开，通常是 `http://localhost:5500`

---

## 🧪 验证成功
在前端输入任何内容，比如：
```
我收到一条短信说要转账到安全账户
```

✅ 成功的表现：
- 先显示 "🤔 正在分析，请稍候..."
- 然后显示 Dify 的详细反诈建议

❌ 失败的表现：
- 显示错误消息（通常是连接错误）
- 查看浏览器开发者工具（F12）的 Console 标签找原因

---

## 🚨 常见错误及解决

### 错误：ERR_CONNECTION_REFUSED
```
Failed to fetch: http://localhost:3001/proxy/workflows/run
```
**原因**：代理服务器未启动  
**解决**：确保你在运行 `npm start`

### 错误：Cannot find module 'form-data'
**原因**：依赖未完整安装  
**解决**：运行 `npm install`

### 浏览器开发工具显示 CORS 错误
**原因**：通常是代理服务器未运行  
**解决**：确认 `npm start` 仍在运行

---

## 📋 完整指令速查

```bash
# 终端 1: 启动代理服务器（保持运行）
cd ~/yidongduan1
npm install        # 仅第一次需要
npm start          # ← 启动后不要关闭！

# 终端 2 或 VS Code: 打开前端
# 右键 index.html → Open with Live Server
```

---

## 💡 Tips
- 代理服务器必须保持运行，不能关闭
- 可以在多个浏览器标签打开前端，都会连接到同一个代理服务器
- 如果代理服务器崩溃，查看终端错误信息，通常是 API Key 或网络问题

---

更详细的设置说明请查看 **SETUP_GUIDE.md**
