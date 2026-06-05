import { useState } from 'react';
import { useFocusStore } from '../store/useFocusStore';
import { ShieldAlert, Sparkles, Heart, ChevronRight, Check, Leaf } from 'lucide-react';

const WELCOME_STEPS = [
  {
    icon: Leaf,
    title: '欢迎来到',
    subtitle: '专注工作台',
    description: '一款硬核的自律专注应用。通过手机陀螺仪实现物理防摸鱼，内置 6 款动态白噪音场景与宠物养成系统，用详尽的数据记录你的每一次成长。',
    color: '#84a98c'
  },
  {
    icon: Sparkles,
    title: '赛博禅修',
    subtitle: '自定义你的沉浸空间',
    description: '逃离数字喧嚣，选择喜欢的 Lofi 白噪音与治愈场景，打造属于你自己的沉浸式专注空间。',
    color: '#d4a373'
  },
  {
    icon: ShieldAlert,
    title: '物理结界',
    subtitle: '拒绝摸鱼，放下手机',
    description: '通过读取手机陀螺仪，当你拿起手机时会触发「破戒警告」。放下手机，才能真正专注于眼前的任务。',
    color: '#e29578'
  },
  {
    icon: Heart,
    title: '电子盆栽',
    subtitle: '陪伴你的每一次成长',
    description: '你的每一次专注，都会化作经验值和饱食度，喂养你的专属宠物。和它一起升级，解锁更多亲密互动吧！',
    color: '#a3b18a'
  }
];

export function WelcomeScreen() {
  const { completeWelcome } = useFocusStore();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < WELCOME_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeWelcome();
    }
  };

  const step = WELCOME_STEPS[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#2a2420]/90 backdrop-blur-xl">
      <div className="w-full max-w-sm bg-[#fff9f0] rounded-[2.5rem] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.4)] border-4 border-[#e8dcc4] flex flex-col items-center animate-in zoom-in-95 fade-in duration-500 overflow-hidden relative">
        
        {/* 背景装饰光晕 */}
        <div 
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-[60px] opacity-20 transition-colors duration-700"
          style={{ backgroundColor: step.color }}
        />

        {/* 进度指示器 */}
        <div className="flex gap-2 mb-10 mt-2 z-10">
          {WELCOME_STEPS.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentStep ? 'w-8 bg-[#5c4332]' : 'w-2 bg-[#5c4332]/20'
              }`} 
            />
          ))}
        </div>

        {/* 图标 */}
        <div 
          key={`icon-${currentStep}`}
          className="w-24 h-24 rounded-full flex items-center justify-center mb-8 shadow-inner animate-in zoom-in-50 duration-500 z-10"
          style={{ backgroundColor: `${step.color}20`, border: `2px solid ${step.color}40` }}
        >
          <Icon size={48} color={step.color} strokeWidth={1.5} />
        </div>

        {/* 文字内容 */}
        <div key={`text-${currentStep}`} className="text-center z-10 animate-in slide-in-from-right-8 fade-in duration-500 w-full min-h-[160px]">
          <h2 className="text-[28px] font-black text-[#5c4332] mb-2 tracking-wide">
            {step.title}
          </h2>
          <h3 className="text-[16px] font-bold text-[#8c7362] mb-4">
            {step.subtitle}
          </h3>
          <p className="text-[15px] text-[#8c7362]/90 leading-relaxed font-medium px-2">
            {step.description}
          </p>
        </div>

        {/* 按钮 */}
        <button 
          onClick={handleNext}
          className="w-full mt-6 py-4 rounded-[1.5rem] text-white font-bold text-[18px] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 z-10 relative overflow-hidden group"
          style={{ backgroundColor: step.color }}
        >
          <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative z-10 flex items-center gap-2">
            {currentStep === WELCOME_STEPS.length - 1 ? (
              <>开启禅修 <Check size={20} strokeWidth={3} /></>
            ) : (
              <>下一步 <ChevronRight size={20} strokeWidth={3} /></>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
