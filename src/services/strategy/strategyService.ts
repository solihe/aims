// AIMS 策略服务
import { MarketingIntent, CampaignStrategy, MarketingObjective, ApiResponse } from '../../types';
import { apiClient } from '../api/apiClient';
import { mockStrategies, mockStrategyTemplates, mockApiDelay, mockApiError } from '../../data/mockData';

class StrategyService {
  private isDevelopment = import.meta.env.DEV;

  // 创建营销策略
  async createStrategy(intent: MarketingIntent): Promise<CampaignStrategy> {
    if (this.isDevelopment) {
      // 开发环境使用模拟数据
      await mockApiDelay(2000); // 模拟API延迟
      mockApiError('策略创建失败', 0.1); // 10%概率模拟错误

      const template = mockStrategyTemplates[intent.objective];
      const strategy: CampaignStrategy = {
        id: `strategy-${Date.now()}`,
        name: this.generateStrategyName(intent.description, intent.objective),
        description: intent.description, // 保存完整描述
        objective: intent.objective,
        phases: template.phases,
        platformRoles: template.platformRoles,
        contentThemes: this.extractThemes(intent.description),
        expectedOutcomes: this.generateOutcomes(intent.objective),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return strategy;
    }

    try {
      const response = await apiClient.post<ApiResponse<CampaignStrategy>>('/api/strategies', intent);

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || '策略创建失败');
      }

      return response.data.data;
    } catch (error) {
      console.error('创建策略失败:', error);
      throw error;
    }
  }

  // 生成策略名称
  private generateStrategyName(description: string, objective: MarketingObjective): string {
    // 提取关键词作为策略名称
    const words = description.split(/\s+|，|。|、/).filter(word => word.length > 1);
    const keyWords = words.slice(0, 3).join(''); // 取前3个关键词

    const objectiveLabels = {
      'product_launch': '产品发布',
      'brand_building': '品牌建设',
      'lead_generation': '线索获取',
      'sales_conversion': '销售转化',
      'crisis_management': '危机管理'
    };

    const objectiveLabel = objectiveLabels[objective] || '营销';
    return `${keyWords}${objectiveLabel}策略`;
  }

  // 提取主题（改进版）
  private extractThemes(description: string): string[] {
    // 更智能的关键词提取
    const commonKeywords = ['品牌', '产品', '服务', '用户', '客户', '市场', '技术', '创新', '体验', '价值', '质量', '专业'];
    const extractedKeywords: string[] = [];

    // 提取明确提到的关键词
    commonKeywords.forEach(keyword => {
      if (description.includes(keyword)) {
        extractedKeywords.push(keyword);
      }
    });

    // 提取特定行业词汇
    const industryKeywords = this.extractIndustryKeywords(description);
    extractedKeywords.push(...industryKeywords);

    // 如果没有提取到足够的关键词，添加通用主题
    if (extractedKeywords.length < 2) {
      extractedKeywords.push('营销推广', '品牌传播');
    }

    return [...new Set(extractedKeywords)].slice(0, 5); // 去重并限制数量
  }

  // 提取行业关键词
  private extractIndustryKeywords(description: string): string[] {
    const industryMap = {
      '白酒': ['白酒', '酒类', '传统文化', '社交'],
      '科技': ['AI', '人工智能', '技术', '创新', '智能'],
      '教育': ['教育', '学习', '培训', '知识'],
      '医疗': ['医疗', '健康', '医院', '治疗'],
      '金融': ['金融', '银行', '投资', '理财'],
      '电商': ['电商', '购物', '零售', '商城'],
      '餐饮': ['餐饮', '美食', '食品', '料理'],
      '旅游': ['旅游', '旅行', '景点', '度假']
    };

    const keywords: string[] = [];
    Object.entries(industryMap).forEach(([industry, terms]) => {
      if (terms.some(term => description.includes(term))) {
        keywords.push(industry, ...terms.filter(term => description.includes(term)));
      }
    });

    return [...new Set(keywords)];
  }

  // 生成预期结果
  private generateOutcomes(objective: MarketingObjective): string[] {
    const outcomeMap = {
      [MarketingObjective.PRODUCT_LAUNCH]: ['提升产品认知', '获得早期用户', '建立市场地位'],
      [MarketingObjective.BRAND_BUILDING]: ['提升品牌知名度', '建立行业权威', '增强用户信任'],
      [MarketingObjective.LEAD_GENERATION]: ['获取潜在客户', '提高转化率', '扩大销售机会'],
      [MarketingObjective.SALES_CONVERSION]: ['提升销售业绩', '增加客户转化', '提高客单价'],
      [MarketingObjective.CRISIS_MANAGEMENT]: ['控制负面影响', '恢复品牌形象', '重建用户信任']
    };
    return outcomeMap[objective] || ['提升营销效果'];
  }

  // 更新策略
  async updateStrategy(id: string, updates: Partial<CampaignStrategy>): Promise<CampaignStrategy> {
    try {
      const response = await apiClient.put<ApiResponse<CampaignStrategy>>(`/api/strategies/${id}`, updates);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || '策略更新失败');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('更新策略失败:', error);
      throw error;
    }
  }

  // 删除策略
  async deleteStrategy(id: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/api/strategies/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.error || '策略删除失败');
      }
    } catch (error) {
      console.error('删除策略失败:', error);
      throw error;
    }
  }

  // 获取策略列表
  async getStrategies(): Promise<CampaignStrategy[]> {
    try {
      const response = await apiClient.get<ApiResponse<CampaignStrategy[]>>('/api/strategies');
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || '获取策略列表失败');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('获取策略列表失败:', error);
      throw error;
    }
  }

  // 获取单个策略
  async getStrategy(id: string): Promise<CampaignStrategy> {
    try {
      const response = await apiClient.get<ApiResponse<CampaignStrategy>>(`/api/strategies/${id}`);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || '获取策略失败');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('获取策略失败:', error);
      throw error;
    }
  }

  // 验证策略
  async validateStrategy(strategy: Partial<CampaignStrategy>): Promise<{ isValid: boolean; errors: string[] }> {
    try {
      const response = await apiClient.post<ApiResponse<{ isValid: boolean; errors: string[] }>>('/api/strategies/validate', strategy);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || '策略验证失败');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('策略验证失败:', error);
      throw error;
    }
  }

  // 获取策略模板
  async getStrategyTemplates(): Promise<{ [key in MarketingObjective]: any }> {
    try {
      const response = await apiClient.get<ApiResponse<{ [key in MarketingObjective]: any }>>('/api/strategies/templates');
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || '获取策略模板失败');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('获取策略模板失败:', error);
      throw error;
    }
  }

  // 解析营销意图
  async parseIntent(description: string): Promise<MarketingIntent> {
    try {
      const response = await apiClient.post<ApiResponse<MarketingIntent>>('/api/strategies/parse-intent', { description });
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || '意图解析失败');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('意图解析失败:', error);
      throw error;
    }
  }

  // 预测策略效果
  async predictOutcome(strategy: CampaignStrategy): Promise<{
    expectedReach: number;
    expectedEngagement: number;
    expectedConversion: number;
    confidence: number;
  }> {
    try {
      const response = await apiClient.post<ApiResponse<{
        expectedReach: number;
        expectedEngagement: number;
        expectedConversion: number;
        confidence: number;
      }>>('/api/strategies/predict', strategy);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || '效果预测失败');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('效果预测失败:', error);
      throw error;
    }
  }

  // 复制策略
  async duplicateStrategy(strategy: CampaignStrategy): Promise<CampaignStrategy> {
    if (this.isDevelopment) {
      // 开发环境模拟复制
      await mockApiDelay(1000);
      mockApiError('策略复制失败', 0.02);

      const duplicatedStrategy: CampaignStrategy = {
        ...strategy,
        id: `strategy-${Date.now()}`,
        name: `${strategy.name} (副本)`,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return duplicatedStrategy;
    }

    try {
      const response = await apiClient.post<ApiResponse<CampaignStrategy>>('/api/strategies/duplicate', strategy);

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || '策略复制失败');
      }

      return response.data.data;
    } catch (error) {
      console.error('策略复制失败:', error);
      throw error;
    }
  }
}

export const strategyService = new StrategyService();
