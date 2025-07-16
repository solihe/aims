// LLM配置状态管理
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  LLMConfig, 
  LLMProvider, 
  LLMUsageStats, 
  AVAILABLE_MODELS, 
  DEFAULT_LLM_CONFIGS,
  API_ENDPOINTS 
} from '../types/llm';

interface LLMState {
  configs: LLMConfig[];
  currentConfig: LLMConfig | null;
  usageStats: LLMUsageStats[];
  isLoading: boolean;
  error: string | null;
}

interface LLMStore extends LLMState {
  // Actions
  addConfig: (config: Omit<LLMConfig, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateConfig: (id: string, updates: Partial<LLMConfig>) => void;
  deleteConfig: (id: string) => void;
  setDefaultConfig: (id: string) => void;
  toggleConfigActive: (id: string) => void;
  testConnection: (id: string) => Promise<boolean>;
  loadConfigs: () => void;
  getActiveConfigs: () => LLMConfig[];
  getDefaultConfig: () => LLMConfig | null;
  getConfigByProvider: (provider: LLMProvider) => LLMConfig[];
  updateUsageStats: (provider: LLMProvider, model: string, tokens: number, responseTime: number, cost: number) => void;
  clearError: () => void;
  resetToDefaults: () => void;
}

export const useLLMStore = create<LLMStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        configs: [],
        currentConfig: null,
        usageStats: [],
        isLoading: false,
        error: null,

        // Actions
        addConfig: (configData) => {
          const newConfig: LLMConfig = {
            ...configData,
            id: `llm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          set((state) => ({
            configs: [...state.configs, newConfig],
            currentConfig: configData.isDefault ? newConfig : state.currentConfig,
          }));
        },

        updateConfig: (id, updates) => {
          set((state) => ({
            configs: state.configs.map((config) =>
              config.id === id
                ? { ...config, ...updates, updatedAt: new Date() }
                : config
            ),
            currentConfig:
              state.currentConfig?.id === id
                ? { ...state.currentConfig, ...updates, updatedAt: new Date() }
                : state.currentConfig,
          }));
        },

        deleteConfig: (id) => {
          set((state) => {
            const configToDelete = state.configs.find(c => c.id === id);
            const remainingConfigs = state.configs.filter((config) => config.id !== id);
            
            // 如果删除的是默认配置，设置第一个激活的配置为默认
            let newCurrentConfig = state.currentConfig;
            if (configToDelete?.isDefault && remainingConfigs.length > 0) {
              const firstActive = remainingConfigs.find(c => c.isActive);
              if (firstActive) {
                remainingConfigs.forEach(c => c.isDefault = c.id === firstActive.id);
                newCurrentConfig = firstActive;
              }
            }

            return {
              configs: remainingConfigs,
              currentConfig: state.currentConfig?.id === id ? newCurrentConfig : state.currentConfig,
            };
          });
        },

        setDefaultConfig: (id) => {
          set((state) => {
            const updatedConfigs = state.configs.map((config) => ({
              ...config,
              isDefault: config.id === id,
              updatedAt: config.id === id ? new Date() : config.updatedAt,
            }));

            const newDefaultConfig = updatedConfigs.find(c => c.id === id);

            return {
              configs: updatedConfigs,
              currentConfig: newDefaultConfig || state.currentConfig,
            };
          });
        },

        toggleConfigActive: (id) => {
          set((state) => ({
            configs: state.configs.map((config) =>
              config.id === id
                ? { ...config, isActive: !config.isActive, updatedAt: new Date() }
                : config
            ),
          }));
        },

        testConnection: async (id) => {
          const config = get().configs.find(c => c.id === id);
          if (!config) return false;

          set({ isLoading: true, error: null });

          try {
            // 模拟API连接测试
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 这里应该实现真实的API测试逻辑
            const testResult = Math.random() > 0.2; // 80%成功率模拟
            
            if (!testResult) {
              throw new Error('API连接测试失败');
            }

            set({ isLoading: false });
            return true;
          } catch (error) {
            set({ 
              isLoading: false, 
              error: error instanceof Error ? error.message : '连接测试失败' 
            });
            return false;
          }
        },

        loadConfigs: () => {
          const state = get();
          if (state.configs.length === 0) {
            // 初始化默认配置
            const defaultConfigs = DEFAULT_LLM_CONFIGS.map((config, index) => ({
              ...config,
              id: `default-${index}`,
              apiKey: '',
              baseUrl: config.baseUrl || API_ENDPOINTS[config.provider!],
              createdAt: new Date(),
              updatedAt: new Date(),
            })) as LLMConfig[];

            set({ 
              configs: defaultConfigs,
              currentConfig: defaultConfigs.find(c => c.isDefault) || null
            });
          }
        },

        getActiveConfigs: () => {
          return get().configs.filter(config => config.isActive);
        },

        getDefaultConfig: () => {
          return get().configs.find(config => config.isDefault) || null;
        },

        getConfigByProvider: (provider) => {
          return get().configs.filter(config => config.provider === provider);
        },

        updateUsageStats: (provider, model, tokens, responseTime, cost) => {
          set((state) => {
            const existingStats = state.usageStats.find(
              s => s.provider === provider && s.model === model
            );

            if (existingStats) {
              const updatedStats = {
                ...existingStats,
                totalRequests: existingStats.totalRequests + 1,
                totalTokens: existingStats.totalTokens + tokens,
                totalCost: existingStats.totalCost + cost,
                averageResponseTime: (existingStats.averageResponseTime * existingStats.totalRequests + responseTime) / (existingStats.totalRequests + 1),
                lastUsed: new Date(),
              };

              return {
                usageStats: state.usageStats.map(s =>
                  s.provider === provider && s.model === model ? updatedStats : s
                ),
              };
            } else {
              const newStats: LLMUsageStats = {
                provider,
                model,
                totalRequests: 1,
                totalTokens: tokens,
                totalCost: cost,
                averageResponseTime: responseTime,
                successRate: 100,
                lastUsed: new Date(),
              };

              return {
                usageStats: [...state.usageStats, newStats],
              };
            }
          });
        },

        clearError: () => set({ error: null }),

        resetToDefaults: () => {
          const defaultConfigs = DEFAULT_LLM_CONFIGS.map((config, index) => ({
            ...config,
            id: `default-${index}`,
            apiKey: '',
            baseUrl: config.baseUrl || API_ENDPOINTS[config.provider!],
            createdAt: new Date(),
            updatedAt: new Date(),
          })) as LLMConfig[];

          set({
            configs: defaultConfigs,
            currentConfig: defaultConfigs.find(c => c.isDefault) || null,
            usageStats: [],
            error: null,
          });
        },
      }),
      {
        name: 'llm-store',
        partialize: (state) => ({
          configs: state.configs,
          usageStats: state.usageStats,
        }),
      }
    ),
    {
      name: 'llm-store',
    }
  )
);
