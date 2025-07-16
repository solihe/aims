// AIMS 内容服务
import { ContentRequest, ContentMatrix, PlatformContent, ApiResponse, CampaignStrategy, MarketingObjective } from '../../types';
import { apiClient } from '../api/apiClient';
import { ContentCalendarItem } from '../../stores/useContentStore';
import { mockApiDelay, mockApiError } from '../../data/mockData';
import { llmService } from '../llm/llmService';
import { useLLMStore } from '../../stores/useLLMStore';

class ContentService {
  private isDevelopment = import.meta.env.DEV;

  // 获取LLM配置
  private getLLMConfig() {
    try {
      // 从localStorage获取LLM配置
      const llmState = localStorage.getItem('llm-store');
      if (!llmState) {
        return null;
      }

      const parsed = JSON.parse(llmState);
      const configs = parsed.state?.configs || [];

      // 返回第一个可用的配置
      return configs.find((config: any) => config.apiKey) || null;
    } catch (error) {
      console.error('获取LLM配置失败:', error);
      return null;
    }
  }

  // 生成内容日历
  async generateContentCalendar(strategy: CampaignStrategy): Promise<ContentCalendarItem[]> {
    if (this.isDevelopment) {
      // 开发环境使用LLM生成真实内容
      await mockApiDelay(3000); // 模拟API延迟
      mockApiError('内容日历生成失败', 0.05); // 5%概率模拟错误

      return this.generateLLMContentCalendar(strategy);
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

  // 使用LLM生成内容日历
  private async generateLLMContentCalendar(strategy: CampaignStrategy): Promise<ContentCalendarItem[]> {
    const calendar: ContentCalendarItem[] = [];
    let currentWeek = 1;
    let itemId = 1;

    // 遍历策略阶段
    for (const phase of strategy.phases) {
      for (let week = 0; week < phase.duration; week++) {
        // 为每个平台生成内容
        for (const [platform, roleInfo] of Object.entries(strategy.platformRoles)) {
          const frequency = typeof roleInfo === 'object' ? roleInfo.frequency : 2;
          const contentTypes = typeof roleInfo === 'object' ? roleInfo.contentTypes : ['内容'];

          // 根据频率生成内容
          for (let i = 0; i < frequency; i++) {
            const contentType = contentTypes[i % contentTypes.length];
            const dayOfWeek = Math.floor((i * 7) / frequency) + 1;

            try {
              // 使用LLM生成标题和内容
              console.log(`正在为${platform}平台生成${contentType}内容...`, {
                strategy: strategy.name,
                phase: phase.name,
                description: strategy.description?.slice(0, 50) + '...'
              });

              const { title, content, hashtags } = await this.generateContentWithLLM(
                strategy,
                phase,
                platform,
                contentType
              );

              console.log(`${platform}内容生成成功:`, { title: title.slice(0, 30) + '...' });

              calendar.push({
                id: `content-${itemId++}`,
                week: currentWeek,
                day: dayOfWeek,
                platform,
                contentType,
                title,
                content,
                hashtags,
                mediaRequirements: this.generateMediaRequirements(contentType),
                publishTime: this.generatePublishTime(dayOfWeek, i),
                phase: phase.name,
                objective: phase.objectives[0] || '传播推广',
                status: 'draft'
              });
            } catch (error) {
              console.error(`生成${platform}内容失败:`, error);
              console.warn(`使用备用模板为${platform}生成内容`);

              // 如果LLM生成失败，使用备用模板
              calendar.push({
                id: `content-${itemId++}`,
                week: currentWeek,
                day: dayOfWeek,
                platform,
                contentType,
                title: this.generateFallbackTitle(strategy, phase, platform, contentType),
                content: this.generateFallbackContent(strategy, phase, platform, contentType),
                hashtags: this.generateHashtags(strategy.contentThemes, platform),
                mediaRequirements: this.generateMediaRequirements(contentType),
                publishTime: this.generatePublishTime(dayOfWeek, i),
                phase: phase.name,
                objective: phase.objectives[0] || '传播推广',
                status: 'draft'
              });
            }
          }
        }
        currentWeek++;
      }
    }

    return calendar.sort((a, b) => a.week - b.week || a.day - b.day);
  }

  // 使用LLM生成具体内容
  private async generateContentWithLLM(
    strategy: CampaignStrategy,
    phase: any,
    platform: string,
    contentType: string
  ): Promise<{ title: string; content: string; hashtags: string[] }> {
    // 获取LLM配置
    const config = this.getLLMConfig();

    if (!config) {
      throw new Error('LLM配置未找到，请先在设置中配置LLM服务');
    }

    // 构建提示词
    const prompt = this.buildContentPrompt(strategy, phase, platform, contentType);

    try {
      const response = await llmService.generateContent({
        messages: [
          {
            role: 'system',
            content: '你是一个专业的营销内容创作专家，擅长为不同平台创作吸引人的营销内容。请严格按照JSON格式返回结果。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        config
      });

      // 解析LLM响应
      const result = this.parseLLMResponse(response.content);
      return result;
    } catch (error) {
      console.error('LLM内容生成失败:', error);
      throw error;
    }
  }

  // 构建内容生成提示词
  private buildContentPrompt(
    strategy: CampaignStrategy,
    phase: any,
    platform: string,
    contentType: string
  ): string {
    const objectiveLabels = {
      'product_launch': '产品发布',
      'brand_building': '品牌建设',
      'lead_generation': '线索获取',
      'sales_conversion': '销售转化',
      'crisis_management': '危机管理'
    };

    const platformStyles = {
      'weibo': '微博风格：简洁有力，使用表情符号，适合快速传播',
      'zhihu': '知乎风格：专业深度，逻辑清晰，提供价值',
      'xiaohongshu': '小红书风格：生活化，真实体验，视觉化表达',
      'douyin': '抖音风格：年轻化，有趣互动，短视频思维',
      'wechat': '微信风格：亲和力强，适合朋友圈分享'
    };

    // 提取品牌/产品信息
    const brandInfo = this.extractBrandInfo(strategy.description);

    return `
你是一个专业的营销内容创作者，需要为品牌/产品创作推广内容。

## 推广对象
${strategy.description}

## 营销任务
- 营销目标：${objectiveLabels[strategy.objective as keyof typeof objectiveLabels] || strategy.objective}
- 当前阶段：${phase.name}
- 阶段任务：${phase.objectives.join('、')}
- 核心卖点：${strategy.contentThemes.join('、')}

## 内容要求
- 目标平台：${platform}
- 内容类型：${contentType}
- 创作风格：${platformStyles[platform as keyof typeof platformStyles] || '专业营销风格'}

## 创作指导
请创作能够实现"${phase.objectives.join('、')}"目标的${contentType}内容。
内容应该：
1. 突出品牌/产品的核心价值和特色
2. 符合${phase.name}阶段的传播策略
3. 适合${platform}平台的用户群体
4. 能够引起目标用户的兴趣和互动

## 输出格式
请严格按照以下JSON格式返回：
{
  "title": "吸引人的标题（突出品牌/产品亮点，不超过50字）",
  "content": "完整的推广文案（重点介绍品牌/产品，符合平台特色）",
  "hashtags": ["品牌相关标签", "产品特色标签", "目标用户标签"]
}

重要提醒：
- 你要推广的是具体的品牌/产品，不是营销策略本身
- 内容要让用户对品牌/产品产生兴趣，而不是了解营销计划
- 根据阶段目标调整内容重点（认知/兴趣/转化等）
- 保持内容的真实性和吸引力
`;
  }

  // 提取品牌信息（辅助方法）
  private extractBrandInfo(description: string): { brandName: string; productType: string; keyFeatures: string[] } {
    // 简单的品牌信息提取逻辑
    const words = description.split(/\s+|，|。|、/);
    const brandName = words.find(word => word.includes('品牌') || word.length > 2) || '品牌';
    const productType = words.find(word => word.includes('产品') || word.includes('服务')) || '产品';
    const keyFeatures = words.filter(word => word.length > 2 && !word.includes('的')).slice(0, 3);

    return { brandName, productType, keyFeatures };
  }

  // 解析LLM响应
  private parseLLMResponse(response: string): { title: string; content: string; hashtags: string[] } {
    try {
      // 尝试提取JSON部分
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('未找到有效的JSON响应');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        title: parsed.title || '营销内容标题',
        content: parsed.content || '营销内容正文',
        hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : ['营销', '推广']
      };
    } catch (error) {
      console.error('解析LLM响应失败:', error);
      // 返回默认值
      return {
        title: '营销内容标题',
        content: '营销内容正文',
        hashtags: ['营销', '推广']
      };
    }
  }

  // 生成模拟内容日历（备用方法）
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
              title: this.generateFallbackTitle(strategy, phase, platform, contentType),
              content: this.generateFallbackContent(strategy, phase, platform, contentType),
              hashtags: this.generateHashtags(strategy.contentThemes, platform),
              mediaRequirements: this.generateMediaRequirements(contentType),
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

  // 生成备用标题（当LLM失败时使用）
  private generateFallbackTitle(strategy: CampaignStrategy, phase: any, platform: string, contentType: string): string {
    // 从描述中提取品牌名称
    const brandName = this.extractBrandNameFromDescription(strategy.description);

    const templates = [
      `${brandName}全新亮相，${phase.objectives[0]}正式启动`,
      `发现${brandName}的独特魅力`,
      `${brandName}带来全新体验`,
      `为什么选择${brandName}？`,
      `${brandName}：${strategy.contentThemes.join('与')}的完美结合`
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  // 从描述中提取品牌名称
  private extractBrandNameFromDescription(description: string): string {
    // 查找可能的品牌名称
    const words = description.split(/\s+|，|。|、/);

    // 查找明确的品牌标识
    for (const word of words) {
      if (word.includes('品牌') && word.length > 2) {
        return word.replace('品牌', '').replace('是一个', '').replace('的', '');
      }
      if (word.length >= 2 && word.length <= 6 && !word.includes('一个') && !word.includes('新创')) {
        // 可能是品牌名称
        if (words.indexOf(word) < 3) { // 通常品牌名在描述前部
          return word;
        }
      }
    }

    return '我们的品牌';
  }

  // 生成备用内容（当LLM失败时使用）
  private generateFallbackContent(strategy: CampaignStrategy, phase: any, platform: string, contentType: string): string {
    const brandName = this.extractBrandNameFromDescription(strategy.description);

    // 根据平台生成不同风格的内容
    const platformContent = {
      'weibo': this.generateWeiboContent(brandName, strategy, phase),
      'zhihu': this.generateZhihuContent(brandName, strategy, phase),
      'xiaohongshu': this.generateXiaohongshuContent(brandName, strategy, phase),
      'douyin': this.generateDouyinContent(brandName, strategy, phase),
      'wechat': this.generateWechatContent(brandName, strategy, phase)
    };

    return platformContent[platform as keyof typeof platformContent] ||
           this.generateGenericContent(brandName, strategy, phase);
  }

  // 微博风格内容
  private generateWeiboContent(brandName: string, strategy: CampaignStrategy, phase: any): string {
    return `🔥 ${brandName}正式亮相！

✨ ${strategy.contentThemes.join('、')}的完美融合
🎯 ${phase.objectives.join('、')}
💫 ${strategy.description.slice(0, 50)}...

期待与你一起探索更多可能！

#${brandName} #${strategy.contentThemes.join(' #')}`;
  }

  // 知乎风格内容
  private generateZhihuContent(brandName: string, strategy: CampaignStrategy, phase: any): string {
    return `# ${brandName}：${strategy.contentThemes.join('与')}的创新结合

## 品牌背景

${strategy.description}

## 核心优势

${strategy.contentThemes.map((theme, index) => `${index + 1}. **${theme}**：为用户带来独特价值`).join('\n')}

## 当前发展

我们正在${phase.name}阶段，专注于${phase.objectives.join('、')}。

期待与更多朋友交流，共同探讨${strategy.contentThemes.join('、')}的未来发展。`;
  }

  // 小红书风格内容
  private generateXiaohongshuContent(brandName: string, strategy: CampaignStrategy, phase: any): string {
    return `发现宝藏品牌${brandName}！✨

${strategy.description.slice(0, 80)}...

💎 为什么推荐：
${strategy.contentThemes.map(theme => `• ${theme}体验超棒`).join('\n')}

🌟 真实感受：
${phase.objectives.join('，')}，每一个细节都很用心！

姐妹们快来了解一下～

#${brandName} #${strategy.contentThemes.join(' #')} #好物推荐`;
  }

  // 抖音风格内容
  private generateDouyinContent(brandName: string, strategy: CampaignStrategy, phase: any): string {
    return `🎬 ${brandName}来了！

${strategy.description.slice(0, 60)}...

🔥 亮点：
${strategy.contentThemes.map(theme => `✅ ${theme}`).join('\n')}

💫 ${phase.objectives.join('、')}正在进行中

关注我，带你了解更多！

#${brandName} #${strategy.contentThemes.join(' #')}`;
  }

  // 微信风格内容
  private generateWechatContent(brandName: string, strategy: CampaignStrategy, phase: any): string {
    return `朋友们，给大家介绍一个不错的品牌——${brandName}

${strategy.description}

特别喜欢它的${strategy.contentThemes.join('和')}，${phase.objectives.join('，')}做得很到位。

分享给大家，希望对你们也有帮助 😊`;
  }

  // 通用内容
  private generateGenericContent(brandName: string, strategy: CampaignStrategy, phase: any): string {
    return `${brandName}为您带来全新体验

${strategy.description}

核心特色：${strategy.contentThemes.join('、')}
当前重点：${phase.objectives.join('、')}

期待与您一起探索更多可能！`;
  }

  // 生成话题标签
  private generateHashtags(themes: string[], platform: string): string[] {
    // 基于主题生成相关标签
    const themeHashtags = themes.slice(0, 2);

    const platformHashtags = {
      'weibo': ['新品推荐', '品牌故事'],
      'zhihu': ['产品体验', '行业分析'],
      'xiaohongshu': ['种草', '好物推荐'],
      'douyin': ['新发现', '值得关注'],
      'wechat': ['分享', '推荐']
    };

    const additional = platformHashtags[platform as keyof typeof platformHashtags] || ['品牌推荐', '产品体验'];
    return [...themeHashtags, ...additional];
  }

  // 生成素材需求
  private generateMediaRequirements(contentType: string): string {
    const requirements = {
      '动态': '配图1-3张，建议使用高质量产品图或场景图',
      '文章': '封面图1张，正文配图2-5张，建议图文并茂',
      '笔记': '封面图1张，步骤图3-6张，建议真实拍摄',
      '视频': '视频时长15-60秒，建议高清录制',
      '话题': '话题海报1张，互动图片2-3张',
      '内容': '相关配图1-2张'
    };

    return requirements[contentType as keyof typeof requirements] || '相关配图1-2张';
  }

  // 生成模拟标题（保留原方法作为备用）
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

  // 生成模拟话题标签（保留作为备用）
  private generateMockHashtags(themes: string[], platform: string): string[] {
    const baseHashtags = themes.slice(0, 2);
    const themeHashtags = themes.map(theme => `${theme}相关`);

    return [...baseHashtags, ...themeHashtags.slice(0, 2)];
  }

  // 生成模拟素材需求（保留作为备用）
  private generateMockMediaRequirements(contentType: string): string {
    const requirements = {
      '动态': '相关配图1-3张',
      '文章': '封面图 + 正文配图',
      '笔记': '步骤图 + 效果图',
      '视频': '视频素材 + 封面图',
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
