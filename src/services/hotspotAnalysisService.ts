// 智能热点分析和蹭热点服务
export interface HotKeyword {
  keyword: string;
  frequency: number;
  trend: 'rising' | 'stable' | 'falling';
  category: string;
  memeValue: number; // meme价值评分 0-1
  relevanceToGoals: number; // 与目标相关度 0-1
  opportunityScore: number; // 蹭热点机会评分 0-1
  relatedTopics: string[];
  sentiment: number; // 情感倾向 0-1
  viralPotential: number; // 传播潜力 0-1
}

export interface MemeInfo {
  id: string;
  name: string;
  description: string;
  origin: string;
  popularity: number;
  lifespan: 'short' | 'medium' | 'long'; // 生命周期
  platforms: string[]; // 主要传播平台
  targetAudience: string[];
  usageContext: string[];
  adaptationStrategy: string; // 如何结合我们的目标
}

export interface HotspotOpportunity {
  id: string;
  title: string;
  keywords: string[];
  memes: MemeInfo[];
  relevanceScore: number;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  contentSuggestions: ContentSuggestion[];
  platforms: PlatformStrategy[];
  estimatedReach: number;
  competitorActivity: CompetitorInfo[];
}

export interface ContentSuggestion {
  platform: string;
  angle: string;
  content: string;
  hashtags: string[];
  timing: string;
  expectedEngagement: number;
}

export interface PlatformStrategy {
  platform: string;
  approach: string;
  contentType: string;
  timing: string;
  expectedROI: number;
}

export interface CompetitorInfo {
  name: string;
  activity: string;
  engagement: number;
  strategy: string;
}

class HotspotAnalysisService {
  private userGoals: string[] = [
    '提升AI产品经理个人品牌',
    '分享AI创业经验和洞察',
    '建立技术创新思想领导力',
    '吸引潜在合作伙伴和投资人',
    '推广AI工具和解决方案'
  ];

  private brandPersonality = {
    tone: '专业而不失亲和',
    expertise: ['AI产品管理', '创业经验', '技术创新'],
    values: ['实用主义', '价值创造', '技术向善'],
    avoidTopics: ['政治敏感', '争议话题', '负面情绪']
  };

  // 从热点话题中自动提取关键词
  async extractHotKeywords(topics: any[]): Promise<HotKeyword[]> {
    const keywordMap = new Map<string, any>();
    
    // 1. 基础关键词提取
    topics.forEach(topic => {
      const words = this.segmentText(topic.title);
      words.forEach(word => {
        if (this.isValidKeyword(word)) {
          const existing = keywordMap.get(word) || {
            keyword: word,
            frequency: 0,
            topics: [],
            totalHot: 0
          };
          
          existing.frequency += 1;
          existing.topics.push(topic);
          existing.totalHot += topic.hot || 0;
          keywordMap.set(word, existing);
        }
      });
    });

    // 2. 计算趋势和评分
    const keywords: HotKeyword[] = [];
    for (const [word, data] of keywordMap) {
      if (data.frequency >= 2) { // 至少出现2次才考虑
        const keyword: HotKeyword = {
          keyword: word,
          frequency: data.frequency,
          trend: this.calculateTrend(data.topics),
          category: this.categorizeKeyword(word),
          memeValue: this.calculateMemeValue(word, data.topics),
          relevanceToGoals: this.calculateRelevanceToGoals(word),
          opportunityScore: 0,
          relatedTopics: data.topics.map((t: any) => t.title),
          sentiment: this.analyzeSentiment(data.topics),
          viralPotential: this.calculateViralPotential(word, data.totalHot)
        };
        
        keyword.opportunityScore = this.calculateOpportunityScore(keyword);
        keywords.push(keyword);
      }
    }

    return keywords.sort((a, b) => b.opportunityScore - a.opportunityScore);
  }

  // 识别和分析meme信息
  async identifyMemes(topics: any[]): Promise<MemeInfo[]> {
    const memes: MemeInfo[] = [];
    
    // 检测常见的meme模式
    const memePatterns = [
      { pattern: /(\w+)挑战/, type: 'challenge' },
      { pattern: /(\w+)梗/, type: 'meme' },
      { pattern: /(\w+)文学/, type: 'literary_meme' },
      { pattern: /(\w+)体/, type: 'format_meme' },
      { pattern: /(\w+)风/, type: 'style_meme' },
      { pattern: /(\w+)学/, type: 'academic_meme' }
    ];

    topics.forEach(topic => {
      memePatterns.forEach(({ pattern, type }) => {
        const match = topic.title.match(pattern);
        if (match) {
          const memeName = match[1];
          const existingMeme = memes.find(m => m.name === memeName);
          
          if (!existingMeme) {
            memes.push({
              id: `meme-${memes.length + 1}`,
              name: memeName,
              description: this.generateMemeDescription(memeName, type),
              origin: this.guessMemeOrigin(topic),
              popularity: topic.hot || 0,
              lifespan: this.predictMemeLifespan(type, topic.hot),
              platforms: this.identifyMemePlatforms(topic),
              targetAudience: this.identifyMemeAudience(memeName, type),
              usageContext: this.generateUsageContext(memeName, type),
              adaptationStrategy: this.generateAdaptationStrategy(memeName, type)
            });
          }
        }
      });
    });

    return memes.sort((a, b) => b.popularity - a.popularity);
  }

  // 生成蹭热点机会
  async generateHotspotOpportunities(
    keywords: HotKeyword[], 
    memes: MemeInfo[], 
    topics: any[]
  ): Promise<HotspotOpportunity[]> {
    const opportunities: HotspotOpportunity[] = [];

    // 按关键词分组相关话题
    const keywordGroups = this.groupTopicsByKeywords(topics, keywords);

    for (const [keyword, relatedTopics] of keywordGroups) {
      const keywordData = keywords.find(k => k.keyword === keyword);
      if (!keywordData || keywordData.opportunityScore < 0.6) continue;

      const relatedMemes = memes.filter(m => 
        m.name.includes(keyword) || 
        relatedTopics.some(t => t.title.includes(m.name))
      );

      const opportunity: HotspotOpportunity = {
        id: `opp-${opportunities.length + 1}`,
        title: `${keyword}热点蹭点机会`,
        keywords: [keyword, ...this.getRelatedKeywords(keyword, keywords)],
        memes: relatedMemes,
        relevanceScore: keywordData.relevanceToGoals,
        urgency: this.calculateUrgency(keywordData, relatedTopics),
        contentSuggestions: await this.generateContentSuggestions(keyword, relatedTopics, relatedMemes),
        platforms: this.generatePlatformStrategies(keyword, relatedMemes),
        estimatedReach: this.estimateReach(relatedTopics),
        competitorActivity: this.analyzeCompetitorActivity(keyword, relatedTopics)
      };

      opportunities.push(opportunity);
    }

    return opportunities.sort((a, b) => {
      // 综合评分：相关度 * 紧急度权重 * meme价值
      const scoreA = a.relevanceScore * this.getUrgencyWeight(a.urgency) * (a.memes.length > 0 ? 1.2 : 1);
      const scoreB = b.relevanceScore * this.getUrgencyWeight(b.urgency) * (b.memes.length > 0 ? 1.2 : 1);
      return scoreB - scoreA;
    });
  }

  // 文本分词（简化版中文分词）
  private segmentText(text: string): string[] {
    // 简化的中文分词，实际项目中建议使用专业分词库
    const words: string[] = [];
    
    // 提取中文词汇（2-4个字符）
    const chineseWords = text.match(/[\u4e00-\u9fa5]{2,4}/g) || [];
    words.push(...chineseWords);
    
    // 提取英文词汇
    const englishWords = text.match(/[a-zA-Z]{2,}/g) || [];
    words.push(...englishWords);
    
    // 提取数字+单位
    const numberUnits = text.match(/\d+[万亿千百十元%]/g) || [];
    words.push(...numberUnits);

    return words.filter(word => word.length >= 2);
  }

  // 判断是否为有效关键词
  private isValidKeyword(word: string): boolean {
    const stopWords = ['的', '了', '在', '是', '有', '和', '与', '或', '但', '而', '因为', '所以', '如果', '那么'];
    const commonWords = ['公司', '企业', '用户', '市场', '行业', '发展', '技术', '产品', '服务'];
    
    return !stopWords.includes(word) && 
           !commonWords.includes(word) && 
           word.length >= 2 && 
           word.length <= 6;
  }

  // 计算关键词趋势
  private calculateTrend(topics: any[]): 'rising' | 'stable' | 'falling' {
    // 简化的趋势计算，基于话题的时间分布和热度
    const recentTopics = topics.filter(t => {
      const time = new Date(t.timestamp || Date.now());
      const hoursAgo = (Date.now() - time.getTime()) / (1000 * 60 * 60);
      return hoursAgo <= 6; // 6小时内的话题
    });

    const recentRatio = recentTopics.length / topics.length;
    const avgHot = topics.reduce((sum, t) => sum + (t.hot || 0), 0) / topics.length;

    if (recentRatio > 0.6 && avgHot > 100000) return 'rising';
    if (recentRatio < 0.3 || avgHot < 50000) return 'falling';
    return 'stable';
  }

  // 关键词分类
  private categorizeKeyword(word: string): string {
    const categories = {
      'tech': ['AI', '人工智能', '算法', '模型', '技术', '创新', '数字化', '智能'],
      'business': ['创业', '融资', '投资', '商业', '市场', '营销', '品牌', '运营'],
      'product': ['产品', '功能', '体验', '设计', '用户', '需求', '迭代', '优化'],
      'industry': ['行业', '趋势', '变革', '转型', '发展', '前景', '机会', '挑战'],
      'social': ['社交', '内容', '平台', '传播', '影响', '文化', '现象', '热点']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(k => word.includes(k) || k.includes(word))) {
        return category;
      }
    }
    return 'general';
  }

  // 计算meme价值
  private calculateMemeValue(word: string, topics: any[]): number {
    let score = 0;
    
    // 基于传播特征
    const avgHot = topics.reduce((sum, t) => sum + (t.hot || 0), 0) / topics.length;
    if (avgHot > 500000) score += 0.3;
    else if (avgHot > 100000) score += 0.2;
    else if (avgHot > 50000) score += 0.1;

    // 基于词汇特征
    if (word.includes('挑战') || word.includes('梗') || word.includes('体')) score += 0.3;
    if (word.length <= 3) score += 0.2; // 短词更容易传播
    if (/[A-Za-z]/.test(word)) score += 0.1; // 包含英文
    
    // 基于平台分布
    const platforms = new Set(topics.map(t => t.source));
    if (platforms.size >= 3) score += 0.2; // 跨平台传播

    return Math.min(score, 1.0);
  }

  // 计算与目标的相关度
  private calculateRelevanceToGoals(word: string): number {
    let score = 0;
    
    // 直接相关的关键词
    const directKeywords = ['AI', '人工智能', '产品经理', '创业', '技术', '创新'];
    if (directKeywords.some(k => word.includes(k) || k.includes(word))) {
      score += 0.4;
    }

    // 间接相关的关键词
    const indirectKeywords = ['数字化', '智能', '算法', '模型', '平台', '工具', '解决方案'];
    if (indirectKeywords.some(k => word.includes(k) || k.includes(word))) {
      score += 0.2;
    }

    // 行业相关
    const industryKeywords = ['科技', '互联网', '软件', '应用', '系统', '数据'];
    if (industryKeywords.some(k => word.includes(k) || k.includes(word))) {
      score += 0.1;
    }

    // 目标受众相关
    const audienceKeywords = ['职场', '管理', '效率', '工作', '团队', '项目'];
    if (audienceKeywords.some(k => word.includes(k) || k.includes(word))) {
      score += 0.15;
    }

    return Math.min(score, 1.0);
  }

  // 计算机会评分
  private calculateOpportunityScore(keyword: HotKeyword): number {
    return (
      keyword.relevanceToGoals * 0.4 +
      keyword.memeValue * 0.25 +
      keyword.viralPotential * 0.2 +
      (keyword.trend === 'rising' ? 0.15 : keyword.trend === 'stable' ? 0.1 : 0) +
      keyword.sentiment * 0.1
    );
  }

  // 分析情感倾向
  private analyzeSentiment(topics: any[]): number {
    // 简化的情感分析
    const positiveWords = ['成功', '突破', '创新', '增长', '优秀', '领先', '机会', '发展'];
    const negativeWords = ['失败', '下跌', '危机', '问题', '争议', '批评', '风险', '困难'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    topics.forEach(topic => {
      positiveWords.forEach(word => {
        if (topic.title.includes(word)) positiveCount++;
      });
      negativeWords.forEach(word => {
        if (topic.title.includes(word)) negativeCount++;
      });
    });

    const total = positiveCount + negativeCount;
    if (total === 0) return 0.5; // 中性
    
    return positiveCount / total;
  }

  // 计算传播潜力
  private calculateViralPotential(word: string, totalHot: number): number {
    let score = 0;
    
    // 基于总热度
    if (totalHot > 1000000) score += 0.4;
    else if (totalHot > 500000) score += 0.3;
    else if (totalHot > 100000) score += 0.2;
    
    // 基于词汇特征
    if (word.length <= 3) score += 0.2; // 短词容易传播
    if (/[0-9]/.test(word)) score += 0.1; // 包含数字
    if (word.includes('新') || word.includes('首') || word.includes('最')) score += 0.15;
    
    return Math.min(score, 1.0);
  }

  // 生成meme描述
  private generateMemeDescription(name: string, type: string): string {
    const descriptions = {
      'challenge': `${name}挑战是一个社交媒体传播现象，用户通过参与特定活动来展示自己`,
      'meme': `${name}梗是网络流行文化的一部分，通过幽默或讽刺的方式传播`,
      'literary_meme': `${name}文学是一种文字表达方式，通过特定的语言风格来传达情感`,
      'format_meme': `${name}体是一种内容格式模板，用户可以套用这个格式创作内容`,
      'style_meme': `${name}风是一种风格化的表达方式，具有特定的视觉或语言特征`,
      'academic_meme': `${name}学是对某个现象的戏谑性学术化表达，带有幽默色彩`
    };
    
    return descriptions[type] || `${name}是当前的网络热点现象`;
  }

  // 预测meme生命周期
  private predictMemeLifespan(type: string, popularity: number): 'short' | 'medium' | 'long' {
    if (type === 'challenge' && popularity > 500000) return 'medium';
    if (type === 'literary_meme' || type === 'academic_meme') return 'long';
    if (popularity > 1000000) return 'medium';
    return 'short';
  }

  // 识别meme主要平台
  private identifyMemePlatforms(topic: any): string[] {
    const platformMap = {
      'weibo': ['微博'],
      'douyin': ['抖音', 'TikTok'],
      'xiaohongshu': ['小红书'],
      'zhihu': ['知乎'],
      'bilibili': ['B站', '哔哩哔哩']
    };
    
    const platforms = [topic.source];
    
    // 基于内容特征推测其他可能的平台
    if (topic.title.length <= 50) platforms.push('weibo');
    if (topic.title.includes('视频') || topic.title.includes('短片')) platforms.push('douyin');
    if (topic.title.includes('分享') || topic.title.includes('推荐')) platforms.push('xiaohongshu');
    
    return [...new Set(platforms)];
  }

  // 生成内容建议
  private async generateContentSuggestions(
    keyword: string, 
    topics: any[], 
    memes: MemeInfo[]
  ): Promise<ContentSuggestion[]> {
    const suggestions: ContentSuggestion[] = [];
    
    // 微博快评
    suggestions.push({
      platform: 'weibo',
      angle: '专业解读',
      content: `从产品经理角度看${keyword}：这个趋势背后的产品逻辑是什么？对我们的启示是...`,
      hashtags: [`#${keyword}`, '#产品经理', '#AI创新'],
      timing: '热点出现后2小时内',
      expectedEngagement: 0.08
    });

    // 知乎深度分析
    suggestions.push({
      platform: 'zhihu',
      angle: '深度分析',
      content: `${keyword}现象背后的商业逻辑分析：从技术创新到市场应用的完整链路解读`,
      hashtags: [`${keyword}`, '商业分析', '技术创新'],
      timing: '热点出现后6-12小时',
      expectedEngagement: 0.12
    });

    // 如果有相关meme，添加创意内容
    if (memes.length > 0) {
      const meme = memes[0];
      suggestions.push({
        platform: 'xiaohongshu',
        angle: '创意结合',
        content: `用${meme.name}的方式聊聊${keyword}：AI产品经理的${meme.name}指南`,
        hashtags: [`#${keyword}`, `#${meme.name}`, '#AI产品经理'],
        timing: 'meme热度期间',
        expectedEngagement: 0.15
      });
    }

    return suggestions;
  }

  // 其他辅助方法...
  private groupTopicsByKeywords(topics: any[], keywords: HotKeyword[]): Map<string, any[]> {
    const groups = new Map<string, any[]>();
    
    keywords.forEach(keyword => {
      const relatedTopics = topics.filter(topic => 
        topic.title.includes(keyword.keyword)
      );
      if (relatedTopics.length > 0) {
        groups.set(keyword.keyword, relatedTopics);
      }
    });
    
    return groups;
  }

  private getRelatedKeywords(keyword: string, keywords: HotKeyword[]): string[] {
    return keywords
      .filter(k => k.keyword !== keyword && k.category === keywords.find(kw => kw.keyword === keyword)?.category)
      .slice(0, 3)
      .map(k => k.keyword);
  }

  private calculateUrgency(keyword: HotKeyword, topics: any[]): 'low' | 'medium' | 'high' | 'urgent' {
    if (keyword.trend === 'rising' && keyword.viralPotential > 0.8) return 'urgent';
    if (keyword.trend === 'rising' && keyword.memeValue > 0.7) return 'high';
    if (keyword.opportunityScore > 0.7) return 'medium';
    return 'low';
  }

  private generatePlatformStrategies(keyword: string, memes: MemeInfo[]): PlatformStrategy[] {
    return [
      {
        platform: 'weibo',
        approach: '快速响应',
        contentType: '观点评论',
        timing: '2小时内',
        expectedROI: 0.8
      },
      {
        platform: 'zhihu',
        approach: '深度分析',
        contentType: '专业文章',
        timing: '6-12小时',
        expectedROI: 0.9
      }
    ];
  }

  private estimateReach(topics: any[]): number {
    return topics.reduce((sum, t) => sum + (t.hot || 0), 0) * 0.1; // 估算10%的触达率
  }

  private analyzeCompetitorActivity(keyword: string, topics: any[]): CompetitorInfo[] {
    // 模拟竞争对手分析
    return [
      {
        name: '同行A',
        activity: '已发布相关内容',
        engagement: 0.06,
        strategy: '快速跟进'
      }
    ];
  }

  private getUrgencyWeight(urgency: string): number {
    const weights = { 'urgent': 1.5, 'high': 1.2, 'medium': 1.0, 'low': 0.8 };
    return weights[urgency] || 1.0;
  }

  private guessMemeOrigin(topic: any): string {
    return `来源于${topic.source}平台的热门话题`;
  }

  private identifyMemeAudience(name: string, type: string): string[] {
    const audiences = {
      'challenge': ['年轻用户', '社交媒体活跃用户'],
      'meme': ['网络原住民', '年轻群体'],
      'literary_meme': ['文艺青年', '内容创作者'],
      'academic_meme': ['知识分子', '专业人士']
    };
    return audiences[type] || ['普通网民'];
  }

  private generateUsageContext(name: string, type: string): string[] {
    return ['社交媒体发布', '内容创作', '品牌营销', '话题讨论'];
  }

  private generateAdaptationStrategy(name: string, type: string): string {
    return `结合AI产品经理的专业背景，用${name}的形式分享技术洞察和创业经验，既蹭热点又体现专业性`;
  }
}

export const hotspotAnalysisService = new HotspotAnalysisService();