import { create } from 'zustand';

export type FocusTag = string;

export interface TreeItem {
  id: string;
  timestamp: number;
  status: 'success' | 'failed';
  duration: number; // in minutes
  tag?: FocusTag;
}

export interface Theme {
  id: string;
  name: string;
  bgUrl: string;
  audioUrl: string;
}

export type PetId = 'cat' | 'dog' | 'bird' | 'turtle' | 'fox';

export interface Pet {
  id: PetId;
  name: string;
  primary: string;
  secondary: string;
}

export interface PetStats {
  level: number;
  exp: number;
  hunger: number; // 0-100, 100 满饱食度
  lastActiveTime: number; // 用于计算离线饥饿度扣除
}

export type PetStatsMap = Record<PetId, PetStats>;

const INITIAL_PET_STATS: PetStats = {
  level: 1,
  exp: 0,
  hunger: 100,
  lastActiveTime: Date.now()
};

export const LEVEL_EXP_REQUIREMENTS = [0, 100, 250, 500, 1000, 2000, 4000]; // 1级到7级所需经验
export const MAX_LEVEL = LEVEL_EXP_REQUIREMENTS.length;
export const BUILT_IN_PETS: Pet[] = [
  { id: 'cat', name: '小猫', primary: '#f5cba7', secondary: '#5c4332' },
  { id: 'dog', name: '小狗', primary: '#d4a373', secondary: '#5c4332' },
  { id: 'bird', name: '小鸟', primary: '#a3b18a', secondary: '#5c4332' },
  { id: 'turtle', name: '乌龟', primary: '#84a98c', secondary: '#5c4332' },
  { id: 'fox', name: '小狐狸', primary: '#e29578', secondary: '#5c4332' },
];

export const BUILT_IN_THEMES: Theme[] = [
  {
    id: 'lofi-desk',
    name: '温馨书桌',
    bgUrl: '/backgrounds/lofi-desk.jpg',
    audioUrl: 'https://stream.chillhop.com/mp3/9476' // Apple Juice
  },
  {
    id: 'rainy-window',
    name: '雨天窗畔',
    bgUrl: '/backgrounds/rainy-window.jpg',
    audioUrl: 'https://stream.chillhop.com/mp3/8448' // Tôzen
  },
  {
    id: 'cafe-corner',
    name: '午后咖啡',
    bgUrl: '/backgrounds/cafe-corner.jpg',
    audioUrl: 'https://stream.chillhop.com/mp3/8878' // Swiss
  },
  {
    id: 'forest-cabin',
    name: '林间木屋',
    bgUrl: '/backgrounds/forest-cabin.jpg',
    audioUrl: 'https://stream.chillhop.com/mp3/8603' // Like This One
  },
  {
    id: 'night-city',
    name: '城市夜景',
    bgUrl: '/backgrounds/night-city.jpg',
    audioUrl: 'https://stream.chillhop.com/mp3/8598' // Secret Meetings
  },
  {
    id: 'ocean-train',
    name: '海边列车',
    bgUrl: '/backgrounds/ocean-train.jpg',
    audioUrl: 'https://stream.chillhop.com/mp3/8596' // Fluid Dynamics
  }
];

export type FocusStatus = 'idle' | 'preparing' | 'focusing' | 'paused' | 'failed' | 'success';
export type AppTab = 'home' | 'stats';
export type TimePeriod = 'morning' | 'afternoon' | 'evening' | 'night';

export function getCurrentTimePeriod(): TimePeriod {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 23) return 'evening';
  return 'night';
}

interface FocusState {
  status: FocusStatus;
  currentTab: AppTab;
  timeLeft: number;
  totalDuration: number; // in seconds
  activeTheme: Theme;
  activePetId: PetId;
  petStats: PetStatsMap;
  currentTag: FocusTag;
  successCount: number;
  failCount: number;
  weeklyTimeMinutes: number; // total focus time
  forest: TreeItem[];
  volume: number;
  isMuted: boolean;
  showWarning: boolean;
  warningCountdown: number;
  customTags: string[];
  
  setCurrentTab: (tab: AppTab) => void;
  setTheme: (theme: Theme) => void;
  setActivePetId: (petId: PetId) => void;
  setCurrentTag: (tag: FocusTag) => void;
  addCustomTag: (tag: string) => void;
  startFocus: (minutes: number) => void;
  pauseFocus: () => void;
  resumeFocus: () => void;
  exitFocus: () => void;
  failFocus: () => void;
  completeFocus: () => void;
  tick: () => void;
  reset: () => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  setShowWarning: (show: boolean) => void;
  setWarningCountdown: (count: number | ((prev: number) => number)) => void;
  loadStats: () => void;
  saveStats: () => void;
  updatePetHunger: () => void; // 定时更新饥饿度
  hasSeenWelcome: boolean;
  hasGrantedPermission: boolean;
  completeWelcome: () => void;
  showWelcome: () => void;
  grantPermission: () => void;
}

const STORAGE_KEY = 'fish_guardian_stats';

const DEFAULT_PET_STATS_MAP = BUILT_IN_PETS.reduce((acc, pet) => {
  acc[pet.id] = { ...INITIAL_PET_STATS };
  return acc;
}, {} as PetStatsMap);

export const useFocusStore = create<FocusState>((set, get) => ({
  status: 'idle',
  currentTab: 'home',
  timeLeft: 0,
  totalDuration: 0,
  activeTheme: BUILT_IN_THEMES[0],
  activePetId: BUILT_IN_PETS[0].id,
  petStats: DEFAULT_PET_STATS_MAP,
  currentTag: 'work',
  successCount: 0,
  failCount: 0,
  weeklyTimeMinutes: 0,
  forest: [],
  volume: 0.5,
  isMuted: false,
  showWarning: false,
  warningCountdown: 0,
  hasSeenWelcome: false,
  hasGrantedPermission: false,
  customTags: [],

  completeWelcome: () => {
    set({ hasSeenWelcome: true });
    get().saveStats();
  },
  showWelcome: () => set({ hasSeenWelcome: false }),

  setCurrentTab: (tab) => set({ currentTab: tab }),

  setTheme: (theme) => set({ activeTheme: theme }),
  setActivePetId: (petId) => set({ activePetId: petId }),
  setCurrentTag: (tag) => set({ currentTag: tag }),
  addCustomTag: (tag) => set((state) => {
    const currentTags = state.customTags || [];
    if (currentTags.includes(tag)) return {};
    const newTags = [...currentTags, tag];
    return { customTags: newTags };
  }),

  setShowWarning: (show) => set({ showWarning: show }),
  setWarningCountdown: (count) =>
    set((state) => ({
      warningCountdown:
        typeof count === 'function' ? Math.max(0, count(state.warningCountdown)) : Math.max(0, count),
    })),

  loadStats: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // 重新计算真正的总时长：无论成功还是失败，只要 duration > 0 都算入总专注时长
        let actualTotalMinutes = 0;
        if (parsed.forest && Array.isArray(parsed.forest)) {
          parsed.forest.forEach((tree: TreeItem) => {
            if (tree.duration > 0) {
              actualTotalMinutes += tree.duration;
            }
          });
        }
        
        set({
          successCount: parsed.successCount || 0,
          failCount: parsed.failCount || 0,
          weeklyTimeMinutes: actualTotalMinutes, 
          forest: parsed.forest || [],
          activePetId: parsed.activePetId || BUILT_IN_PETS[0].id,
          petStats: parsed.petStats || DEFAULT_PET_STATS_MAP,
          hasSeenWelcome: parsed.hasSeenWelcome || false,
          hasGrantedPermission: parsed.hasGrantedPermission || false,
          customTags: parsed.customTags || [],
        });
        
        get().updatePetHunger();
      }
    } catch (e) {
      console.error('Failed to load stats', e);
    }
  },

  saveStats: () => {
    const state = get();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      successCount: state.successCount,
      failCount: state.failCount,
      weeklyTimeMinutes: state.weeklyTimeMinutes,
      forest: state.forest,
      activePetId: state.activePetId,
      petStats: state.petStats,
      hasSeenWelcome: state.hasSeenWelcome,
      hasGrantedPermission: state.hasGrantedPermission,
      customTags: state.customTags,
    }));
  },

  grantPermission: () => {
    set({ hasGrantedPermission: true });
    get().saveStats();
  },

  updatePetHunger: () => {
    const now = Date.now();
    set((state) => {
      const newPetStats = { ...state.petStats };
      let changed = false;
      
      Object.keys(newPetStats).forEach((key) => {
        const petId = key as PetId;
        const stats = newPetStats[petId];
        // 假设每小时掉 5 点饥饿度
        const hoursPassed = (now - stats.lastActiveTime) / (1000 * 60 * 60);
        if (hoursPassed >= 1) {
          const hungerDrop = Math.floor(hoursPassed * 5);
          if (hungerDrop > 0 && stats.hunger > 0) {
            stats.hunger = Math.max(0, stats.hunger - hungerDrop);
            stats.lastActiveTime = now;
            changed = true;
          }
        }
      });
      
      return changed ? { petStats: newPetStats } : {};
    });
  },

  startFocus: (minutes: number) => {
    const durationSeconds = minutes * 60;
    set({ 
      status: 'preparing', 
      timeLeft: 5, 
      totalDuration: durationSeconds,
      showWarning: false
    });
  },

  pauseFocus: () => {
    if (get().status === 'focusing') {
      set({ status: 'paused', showWarning: false });
    }
  },

  resumeFocus: () => {
    if (get().status === 'paused') {
      set({ status: 'focusing' });
    }
  },

  exitFocus: () => {
    // 改为调用 failFocus 以确保中途退出也算作破戒
    get().failFocus();
  },

  failFocus: () => {
    const state = get();
    if (state.status !== 'focusing' && state.status !== 'paused') return;
    
    // 计算已度过的时间（秒），并转换为分钟
    const elapsedSeconds = state.totalDuration - state.timeLeft;
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    
    const newTree: TreeItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      status: 'failed',
      duration: elapsedMinutes,
      tag: state.currentTag
    };

    set((state) => {
      const activePetId = state.activePetId;
      const petStats = { ...state.petStats };
      const currentStats = { ...petStats[activePetId] };
      
      // 失败扣除 5 点经验，饥饿度不增加
      currentStats.exp = Math.max(0, currentStats.exp - 5);
      // 等级如果经验掉下去了，也需要降级判定
      if (currentStats.level > 1 && currentStats.exp < LEVEL_EXP_REQUIREMENTS[currentStats.level - 1]) {
        currentStats.level -= 1;
      }
      
      petStats[activePetId] = currentStats;

      return {
        status: 'failed',
        failCount: state.failCount + 1,
        weeklyTimeMinutes: state.weeklyTimeMinutes + elapsedMinutes,
        forest: [...state.forest, newTree],
        showWarning: false,
        petStats
      };
    });
    
    get().saveStats();
  },

  completeFocus: () => {
    const state = get();
    if (state.status !== 'focusing') return;

    const focusMinutes = Math.floor(state.totalDuration / 60);

    const newTree: TreeItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      status: 'success',
      duration: focusMinutes,
      tag: state.currentTag
    };

    set((state) => {
      const activePetId = state.activePetId;
      const petStats = { ...state.petStats };
      const currentStats = { ...petStats[activePetId] };
      
      // 成功增加经验 (每分钟 1 点经验，至少 5 点)
      const expGain = Math.max(5, focusMinutes);
      // 如果饱食度高（>70），获得经验加成 1.2倍
      const multiplier = currentStats.hunger > 70 ? 1.2 : 1.0;
      currentStats.exp += Math.floor(expGain * multiplier);
      
      // 升级判定
      while (currentStats.level < MAX_LEVEL && currentStats.exp >= LEVEL_EXP_REQUIREMENTS[currentStats.level]) {
        currentStats.level += 1;
      }
      
      // 恢复饥饿度 (每分钟专注恢复 1 点饥饿度)
      currentStats.hunger = Math.min(100, currentStats.hunger + focusMinutes);
      currentStats.lastActiveTime = Date.now();
      
      petStats[activePetId] = currentStats;

      return {
        status: 'success',
        successCount: state.successCount + 1,
        weeklyTimeMinutes: state.weeklyTimeMinutes + focusMinutes,
        forest: [...state.forest, newTree],
        timeLeft: 0,
        showWarning: false,
        petStats
      };
    });

    get().saveStats();
  },

  tick: () => {
    const state = get();
    
    if (state.status === 'preparing') {
      if (state.timeLeft > 1) {
        set({ timeLeft: state.timeLeft - 1 });
      } else {
        set({ status: 'focusing', timeLeft: state.totalDuration });
      }
    } else if (state.status === 'focusing') {
      if (state.timeLeft > 1) {
        set({ timeLeft: state.timeLeft - 1 });
      } else {
        get().completeFocus();
      }
    }
  },

  reset: () => {
    set({ status: 'idle', timeLeft: 0, showWarning: false });
  },

  setVolume: (v: number) => {
    set({ volume: v });
  },

  toggleMute: () => {
    set((state) => ({ isMuted: !state.isMuted }));
  }
}));
