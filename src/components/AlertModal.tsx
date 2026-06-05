import { useFocusStore } from '../store/useFocusStore';
import { AlertCircle, Award } from 'lucide-react';
import { useMemo } from 'react';

const ENCOURAGEMENT_MESSAGES = [
  "太棒了！每一次专注，都是向更好的自己迈进。",
  "恭喜完成！你的坚持正在闪闪发光。",
  "了不起的专注力！离梦想又近了一步。",
  "干得漂亮！休息一下，给大脑充个电吧。",
  "专注的你充满魅力，继续保持哦！",
  "优秀的自控力！种下的小树正在茁壮成长。",
  "又战胜了自己一次！为你感到骄傲。"
];

export function AlertModal() {
  const { status, reset } = useFocusStore();

  const randomMessage = useMemo(() => {
    if (status === 'success') {
      return ENCOURAGEMENT_MESSAGES[Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)];
    }
    return "";
  }, [status]);

  if (status !== 'failed' && status !== 'success') return null;

  if (status === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#a3b18a]/60 backdrop-blur-md animate-in fade-in duration-300">
        <div className="w-full max-w-sm bg-[#f0f4eb] rounded-[2rem] p-8 shadow-2xl border-4 border-[#a3b18a] animate-in zoom-in-90 slide-in-from-bottom-10 duration-500 flex flex-col items-center">
          <div className="w-20 h-20 bg-[#a3b18a]/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <Award size={40} className="text-[#a3b18a]" />
          </div>
          
          <h2 className="text-[28px] font-black text-[#5c4332] mb-3 text-center tracking-wider">
            专注完成！
          </h2>
          <p className="text-[#8c7362] text-[15px] mb-8 font-medium text-center leading-relaxed">
            {randomMessage}
          </p>

          <button 
            onClick={reset}
            className="w-full py-4 bg-[#a3b18a] text-white rounded-2xl font-bold text-[16px] hover:bg-[#8f9d78] transition-colors shadow-lg active:scale-95"
          >
            收下鼓励
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#2a2420]/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-[#fff9f0] rounded-[2rem] p-8 shadow-[0_16px_40px_rgba(0,0,0,0.3)] border-4 border-[#e8dcc4] animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 flex flex-col items-center">
        <div className="w-20 h-20 bg-[#e29578]/10 rounded-full flex items-center justify-center mb-6 animate-pulse border border-[#e29578]/20 shadow-inner">
          <AlertCircle size={40} className="text-[#e29578]" />
        </div>
        
        <h2 className="text-[28px] font-black text-[#5c4332] mb-4 text-center tracking-wider">
          抓到你了！
        </h2>
        <p className="text-[#8c7362] text-[15px] mb-8 font-medium text-center">
          摸鱼达人，本次专注已破戒。
        </p>

        <button 
          onClick={reset}
          className="w-full py-4 bg-[#e29578] text-white rounded-[1.25rem] font-bold text-[16px] hover:bg-[#d48265] transition-colors shadow-[0_4px_12px_rgba(226,149,120,0.4)] active:scale-95"
        >
          承认错误并重置
        </button>
      </div>
    </div>
  );
}
