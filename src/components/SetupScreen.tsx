import { useState } from 'react';
import { BUILT_IN_PETS, BUILT_IN_THEMES, PetId, useFocusStore, FocusTag, LEVEL_EXP_REQUIREMENTS } from '../store/useFocusStore';
import { Clock, Check, Briefcase, BookOpen, Book, Flower2, MoreHorizontal, Tag, Star, ShieldAlert } from 'lucide-react';
import { PetAvatar } from './PetAvatar';

export function SetupScreen() {
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const { activeTheme, setTheme, startFocus, activePetId, setActivePetId, currentTag, setCurrentTag, petStats, customTags, addCustomTag, hasGrantedPermission, grantPermission } = useFocusStore();

  const DURATION_OPTIONS = [10, 25, 45, 60];
  
  const DEFAULT_TAG_OPTIONS: { id: string; label: string; icon: any }[] = [
    { id: 'work', label: '工作', icon: Briefcase },
    { id: 'study', label: '学习', icon: BookOpen },
    { id: 'reading', label: '阅读', icon: Book },
    { id: 'meditation', label: '冥想', icon: Flower2 },
  ];

  const ALL_TAGS = [
    ...DEFAULT_TAG_OPTIONS,
    ...(customTags || []).map(tag => ({ id: tag, label: tag, icon: Tag }))
  ];

  const handleStartClick = () => {
    // 先尝试解锁音频（iOS 必须在纯净的 Click 事件中同步调用 play()）
    const audio = document.getElementById('global-audio') as HTMLAudioElement;
    if (audio) {
      audio.volume = 0.5;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => console.log('Initial audio unlock failed', e));
      }
    }

    // 检查是否在 iOS Safari 中且可能需要权限
    if (!hasGrantedPermission && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      // 显示自定义的漂亮弹窗
      setShowPermissionModal(true);
    } else {
      // 否则直接开始
      proceedToStart();
    }
  };

  const handlePermissionGrant = async () => {
    setShowPermissionModal(false);
    
    // 再次尝试解锁音频
    const audio = document.getElementById('global-audio') as HTMLAudioElement;
    if (audio) {
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Audio unlock failed', e));
    }
    
    // 1. 请求传感器权限
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          grantPermission();
        }
      } catch (error) {
        console.error('Permission error', error);
      }
    }
    
    proceedToStart();
  };

  const proceedToStart = () => {
    if (currentTag && !ALL_TAGS.some(t => t.id === currentTag)) {
      addCustomTag(currentTag);
    }
    const safeMinutes = Math.min(180, Math.max(1, Number.isFinite(selectedMinutes) ? selectedMinutes : 25));
    startFocus(safeMinutes);
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      
      {/* 专注标签 */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-[0_8px_24px_rgba(140,115,98,0.06)]">
        <h3 className="text-[16px] font-black text-[#5c4332] mb-4 flex items-center gap-1.5 tracking-wide">
          <Tag size={18} className="text-[#d4a373]" />
          专注目标
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {ALL_TAGS.map(tag => {
            const Icon = tag.icon;
            const isActive = currentTag === tag.id;
            return (
              <button
                key={tag.id}
                onClick={() => setCurrentTag(tag.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#d4a373] text-white shadow-[0_4px_12px_rgba(212,163,115,0.4)] scale-105' 
                    : 'bg-white/80 text-[#8c7362] border border-white hover:bg-white hover:shadow-sm'
                }`}
              >
                <Icon size={16} />
                <span className="text-[14px]">{tag.label}</span>
              </button>
            );
          })}
        </div>
        
        {/* 自定义专注目标 */}
        <div className="mt-4 flex items-center gap-3 bg-white/50 p-1.5 rounded-xl border border-white/60">
          <span className="text-[14px] text-[#8c7362] font-bold pl-3 whitespace-nowrap">自定义 (目标)</span>
          <input 
            type="text" 
            placeholder="输入你想专注的事情..."
            value={ALL_TAGS.some(t => t.id === currentTag) ? '' : currentTag}
            onChange={(e) => {
              const value = e.target.value;
              setCurrentTag(value || 'work');
            }}
            className="flex-1 bg-white border border-white/80 rounded-lg px-4 py-2 text-[#5c4332] font-bold text-[15px] shadow-inner focus:outline-none focus:border-[#d4a373] focus:ring-2 focus:ring-[#d4a373]/20 transition-all text-left w-full min-w-0"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* 时长选择 */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-[0_8px_24px_rgba(140,115,98,0.06)]">
          <h3 className="text-[16px] font-black text-[#5c4332] mb-4 flex items-center gap-1.5 tracking-wide">
            <Clock size={18} className="text-[#d4a373]" />
            专注时长
          </h3>
          
          <div className="grid grid-cols-4 gap-3">
            {DURATION_OPTIONS.map(mins => (
              <button
                key={mins}
                onClick={() => setSelectedMinutes(mins)}
                className={`py-3 rounded-xl font-bold text-[15px] transition-all duration-300 ${
                  selectedMinutes === mins 
                    ? 'bg-[#d4a373] text-white shadow-[0_4px_12px_rgba(212,163,115,0.4)] scale-105' 
                    : 'bg-white/80 text-[#8c7362] border border-white hover:bg-white hover:shadow-sm'
                }`}
              >
                {mins}
              </button>
            ))}
          </div>
          
          {/* 自定义时长 */}
          <div className="mt-4 flex items-center gap-3 bg-white/50 p-1.5 rounded-xl border border-white/60">
            <span className="text-[14px] text-[#8c7362] font-bold pl-3 whitespace-nowrap">自定义 (分)</span>
            <input 
              type="number" 
              min="1" max="180"
              value={selectedMinutes === 0 ? '' : selectedMinutes}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setSelectedMinutes(0); // 允许清空
                } else {
                  setSelectedMinutes(Number(value));
                }
              }}
              className="flex-1 bg-white border border-white/80 rounded-lg px-4 py-2 text-[#5c4332] font-bold text-[15px] shadow-inner focus:outline-none focus:border-[#d4a373] focus:ring-2 focus:ring-[#d4a373]/20 transition-all text-center w-full min-w-0"
            />
          </div>
        </div>

        {/* 场景选择 */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-[0_8px_24px_rgba(140,115,98,0.06)]">
          <h3 className="text-[16px] font-black text-[#5c4332] mb-4 tracking-wide">场景选择</h3>
          <div className="grid grid-cols-3 gap-4">
            {BUILT_IN_THEMES.map(theme => {
              const isActive = activeTheme.id === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => setTheme(theme)}
                  className={`relative flex flex-col items-center gap-2 group`}
                >
                  <div className={`w-full aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    isActive ? 'border-[#d4a373] shadow-[0_8px_16px_rgba(212,163,115,0.3)] scale-105' : 'border-transparent group-hover:scale-105 shadow-sm'
                  }`}>
                    <img src={theme.bgUrl} alt={theme.name} className="w-full h-full object-cover" />
                    {isActive && (
                      <div className="absolute top-1 right-1 bg-[#d4a373] text-white rounded-full p-0.5 shadow-sm">
                        <Check size={12} strokeWidth={4} />
                      </div>
                    )}
                  </div>
                  <span className={`text-[13px] font-bold tracking-wide ${isActive ? 'text-[#5c4332]' : 'text-[#8c7362]'}`}>
                    {theme.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 宠物伙伴 */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-[0_8px_24px_rgba(140,115,98,0.06)]">
        <h3 className="text-[16px] font-black text-[#5c4332] mb-4 tracking-wide">宠物伙伴</h3>
        <div className="grid grid-cols-5 gap-3">
          {BUILT_IN_PETS.map((pet) => {
            const isActive = activePetId === pet.id;
            const stats = petStats[pet.id] || { level: 1, exp: 0, hunger: 100, lastActiveTime: Date.now() };
            const currentLevelExp = LEVEL_EXP_REQUIREMENTS[stats.level - 1] || 0;
            const nextLevelExp = LEVEL_EXP_REQUIREMENTS[stats.level] || currentLevelExp + 100;
            const expPercent = Math.min(100, Math.max(0, ((stats.exp - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100));

            return (
              <button
                key={pet.id}
                onClick={() => setActivePetId(pet.id as PetId)}
                className={`relative rounded-xl bg-white border transition-all active:scale-95 flex flex-col items-center justify-between py-3 overflow-hidden ${
                  isActive ? 'border-[#d4a373] shadow-md' : 'border-[#e8dcc4] hover:shadow-sm'
                }`}
              >
                {/* 经验进度条背景 */}
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-[#d4a373]/20 transition-all duration-1000"
                  style={{ height: `${expPercent}%` }}
                />
                
                <div className="relative z-10 flex flex-col items-center">
                  <PetAvatar petId={pet.id} mood="idle" size={36} />
                  <span className={`mt-1 text-[11px] font-bold ${isActive ? 'text-[#5c4332]' : 'text-[#8c7362]'}`}>
                    {pet.name}
                  </span>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <Star size={8} className="text-[#d4a373] fill-[#d4a373]" />
                    <span className="text-[10px] font-bold text-[#8c7362] leading-none">Lv.{stats.level}</span>
                  </div>
                </div>
                {isActive && (
                  <div className="absolute top-0.5 right-0.5 bg-[#d4a373] text-white rounded-full p-0.5 shadow-sm z-20 scale-75">
                    <Check size={12} strokeWidth={4} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 开始按钮 */}
      <button 
        onClick={handleStartClick}
        className="w-full py-4 rounded-[1.5rem] bg-[#5c4332] text-white font-bold text-lg shadow-xl hover:bg-[#4a3528] hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        进入专注模式
      </button>

      {/* 自定义权限弹窗 */}
      {showPermissionModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#2a2420]/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-[#fff9f0] rounded-[2rem] p-8 shadow-[0_16px_40px_rgba(0,0,0,0.3)] border-4 border-[#e8dcc4] animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 flex flex-col items-center">
            <div className="w-20 h-20 bg-[#d4a373]/10 rounded-full flex items-center justify-center mb-6 border border-[#d4a373]/20 shadow-inner">
              <ShieldAlert size={40} className="text-[#d4a373]" />
            </div>
            
            <h2 className="text-[24px] font-black text-[#5c4332] mb-4 text-center tracking-wide">
              需要传感器权限
            </h2>
            <p className="text-[#8c7362] text-[15px] mb-8 font-medium text-center leading-relaxed">
              我们需要访问您的设备方向传感器，以检测手机是否平放，从而守护您的专注时光。
              <br /><br />
              <span className="text-[12px] opacity-80 text-[#d4a373] bg-[#d4a373]/10 px-3 py-1 rounded-full">点击下方按钮后，请在系统弹窗中选择“允许”</span>
            </p>

            <div className="flex flex-col gap-3 w-full">
              <button 
                onClick={handlePermissionGrant}
                className="w-full py-4 bg-[#d4a373] text-white rounded-[1.25rem] font-bold text-[16px] hover:bg-[#c29161] transition-colors shadow-[0_4px_12px_rgba(212,163,115,0.4)] active:scale-95"
              >
                授权并开始
              </button>
              <button 
                onClick={() => setShowPermissionModal(false)}
                className="w-full py-4 bg-transparent text-[#8c7362] font-bold text-[16px] hover:bg-black/5 rounded-[1.25rem] transition-colors active:scale-95"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
