// 网页访问和数据抓取服务
export interface ScrapingResult {
  success: boolean;
  data: any[];
  source: string;
  timestamp: string;
  error?: string;
}

export interface NewsItem {
  title: string;
  url?: string;
  hot?: number;
  timestamp?: string;
  source: string;
  category?: string;
  description?: string;
}

// 1. Browser Use 集成 (推荐方案)
class BrowserUseService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.browseruse.com/v1';
  }

  async scrapeWebsite(url: string, selectors: Record<string, string>): Promise<ScrapingResult> {
    try {
      // In browser environment, we can't directly call external APIs due to CORS
      // This would need a backend proxy server in production
      console.warn('Browser Use API requires backend proxy server');
      return {
        success: false,
        data: [],
        source: 'browser-use',
        timestamp: new Date().toISOString(),
        error: 'Browser Use API requires backend proxy server'
      };
      
      /* Production implementation would be:
      const response = await fetch(`${this.baseUrl}/scrape`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url,
          selectors,
          wait_for: 'networkidle',
          timeout: 30000
        })
      });

      const result = await response.json();
      
      return {
        success: response.ok,
        data: result.data || [],
        source: 'browser-use',
        timestamp: new Date().toISOString(),
        error: response.ok ? undefined : result.error
      };
      */
    } catch (error) {
      return {
        success: false,
        data: [],
        source: 'browser-use',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // 专门为 NewsNow 网站定制的抓取方法
  async scrapeNewsNow(): Promise<NewsItem[]> {
    const selectors = {
      items: '.news-item',
      title: '.news-title',
      url: '.news-link',
      hot: '.hot-score',
      source: '.news-source',
      time: '.news-time'
    };

    const result = await this.scrapeWebsite('https://newsnow.busiyi.world/c/realtime', selectors);
    
    if (!result.success) {
      console.error('Failed to scrape NewsNow:', result.error);
      return [];
    }

    return this.parseNewsNowData(result.data);
  }

  private parseNewsNowData(rawData: any[]): NewsItem[] {
    return rawData.map((item, index) => ({
      title: item.title || `热点话题 ${index + 1}`,
      url: item.url,
      hot: parseInt(item.hot) || Math.floor(Math.random() * 1000000),
      timestamp: item.time || new Date().toISOString(),
      source: item.source || 'newsnow',
      category: this.categorizeNews(item.title || '')
    }));
  }

  private categorizeNews(title: string): string {
    if (title.includes('AI') || title.includes('人工智能')) return 'tech';
    if (title.includes('创业') || title.includes('融资')) return 'startup';
    if (title.includes('产品') || title.includes('经理')) return 'career';
    return 'general';
  }
}

// 2. Puppeteer 替代方案 (本地部署)
class PuppeteerService {
  async scrapeWithPuppeteer(url: string): Promise<ScrapingResult> {
    try {
      // Puppeteer requires backend server implementation
      console.warn('Puppeteer requires backend server');
      return {
        success: false,
        data: [],
        source: 'puppeteer',
        timestamp: new Date().toISOString(),
        error: 'Puppeteer requires backend server'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        source: 'puppeteer',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Puppeteer error'
      };
    }
  }
}

// 3. 代理抓取服务
class ProxyScrapingService {
  private proxyServices = [
    'https://api.scrapfly.io/scrape',
    'https://api.scraperapi.com',
    'https://api.zenrows.com/v1'
  ];

  async scrapeWithProxy(url: string, serviceIndex = 0): Promise<ScrapingResult> {
    if (serviceIndex >= this.proxyServices.length) {
      return {
        success: false,
        data: [],
        source: 'proxy',
        timestamp: new Date().toISOString(),
        error: 'All proxy services failed'
      };
    }

    try {
      const proxyUrl = this.proxyServices[serviceIndex];
      // Proxy services require backend implementation due to CORS
      console.warn('Proxy scraping requires backend server');
      return {
        success: false,
        data: [],
        source: 'proxy',
        timestamp: new Date().toISOString(),
        error: 'Proxy scraping requires backend server'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        source: 'proxy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Proxy error'
      };
    }
  }

  private parseHtmlContent(html: string): NewsItem[] {
    // 简单的HTML解析逻辑
    // 实际项目中建议使用 cheerio 或类似库
    const items: NewsItem[] = [];
    
    // 模拟解析结果
    const mockTitles = [
      'OpenAI发布GPT-5，性能大幅提升',
      '字节跳动AI创作工具引发关注',
      '产品经理如何应对AI时代挑战',
      '创业公司AI应用案例分析',
      '技术创新推动行业变革'
    ];

    mockTitles.forEach((title, index) => {
      items.push({
        title,
        hot: Math.floor(Math.random() * 1000000),
        timestamp: new Date().toISOString(),
        source: 'parsed-html',
        category: 'tech'
      });
    });

    return items;
  }
}

// 4. CORS代理方案
class CorsProxyService {
  private corsProxies = [
    'https://cors-anywhere.herokuapp.com/',
    'https://api.allorigins.win/get?url=',
    'https://corsproxy.io/?'
  ];

  async scrapeWithCorsProxy(url: string): Promise<ScrapingResult> {
    // CORS proxies are unreliable and often blocked
    console.warn('CORS proxy scraping is unreliable in production');
    return {
      success: false,
      data: [],
      source: 'cors-proxy',
      timestamp: new Date().toISOString(),
      error: 'CORS proxy scraping disabled for reliability'
    };
  }

  private parseHtmlContent(html: string): NewsItem[] {
    // 实际项目中需要更复杂的HTML解析
    return [];
  }
}

// 5. 统一的网页抓取管理器
export class WebScrapingManager {
  private browserUse: BrowserUseService;
  private puppeteer: PuppeteerService;
  private proxy: ProxyScrapingService;
  private corsProxy: CorsProxyService;
  private fallbackOrder: string[];

  constructor() {
    this.browserUse = new BrowserUseService(import.meta.env.VITE_BROWSER_USE_API_KEY || '');
    this.puppeteer = new PuppeteerService();
    this.proxy = new ProxyScrapingService();
    this.corsProxy = new CorsProxyService();
    
    // 优先级顺序：Browser Use > Puppeteer > 代理服务 > CORS代理
    this.fallbackOrder = ['browser-use', 'puppeteer', 'proxy', 'cors-proxy'];
  }

  async scrapeNewsNow(): Promise<NewsItem[]> {
    // 首先尝试检查是否有API可用
    const apiResult = await this.tryNewsNowAPI();
    if (apiResult.length > 0) {
      return apiResult;
    }

    // 如果没有API，使用网页抓取
    for (const method of this.fallbackOrder) {
      try {
        const result = await this.scrapeWithMethod(method);
        if (result.success && result.data.length > 0) {
          console.log(`Successfully scraped with ${method}`);
          return result.data;
        }
      } catch (error) {
        console.warn(`Method ${method} failed:`, error);
        continue;
      }
    }

    // 如果所有方法都失败，返回模拟数据
    console.warn('All scraping methods failed, using mock data');
    return this.getMockNewsData();
  }

  private async tryNewsNowAPI(): Promise<NewsItem[]> {
    try {
      // Direct API calls from browser are blocked by CORS
      // This would need a backend proxy server
      console.log('Direct API access blocked by CORS, using mock data');
      return [];
    } catch (error) {
      console.log('API access failed, will use mock data');
    }
    return [];
  }

  private async scrapeWithMethod(method: string): Promise<ScrapingResult> {
    const url = 'https://newsnow.busiyi.world/c/realtime';
    
    switch (method) {
      case 'browser-use':
        const newsItems = await this.browserUse.scrapeNewsNow();
        return {
          success: newsItems.length > 0,
          data: newsItems,
          source: 'browser-use',
          timestamp: new Date().toISOString()
        };
      
      case 'puppeteer':
        return this.puppeteer.scrapeWithPuppeteer(url);
      
      case 'proxy':
        return this.proxy.scrapeWithProxy(url);
      
      case 'cors-proxy':
        return this.corsProxy.scrapeWithCorsProxy(url);
      
      default:
        throw new Error(`Unknown scraping method: ${method}`);
    }
  }

  private parseAPIResponse(data: any): NewsItem[] {
    // 解析API响应数据
    if (Array.isArray(data)) {
      return data.map(item => ({
        title: item.title || item.name,
        url: item.url || item.link,
        hot: item.hot || item.score || item.heat,
        timestamp: item.timestamp || item.time || new Date().toISOString(),
        source: 'newsnow-api',
        category: item.category || 'general'
      }));
    }
    return [];
  }

  private getMockNewsData(): NewsItem[] {
    return [
      {
        title: 'OpenAI发布GPT-5预览版，多模态能力大幅提升',
        hot: 892456,
        timestamp: new Date().toISOString(),
        source: 'mock-weibo',
        category: 'tech'
      },
      {
        title: '字节跳动推出AI创作工具，挑战传统内容生产模式',
        hot: 654321,
        timestamp: new Date().toISOString(),
        source: 'mock-zhihu',
        category: 'business'
      },
      {
        title: '产品经理如何在AI时代保持核心竞争力',
        hot: 234567,
        timestamp: new Date().toISOString(),
        source: 'mock-baidu',
        category: 'career'
      },
      {
        title: '创业公司利用AI降低运营成本的5个策略',
        hot: 156789,
        timestamp: new Date().toISOString(),
        source: 'mock-toutiao',
        category: 'startup'
      },
      {
        title: '技术创新如何推动传统行业数字化转型',
        hot: 98765,
        timestamp: new Date().toISOString(),
        source: 'mock-douyin',
        category: 'industry'
      }
    ];
  }

  // 智能重试机制
  async scrapeWithRetry(maxRetries = 3): Promise<NewsItem[]> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.scrapeNewsNow();
        if (result.length > 0) {
          return result;
        }
      } catch (error) {
        console.warn(`Scraping attempt ${attempt} failed:`, error);
        if (attempt === maxRetries) {
          return this.getMockNewsData();
        }
        // 等待后重试
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    return this.getMockNewsData();
  }
}

export const webScrapingManager = new WebScrapingManager();