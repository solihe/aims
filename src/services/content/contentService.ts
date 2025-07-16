// AIMS 内容服务
import { ContentRequest, ContentMatrix, PlatformContent, ApiResponse, CampaignStrategy, MarketingObjective } from '../../types';
import { apiClient } from '../api/apiClient';
import { ContentCalendarItem } from '../../stores/useContentStore';
import { mockApiDelay, mockApiError } from '../../data/mockData';

class ContentService {
  private isDevelopment = import.meta.env.DEV;

  // 生成内容日历
  async generateContentCalendar(strategy: CampaignStrategy): Promise<ContentCalendarItem[]> {
    if (this.isDevelopment) {
      // 开发环境使用模拟数据
      await mockApiDelay(3000); // 模拟API延迟
      mockApiError('内容日历生成失败', 0.05); // 5%概率模拟错误

      return this.generateMockContentCalendar(strategy);
    }

    try {
      const response = await apiClient.post<ApiResponse<ContentCalendarItem[]>>('/api/content/calendar', strategy);

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || '内容日历生成失败');
      }

      return response.data.data;
    } catch (error) {
      console.error('内容日历生成失败:', error);
      throw error;
    }
  }

  // 生成模拟内容日历
  private generateMockContentCalendar(strategy: CampaignStrategy): ContentCalendarItem[] {
    const calendar: ContentCalendarItem[] = [];
    let currentWeek = 1;
    let itemId = 1;

    // 遍历策略阶段
    for (const phase of strategy.phases) {
      for (let week = 0; week < phase.duration; week++) {
        // 为每个平台生成内容
        Object.entries(strategy.platformRoles).forEach(([platform, roleInfo]) => {
          const frequency = typeof roleInfo === 'object' ? roleInfo.frequency : 2;
          const contentTypes = typeof roleInfo === 'object' ? roleInfo.contentTypes : ['内容'];

          // 根据频率生成内容
          for (let i = 0; i < frequency; i++) {
            const contentType = contentTypes[i % contentTypes.length];
            const dayOfWeek = Math.floor((i * 7) / frequency) + 1;

            calendar.push({
              id: `content-${itemId++}`,
              week: currentWeek,
              day: dayOfWeek,
              platform,
              contentType,
              title: this.generateMockTitle(strategy.objective, phase.name, platform, contentType),
              content: this.generateMockContent(strategy.objective, phase.name, platform, contentType),
              hashtags: this.generateMockHashtags(strategy.contentThemes, platform),
              mediaRequirements: this.generateMockMediaRequirements(contentType),
              publishTime: this.generatePublishTime(dayOfWeek, i),
              phase: phase.name,
              objective: phase.objectives[0] || '传播推广',
              status: 'draft'
            });
          }
        });
        currentWeek++;
      }
    }

    return calendar.sort((a, b) => a.week - b.week || a.day - b.day);
  }

  // 生成模拟标题
  private generateMockTitle(objective: string, phase: string, platform: string, contentType: string): string {
    const titleTemplates = {
      'product_launch': {
        '预热期': ['即将发布！AI老人看护台灯预告', '科技关爱，智能守护即将到来', '革命性老人看护产品即将面世'],
        '发布期': ['正式发布：AI老人看护台灯', '智能看护新时代正式开启', '科技守护，让爱更贴心'],
        '深化期': ['深度解析：AI看护台灯的技术原理', '用户体验分享：智能看护的温暖', '专业评测：AI老人看护台灯'],
        '持续期': ['用户反馈：AI看护台灯使用心得', '持续优化：让科技更懂关爱', '社区分享：智能看护经验']
      }
    };

    const templates = titleTemplates[objective as keyof typeof titleTemplates] || titleTemplates['product_launch'];
    const phaseTemplates = templates[phase as keyof typeof templates] || templates['发布期'];

    return phaseTemplates[Math.floor(Math.random() * phaseTemplates.length)];
  }

  // 生成模拟内容
  private generateMockContent(objective: string, phase: string, platform: string, contentType: string): string {
    const contentTemplates = {
      weibo: `🔥 AI老人看护台灯即将震撼发布！

✨ 核心亮点：
• 智能健康监测，24小时守护
• 语音交互，温暖陪伴
• 紧急呼叫，安全保障
• 睡眠优化，科学照明

让科技成为家人间最温暖的桥梁 ❤️

#AI看护 #智能家居 #老人关爱`,

      zhihu: `# AI老人看护台灯：科技与关爱的完美结合

## 产品背景

随着人口老龄化加剧，老人独居安全问题日益突出。我们的AI老人看护台灯，正是为了解决这一社会痛点而生。

## 核心技术

1. **智能传感器阵列**：实时监测老人生命体征
2. **AI算法引擎**：智能分析异常情况
3. **语音交互系统**：自然对话，情感陪伴
4. **紧急响应机制**：快速联系家属或医护

## 使用场景

- 夜间起夜安全照明
- 日常健康数据监测
- 紧急情况快速响应
- 孤独时的智能陪伴

这不仅仅是一盏台灯，更是家人间爱的延伸。`,

      xiaohongshu: `给爸妈买的AI看护台灯到了！✨

真的太贴心了，分享几个超实用功能：

🌙 智能夜灯模式
老人夜间起夜自动感应亮灯，再也不怕摔倒了

💬 语音陪伴功能
可以和台灯聊天，缓解独居孤独感

📱 远程监护
我在外地也能实时了解爸妈的健康状况

🚨 紧急呼叫
一键求助，第一时间通知家属

科技让爱更有温度 ❤️

#AI台灯 #老人看护 #智能家居 #孝心好物`
    };

    return contentTemplates[platform as keyof typeof contentTemplates] || contentTemplates.weibo;
  }

  // 生成模拟话题标签
  private generateMockHashtags(themes: string[], platform: string): string[] {
    const baseHashtags = ['AI看护', '智能家居', '老人关爱', '科技生活'];
    const themeHashtags = themes.map(theme => `${theme}产品`);

    return [...baseHashtags.slice(0, 2), ...themeHashtags.slice(0, 2)];
  }

  // 生成模拟素材需求
  private generateMockMediaRequirements(contentType: string): string {
    const requirements = {
      '动态': '产品实拍图 + 使用场景图',
      '文章': '产品细节图 + 技术原理图 + 使用效果对比图',
      '笔记': '开箱视频 + 使用演示 + 效果展示',
      '视频': '产品介绍视频 + 用户体验视频',
      '话题': '话题海报 + 互动图片'
    };

    return requirements[contentType as keyof typeof requirements] || '相关配图';
  }

  // 生成发布时间
  private generatePublishTime(day: number, index: number): string {
    const times = ['09:00', '14:00', '19:00', '21:00'];
    const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

    return `${dayNames[day - 1]} ${times[index % times.length]}`;
  }

  // 生成内容矩阵
  async generateContent(request: ContentRequest): Promise<ContentMatrix> {
    try {
      const response = await apiClient.post<ApiResponse<ContentMatrix>>('/api/content/generate', request);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || '内容生成失败');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('内容生成失败:', error);
      throw error;
    }
  }

  // 更新内容
  async updateContent(matrixId: string, platformId: string, content: string): Promise<ContentMatrix> {
    try {
      const response = await apiClient.put<ApiResponse<ContentMatrix>>(`/api/content/${matrixId}/platforms/${platformId}`, {
        content
      });
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || '内容更新失败');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('内容更新失败:', error);
      throw error;
    }
  }

  // 审批内容
  async approveContent(matrixId: string, platformId: string): Promise<ContentMatrix> {
    try {
      const response = await apiClient.post<ApiResponse<ContentMatrix>>(`/api/content/${matrixId}/platforms/${platformId}/approve`);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || '内容审批失败');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('内容审批失败:', error);
      throw error;
    }
  }

  // 发布内容
  async publishContent(matrixId: string, platformId: string): Promise<ContentMatrix> {
    try {
      const response = await apiClient.post<ApiResponse<ContentMatrix>>(`/api/content/${matrixId}/platforms/${platformId}/publish`);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || '内容发布失败');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('内容发布失败:', error);
      throw error;
    }
  }

  // 获取内容矩阵列表
  async getMatrices(): Promise<ContentMatrix[]> {
    try {
      const response = await apiClient.get<ApiResponse<ContentMatrix[]>>('/api/content');
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || '获取内容列表失败');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('获取内容列表失败:', error);
      throw error;
    }
  }

  // 获取单个内容矩阵
  async getMatrix(id: string): Promise<ContentMatrix> {
    try {
      const response = await apiClient.get<ApiResponse<ContentMatrix>>(`/api/content/${id}`);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || '获取内容失败');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('获取内容失败:', error);
      throw error;
    }
  }

  // 删除内容矩阵
  async deleteMatrix(id: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/api/content/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.error || '删除内容失败');
      }
    } catch (error) {
      console.error('删除内容失败:', error);
      throw error;
    }
  }

  // 检查内容质量
  async checkQuality(content: string, platform: string): Promise<{
    score: number;
    suggestions: string[];
    issues: string[];
  }> {
    try {
      const response = await apiClient.post<ApiResponse<{
        score: number;
        suggestions: string[];
        issues: string[];
      }>>('/api/content/quality-check', { content, platform });
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || '质量检查失败');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('质量检查失败:', error);
      throw error;
    }
  }

  // 优化内容
  async optimizeContent(content: string, platform: string, goal: string): Promise<string> {
    try {
      const response = await apiClient.post<ApiResponse<{ optimizedContent: string }>>('/api/content/optimize', {
        content,
        platform,
        goal
      });
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || '内容优化失败');
      }
      
      return response.data.data.optimizedContent;
    } catch (error) {
      console.error('内容优化失败:', error);
      throw error;
    }
  }

  // 预览内容效果
  async previewPerformance(content: PlatformContent): Promise<{
    expectedReach: number;
    expectedEngagement: number;
    confidence: number;
  }> {
    try {
      const response = await apiClient.post<ApiResponse<{
        expectedReach: number;
        expectedEngagement: number;
        confidence: number;
      }>>('/api/content/preview-performance', content);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || '效果预览失败');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('效果预览失败:', error);
      throw error;
    }
  }
}

export const contentService = new ContentService();
