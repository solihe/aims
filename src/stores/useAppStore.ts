// AIMS 主应用状态管理
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { AppState, User } from '../types';

interface AppStore extends AppState {
  // Actions
  setCurrentView: (view: AppState['currentView']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

export const useAppStore = create<AppStore>()(
  devtools(
    (set) => ({
      // Initial state
      currentView: 'strategy',
      isLoading: false,
      error: null,
      user: null,

      // Actions
      setCurrentView: (view) => set({ currentView: view }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setUser: (user) => set({ user }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'app-store',
    }
  )
);
