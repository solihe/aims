// AIMS 策略状态管理
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { StrategyState, CampaignStrategy, MarketingIntent } from '../types';
import { strategyService } from '../services/strategy/strategyService';

interface StrategyStore extends StrategyState {
  // Actions
  createStrategy: (intent: MarketingIntent) => Promise<CampaignStrategy>;
  updateStrategy: (id: string, updates: Partial<CampaignStrategy>) => Promise<void>;
  deleteStrategy: (id: string) => Promise<void>;
  loadStrategies: () => Promise<void>;
  setCurrentStrategy: (strategy: CampaignStrategy | null) => void;
  setCreating: (creating: boolean) => void;
}

export const useStrategyStore = create<StrategyStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentStrategy: null,
      strategies: [],
      isCreating: false,

      // Actions
      createStrategy: async (intent: MarketingIntent) => {
        set({ isCreating: true });
        try {
          const strategy = await strategyService.createStrategy(intent);
          set((state) => ({
            currentStrategy: strategy,
            strategies: [strategy, ...state.strategies],
            isCreating: false,
          }));
          return strategy;
        } catch (error) {
          set({ isCreating: false });
          throw error;
        }
      },

      updateStrategy: async (id: string, updates: Partial<CampaignStrategy>) => {
        try {
          const updatedStrategy = await strategyService.updateStrategy(id, updates);
          set((state) => ({
            strategies: state.strategies.map((s) =>
              s.id === id ? updatedStrategy : s
            ),
            currentStrategy:
              state.currentStrategy?.id === id ? updatedStrategy : state.currentStrategy,
          }));
        } catch (error) {
          throw error;
        }
      },

      deleteStrategy: async (id: string) => {
        try {
          await strategyService.deleteStrategy(id);
          set((state) => ({
            strategies: state.strategies.filter((s) => s.id !== id),
            currentStrategy:
              state.currentStrategy?.id === id ? null : state.currentStrategy,
          }));
        } catch (error) {
          throw error;
        }
      },

      loadStrategies: async () => {
        try {
          const strategies = await strategyService.getStrategies();
          set({ strategies });
        } catch (error) {
          throw error;
        }
      },

      setCurrentStrategy: (strategy) => set({ currentStrategy: strategy }),
      setCreating: (creating) => set({ isCreating: creating }),
    }),
    {
      name: 'strategy-store',
    }
  )
);
