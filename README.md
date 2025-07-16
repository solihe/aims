# AIMS - AI内容营销系统

## 🚀 快速开始

### 前端开发
```bash
npm install
npm run dev
```

### 后端代理服务器 (生产环境需要)

由于浏览器的CORS限制，网页抓取功能需要后端代理服务器。

#### 创建后端服务器

1. 创建新目录：
```bash
mkdir aims-backend
cd aims-backend
npm init -y
```

2. 安装依赖：
```bash
npm install express cors dotenv puppeteer
```

3. 创建 `server.js`：
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());

app.post('/api/scrape', async (req, res) => {
  const { url, type, selectors } = req.body;
  
  try {
    let result;
    
    switch (type) {
      case 'browser-use':
        // 调用 Browser Use API
        const browserUseResponse = await fetch('https://api.browseruse.com/v1/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.BROWSER_USE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ url, selectors })
        });
        result = await browserUseResponse.json();
        break;
        
      case 'newsnow-api':
        // 直接调用 NewsNow API
        const newsResponse = await fetch(url);
        result = await newsResponse.json();
        break;
        
      case 'puppeteer':
        // 使用 Puppeteer 抓取
        const puppeteer = require('puppeteer');
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        const content = await page.content();
        await browser.close();
        result = { content };
        break;
        
      default:
        throw new Error('Unknown scraping type');
    }
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend proxy server running on port ${PORT}`);
});
```

4. 创建 `.env` 文件：
```env
BROWSER_USE_API_KEY=your_browser_use_key
SCRAPING_API_KEY=your_scraping_api_key
```

5. 启动后端服务器：
```bash
node server.js
```

## 🔧 环境变量配置

### 前端 (.env)
```env
# LLM 服务配置
VITE_OPENROUTER_API_KEY=your_openrouter_key
VITE_SILICONFLOW_API_KEY=your_siliconflow_key
VITE_DEEPSEEK_API_KEY=your_deepseek_key
VITE_MOONSHOT_API_KEY=your_moonshot_key
VITE_VOLCENGINE_API_KEY=your_volcengine_key
VITE_DASHSCOPE_API_KEY=your_dashscope_key

# 网页抓取配置 (后端使用)
VITE_BROWSER_USE_API_KEY=your_browser_use_key
VITE_SCRAPING_API_KEY=your_scraping_api_key
```

### 后端 (.env)
```env
BROWSER_USE_API_KEY=your_browser_use_key
SCRAPING_API_KEY=your_scraping_api_key
PORT=3001
```

## 📋 当前状态

### ✅ 可用功能
- 完整的UI界面和交互
- 模拟数据展示
- Agent设计模式演示
- LLM服务配置界面

### ⚠️ 需要后端支持的功能
- 网页数据抓取
- 真实LLM API调用
- 数据持久化存储

## 🚀 部署建议

### 开发环境
- 前端：Vite开发服务器
- 后端：Node.js Express服务器
- 数据：模拟数据

### 生产环境
- 前端：静态文件部署 (Netlify/Vercel)
- 后端：云服务器 (AWS/阿里云)
- 数据库：PostgreSQL/MongoDB
- 消息队列：Redis

## 🎯 下一步计划

1. **实现后端代理服务器**
2. **集成真实LLM API**
3. **添加数据持久化**
4. **实现Agent协作机制**
5. **部署到生产环境**