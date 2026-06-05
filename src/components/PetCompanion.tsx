import { useMemo, useState, useEffect, useRef } from 'react';
import { BUILT_IN_PETS, PetId, useFocusStore, LEVEL_EXP_REQUIREMENTS, MAX_LEVEL } from '../store/useFocusStore';
import { PetAvatar, PetMood } from './PetAvatar';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Drumstick, Star } from 'lucide-react';

const POKE_MESSAGES = [
  '加油加油！',
  '别走神哦~',
  '我在监督你！',
  '再坚持一下！',
  '不要摸鱼啦！',
  '认真最帅/美！',
  '（蹭蹭）',
  '专心致志！'
];

const HIGH_INTIMACY_MESSAGES = [
  '最喜欢主人啦！',
  '（打滚）要抱抱~',
  '永远陪伴你！',
  '主人的专注最棒了！',
  '（贴贴）'
];

function getPetName(petId: PetId) {
  return BUILT_IN_PETS.find((p) => p.id === petId)?.name ?? '小伙伴';
}

function getIntimacyTitle(level: number) {
  if (level === 1) return '初来乍到';
  if (level === 2) return '渐渐熟悉';
  if (level === 3) return '形影不离';
  if (level === 4) return '心有灵犀';
  if (level === 5) return '灵魂伴侣';
  if (level === 6) return '前世之缘';
  return '至高羁绊';
}

// 粒子组件
const Particles = ({ level }: { level: number }) => {
  if (level < 3) return null; // 3级以上才显示粒子
  
  const particleCount = Math.min(level * 2, 10); // 根据等级增加粒子数量
  
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {Array.from({ length: particleCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2"
          initial={{ 
            opacity: 0, 
            scale: 0,
            x: 0,
            y: 0
          }}
          animate={{ 
            opacity: [0, 0.8, 0],
            scale: [0, Math.random() * 0.5 + 0.5, 0],
            x: (Math.random() - 0.5) * 150,
            y: (Math.random() - 0.5) * -150 - 50,
          }}
          transition={{
            duration: Math.random() * 2 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        >
          <Heart size={14} className="text-[#e29578] fill-[#e29578]" />
        </motion.div>
      ))}
    </div>
  );
};

export function PetCompanion({ mood, compact }: { mood: PetMood; compact?: boolean }) {
  const { activePetId, petStats } = useFocusStore();
  const currentStats = petStats[activePetId] || { level: 1, exp: 0, hunger: 100, lastActiveTime: Date.now() };
  
  const name = useMemo(() => getPetName(activePetId), [activePetId]);
  const title = useMemo(() => getIntimacyTitle(currentStats.level), [currentStats.level]);
  
  const [pokeMsg, setPokeMsg] = useState<string | null>(null);
  const [isBouncing, setIsBouncing] = useState(false);
  
  // 重置状态当 mood 发生改变时
  useEffect(() => {
    setPokeMsg(null);
  }, [mood]);

  const handlePoke = () => {
    if (mood === 'warning') return; // 警告状态下不可互动
    if (compact) return; // 首页小图标不可互动
    
    // 如果非常饥饿，改变提示
    if (currentStats.hunger < 20) {
      setPokeMsg('好饿哦...需要专注来补充体力');
      setIsBouncing(true);
    } else {
      const messages = currentStats.level >= 3 ? [...POKE_MESSAGES, ...HIGH_INTIMACY_MESSAGES] : POKE_MESSAGES;
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setPokeMsg(randomMsg);
      setIsBouncing(true);
    }
    
    // 弹跳动画恢复
    setTimeout(() => setIsBouncing(false), 500);
    // 气泡文字恢复
    setTimeout(() => setPokeMsg(null), 3000);
  };

  const defaultBubble =
    mood === 'warning'
      ? '放回桌面啦…'
      : mood === 'pause'
        ? '休息一下也没关系'
        : mood === 'focus'
          ? '我在陪你专注'
          : currentStats.hunger < 20
            ? '好饿...'
            : '准备开始咯';
          
  const bubble = pokeMsg || defaultBubble;
  
  // 决定当前动画状态
  const animState = isBouncing ? 'poked' : (mood === 'warning' ? 'warning' : 'idle');

  const petVariants = {
    idle: {
      y: [0, -2, 0],
      scaleY: [1, 0.98, 1],
      scaleX: [1, 1.01, 1],
      rotate: 0,
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    },
    poked: {
      y: [0, -25, 0],
      rotate: [0, -8, 8, -5, 5, 0],
      scaleY: [1, 1.05, 1],
      scaleX: [1, 0.95, 1],
      transition: { duration: 0.5, ease: "easeOut" }
    },
    warning: {
      x: [-2, 2, -2, 2, 0],
      rotate: [-1, 1, -1, 1, 0],
      transition: { duration: 0.4, repeat: Infinity }
    }
  };

  return (
    <div className={`w-full flex items-end justify-center ${compact ? 'gap-3' : 'gap-4'} select-none relative`}>
      <Particles level={currentStats.level} />
      <motion.div 
        className={`relative mt-8 z-10 ${!compact ? 'cursor-grab active:cursor-grabbing origin-bottom' : 'origin-bottom'}`}
        drag={!compact}
        dragConstraints={{ left: -150, right: 150, top: -200, bottom: 50 }}
        dragElastic={0.2}
        whileDrag={{ scale: 1.15, rotate: 8, cursor: "grabbing" }}
        whileTap={!compact ? { scale: 0.9 } : {}}
        onTap={handlePoke}
        variants={!compact ? (petVariants as any) : undefined}
        animate={!compact ? animState : undefined}
      >
        <PetAvatar petId={activePetId} mood={mood} size={compact ? 120 : 180} />
        <div
          className={`absolute -top-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-[#e8dcc4] shadow-md text-[#5c4332] text-sm font-bold whitespace-nowrap transition-all ${
            compact ? 'scale-90' : ''
          } ${pokeMsg ? 'scale-110 text-[#e29578]' : ''}`}
        >
          {bubble}
        </div>
      </motion.div>
      {!compact && (
        <div className="absolute bottom-[-10px] flex flex-col items-center gap-1 pointer-events-none z-20">
          <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30 shadow-sm">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-[#d4a373] fill-[#d4a373]" />
              <span className="text-[12px] font-bold text-[#5c4332]">Lv.{currentStats.level}</span>
            </div>
            <div className="w-[1px] h-3 bg-[#8c7362]/30" />
            <div className="flex items-center gap-1">
              <Drumstick size={12} className={`${currentStats.hunger > 50 ? 'text-[#e29578]' : 'text-gray-400'}`} />
              <span className="text-[12px] font-bold text-[#5c4332]">{currentStats.hunger}</span>
            </div>
          </div>
          <div className="text-[12px] font-bold text-white/90 drop-shadow-md">
            {title} · {name}
          </div>
        </div>
      )}
    </div>
  );
}

