import { useState, useEffect } from 'react';
import { useFocusStore } from '../store/useFocusStore';
import { Square, Pause, Play, AlertTriangle, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ZEN_QUOTES = [
  "万物皆有定时，慢慢来，比较快。",
  "心若不息，风也无处起。",
  "专注当下，每一秒都是新生。",
  "不畏将来，不念过往，人间有味是清欢。",
  "静水流深，潜心做自己。",
  "放下杂念，世界便会为你让路。",
  "每一次深呼吸，都是一次重启。"
];

export function FocusTimer() {
  const { status, timeLeft, pauseFocus, resumeFocus, exitFocus, showWarning, warningCountdown, isMuted, toggleMute } = useFocusStore();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    if (status !== 'focusing') return;
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % ZEN_QUOTES.length);
    }, 15000); // 每 15 秒切换一次语录
    return () => clearInterval(timer);
  }, [status]);

  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;

  if (status === 'preparing') {
    return (
      <div className="flex flex-col items-center justify-start pt-[15vh] w-full animate-in zoom-in-95 duration-500 relative">
        <div className="bg-[#fff9f0]/90 backdrop-blur-xl rounded-[3rem] px-10 py-12 shadow-2xl text-center border-4 border-[#e8dcc4]">
          <h2 className="text-3xl font-bold text-[#5c4332] mb-6">即将开始</h2>
          <p className="text-[#8c7362] mb-8 font-medium">请将手机平放于桌面...</p>
          <div className="text-[6rem] font-black text-[#d4a373] tabular-nums leading-none">
            {timeLeft}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-start pt-20 w-full relative">
      
      {/* 退出确认弹窗 */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#2a2420]/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-[#fff9f0] rounded-[2rem] p-8 shadow-[0_16px_40px_rgba(0,0,0,0.3)] border-4 border-[#e8dcc4] animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 flex flex-col items-center">
            <div className="w-20 h-20 bg-[#e29578]/10 rounded-full flex items-center justify-center mb-6 border border-[#e29578]/20 shadow-inner">
              <AlertTriangle size={40} className="text-[#e29578]" />
            </div>
            
            <h2 className="text-[24px] font-black text-[#5c4332] mb-4 text-center tracking-wide">
              确认要放弃吗？
            </h2>
            <p className="text-[#8c7362] text-[15px] mb-8 font-medium text-center leading-relaxed">
              专注正在进行中，现在退出将被记录为<span className="text-[#e29578] font-bold">「破戒」</span>，并会扣除宠物经验值。
            </p>

            <div className="flex flex-col gap-3 w-full">
              <button 
                onClick={() => {
                  setShowExitConfirm(false);
                  exitFocus(); // 此时调用会触发 failFocus
                }}
                className="w-full py-4 bg-[#e29578] text-white rounded-[1.25rem] font-bold text-[16px] hover:bg-[#d48265] transition-colors shadow-[0_4px_12px_rgba(226,149,120,0.4)] active:scale-95"
              >
                确认放弃 (记录破戒)
              </button>
              <button 
                onClick={() => setShowExitConfirm(false)}
                className="w-full py-4 bg-transparent text-[#8c7362] font-bold text-[16px] hover:bg-black/5 rounded-[1.25rem] transition-colors active:scale-95"
              >
                继续专注
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 警告弹窗 */}
      {showWarning && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#5c4332]/80 backdrop-blur-md animate-in fade-in duration-200 p-6">
          <div className="bg-[#fff9f0] rounded-3xl p-8 shadow-2xl border-4 border-[#e29578] animate-in zoom-in-90 slide-in-from-bottom-10 duration-500 flex flex-col items-center">
            <div className="w-20 h-20 bg-[#e29578]/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <AlertTriangle size={40} className="text-[#e29578]" />
            </div>
            <h2 className="text-2xl font-black text-[#5c4332] mb-2 text-center tracking-wider">
              设备已移动！
            </h2>
            <p className="text-[#8c7362] text-base mb-8 font-medium text-center">
              请将手机放回桌面，{Math.max(0, warningCountdown)}秒后将判定为破戒。
            </p>
          </div>
        </div>
      )}

      {/* 顶部声音控制按钮 */}
      <button 
        onClick={toggleMute}
        className="absolute top-0 right-4 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all border border-white/20 shadow-md"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      <div className="text-center mb-4 mt-8">
        <span className="bg-[#5c4332]/80 backdrop-blur-sm text-[#fff9f0] px-4 py-1.5 rounded-full text-sm font-bold tracking-wider">
          距离休息还有
        </span>
      </div>
      
      <div className="flex items-baseline justify-center gap-1 mb-8 drop-shadow-lg">
        <div className="text-[5rem] font-black text-white leading-none tabular-nums tracking-tighter" style={{ textShadow: '2px 4px 12px rgba(0,0,0,0.3)' }}>
          {h}
        </div>
        <div className="text-2xl font-bold text-white mr-2" style={{ textShadow: '1px 2px 8px rgba(0,0,0,0.3)' }}>小时</div>
        
        <div className="text-[5rem] font-black text-white leading-none tabular-nums tracking-tighter" style={{ textShadow: '2px 4px 12px rgba(0,0,0,0.3)' }}>
          {m.toString().padStart(2, '0')}
        </div>
        <div className="text-2xl font-bold text-white mr-2" style={{ textShadow: '1px 2px 8px rgba(0,0,0,0.3)' }}>分</div>
        
        <div className="text-[5rem] font-black text-white leading-none tabular-nums tracking-tighter" style={{ textShadow: '2px 4px 12px rgba(0,0,0,0.3)' }}>
          {s.toString().padStart(2, '0')}
        </div>
        <div className="text-2xl font-bold text-white" style={{ textShadow: '1px 2px 8px rgba(0,0,0,0.3)' }}>秒</div>
      </div>

      {/* 治愈语录 */}
      <div className="h-12 mb-8 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={quoteIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="text-white/90 text-sm font-medium tracking-widest drop-shadow-md text-center px-6"
          >
            {ZEN_QUOTES[quoteIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* 控制按钮 */}
      <div className="flex gap-8">
        <button 
          onClick={() => setShowExitConfirm(true)}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:bg-white/40 transition-all shadow-lg">
            <Square size={24} fill="currentColor" />
          </div>
          <span className="text-white text-sm font-bold drop-shadow-md">退出</span>
        </button>

        {status === 'focusing' ? (
          <button 
            onClick={pauseFocus}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:bg-white/40 transition-all shadow-lg">
              <Pause size={24} fill="currentColor" />
            </div>
            <span className="text-white text-sm font-bold drop-shadow-md">暂停</span>
          </button>
        ) : (
          <button 
            onClick={resumeFocus}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-16 h-16 rounded-full bg-[#d4a373] flex items-center justify-center text-white border border-white/20 group-hover:bg-[#c29161] transition-all shadow-lg animate-pulse">
              <Play size={24} fill="currentColor" className="ml-1" />
            </div>
            <span className="text-white text-sm font-bold drop-shadow-md">继续</span>
          </button>
        )}
      </div>
    </div>
  );
}
