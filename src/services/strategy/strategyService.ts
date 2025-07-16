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
        name: `${intent.description.slice(0, 20)}...的传播策略`,
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

  // 提取主题
  private extractThemes(description: string): string[] {
    // 简单的关键词提取逻辑
    const keywords = ['AI', '产品', '技术', '创新', '用户', '价值', '效率', '体验'];
    return keywords.filter(keyword => description.includes(keyword));
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
}

export const strategyService = new StrategyService();
