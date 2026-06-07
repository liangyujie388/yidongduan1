/**
 * Dify API 代理服务器
 * 用于解决浏览器 CORS 限制问题
 */

const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const fetch = require('node-fetch');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
const PORT = 3001;

const DIFY_API_KEY = process.env.DIFY_API_KEY || "app-hOVj9O5CJ5MpZTDoLlrl1a1W";
const DIFY_BASE_URL = process.env.DIFY_BASE_URL || "https://api.dify.ai";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// 健康检查
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// 文件上传代理
app.post('/proxy/files/upload', async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ error: '没有文件被上传' });
        }

        const file = req.files.file;
        const user = req.body.user || 'mobile_user';
        const formData = new FormData();
        formData.append('file', file.data, file.name);
        formData.append('user', user);

        console.log(`📤 上传文件: ${file.name} (${(file.size / 1024).toFixed(2)}KB)`);

        const authHeader = 'Bearer ' + DIFY_API_KEY;
        const response = await fetch(`${DIFY_BASE_URL}/v1/files/upload`, {
            method: 'POST',
            headers: Object.assign({
                'Authorization': authHeader
            }, formData.getHeaders()),
            body: formData
        });

        const data = await response.json();
        if (!response.ok) {
            console.error(`❌ 文件上传失败: ${response.status}`, data);
            return res.status(response.status).json({ error: `上传失败: ${response.status}`, details: data });
        }

        console.log(`✅ 文件上传成功: ${data.id}`);
        res.json(data);
    } catch (error) {
        console.error('❌ 上传错误:', error.message);
        res.status(500).json({ error: '服务器错误: ' + error.message });
    }
});

// 工作流调用代理
app.post('/proxy/workflows/run', async (req, res) => {
    try {
        const inputText = req.body?.inputs?.text || '(无文本)';
        console.log(`🔄 调用 Dify 工作流，输入: "${inputText.substring(0, 50)}..."`);

        const authHeader = 'Bearer ' + DIFY_API_KEY;
        const response = await fetch(`${DIFY_BASE_URL}/v1/workflows/run`, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        const result = await response.json();
        if (!response.ok) {
            console.error(`❌ Dify API 错误 (${response.status}):`, result);
            return res.status(response.status).json({ error: result.message || '调用失败', details: result });
        }

        console.log(`✅ Dify 工作流完成`);
        res.json(result);
    } catch (error) {
        console.error('❌ 工作流错误:', error.message);
        res.status(500).json({ error: '服务器错误: ' + error.message });
    }
});

// 添加日志中间件
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

app.listen(PORT, () => {
    console.log(`\n🚀 Dify 代理服务器已启动`);
    console.log(`📍 地址: http://localhost:${PORT}`);
    console.log(`🔑 API Key: ${DIFY_API_KEY.substring(0, 10)}...`);
    console.log(`✅ 用 Live Server 打开 index.html\n`);
    console.log(`📝 调试模式: 所有请求将被记录`);
    console.log(`🌐 CORS 已启用 - 前端可以跨域访问\n`);
});
