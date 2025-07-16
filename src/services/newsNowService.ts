// NewsNow 数据获取服务 - 支持API和网页抓取
import { webScrapingManager, NewsItem } from './webScrapingService';

export interface NewsNowTopic {
  title: string;
  url: string;
  hot?: number;
  timestamp?: string;
  source: string;
}

export interface NewsNowResponse {
  data: NewsNowTopic[];
  updateTime: string;
}

class NewsNowService {
  private baseUrl: string;
  private useWebScraping: boolean;
  private sources = ['weibo', 'zhihu', 'baidu', 'toutiao', 'douyin'];

  constructor(baseUrl = 'https://newsnow.busiyi.world') {
    this.baseUrl = baseUrl;
    this.useWebScraping = true; // 默认启用网页抓取
  }

  // 获取所有热点数据
  async getAllHotTopics(): Promise<NewsNowTopic[]> {
    try {
      // 优先尝试网页抓取
      if (this.useWebScraping) {
        const scrapedData = await webScrapingManager.scrapeWithRetry();
        if (scrapedData.length > 0) {
          return this.convertToNewsNowFormat(scrapedData);
        }
      }

      // 如果网页抓取失败，尝试API方式
      const apiTopics = await this.getTopicsFromAPI();
      if (apiTopics.length > 0) {
        return apiTopics;
      }

      // 如果都失败，返回模拟数据
      return this.getMockTopics();
    } catch (error) {
      console.error('Error fetching hot topics:', error);
      return this.getMockTopics();
    }
  }

  // 转换抓取数据为NewsNow格式
  private convertToNewsNowFormat(items: NewsItem[]): NewsNowTopic[] {
    return items.map(item => ({
      title: item.title,
      url: item.url || '#',
      hot: item.hot || 0,
      timestamp: item.timestamp || new Date().toISOString(),
      source: item.source
    }));
  }

  // API方式获取数据
  private async getTopicsFromAPI(): Promise<NewsNowTopic[]> {
    try {
      const promises = this.sources.map(source => this.getTopicsBySource(source));
      const results = await Promise.allSettled(promises);
      
      const allTopics: NewsNowTopic[] = [];
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          allTopics.push(...result.value);
        } else {
          console.error(`Failed to fetch from ${this.sources[index]}:`, result.reason);
        }
      });

      return this.sortByRelevance(allTopics);
    } catch (error) {
      console.error('API fetch failed:', error);
      return [];
    }
  }

  // 根据数据源获取话题
  async getTopicsBySource(source: string): Promise<NewsNowTopic[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${source}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: NewsNowResponse = await response.json();
      return data.data.map(topic => ({
        ...topic,
        source
      }));
    } catch (error) {
      console.error(`Error fetching from ${source}:`, error);
      return [];
    }
  }

  // 关键词过滤
  filterByKeywords(topics: NewsNowTopic[], keywords: string[]): NewsNowTopic[] {
    return topics.filter(topic => 
      keywords.some(keyword => 
        topic.title.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }

  // 计算相关度分数
  calculateRelevanceScore(topic: NewsNowTopic, keywords: string[]): number {
    let score = 0;
    const title = topic.title.toLowerCase();
    
    keywords.forEach(keyword => {
      if (title.includes(keyword.toLowerCase())) {
        score += 0.3;
      }
    });

    // 基于热度的加权
    if (topic.hot) {
      if (topic.hot > 500000) score += 0.3;
      else if (topic.hot > 100000) score += 0.2;
      else if (topic.hot > 50000) score += 0.1;
    }

    // 基于时间的加权（越新越好）
    if (topic.timestamp) {
      const now = new Date().getTime();
      const topicTime = new Date(topic.timestamp).getTime();
      const hoursDiff = (now - topicTime) / (1000 * 60 * 60);
      
      if (hoursDiff < 1) score += 0.2;
      else if (hoursDiff < 6) score += 0.1;
    }

    return Math.min(score, 1.0);
  }

  // 情感分析（简化版）
  analyzeSentiment(title: string): number {
    const positiveWords = ['成功', '突破', '创新', '增长', '优秀', '领先'];
    const negativeWords = ['失败', '下跌', '危机', '问题', '争议', '批评'];
    
    let score = 0.5; // 中性基准
    
    positiveWords.forEach(word => {
      if (title.includes(word)) score += 0.1;
    });
    
    negativeWords.forEach(word => {
      if (title.includes(word)) score -= 0.1;
    });
    
    return Math.max(0, Math.min(1, score));
  }

  // 按相关度排序
  private sortByRelevance(topics: NewsNowTopic[]): NewsNowTopic[] {
    const keywords = ['AI', '人工智能', '创业', '产品经理', '技术创新'];
    
    return topics
      .map(topic => ({
        ...topic,
        relevanceScore: this.calculateRelevanceScore(topic, keywords),
        sentimentScore: this.analyzeSentiment(topic.title)
      }))
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  }

  // 生成内容建议
  generateContentSuggestion(topic: NewsNowTopic): string {
    const suggestions = [
      `从产品经理角度分析：${topic.title}`,
      `创业者如何看待：${topic.title}`,
      `AI时代的思考：${topic.title}`,
      `深度解读：${topic.title}背后的商业逻辑`,
      `技术创新视角：${topic.title}的启示`
    ];
    
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  }

  // 模拟数据
  private getMockTopics(): NewsNowTopic[] {
    return [
      {
        title: 'OpenAI发布GPT-5预览版，多模态能力显著提升',
        url: 'https://example.com/gpt5',
        hot: 892456,
        timestamp: new Date().toISOString(),
        source: 'weibo'
      },
      {
        title: '字节跳动AI创作工具引发行业关注',
        url: 'https://example.com/bytedance-ai',
        hot: 654321,
        timestamp: new Date().toISOString(),
        source: 'zhihu'
      },
      {
        title: '产品经理必备：AI时代的核心技能',
        url: 'https://example.com/pm-skills',
        hot: 234567,
        timestamp: new Date().toISOString(),
        source: 'baidu'
      }
    ];
  }

  // 设置是否使用网页抓取
  setWebScrapingEnabled(enabled: boolean) {
    this.useWebScraping = enabled;
  }
}

export const newsNowService = new NewsNowService();