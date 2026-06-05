import { useEffect, useRef, useState } from 'react';
import { useFocusStore, getCurrentTimePeriod } from './store/useFocusStore';
import { useFocusGuardian } from './hooks/useFocusGuardian';
import { FocusTimer } from './components/FocusTimer';
import { SetupScreen } from './components/SetupScreen';
import { StatisticsScreen } from './components/StatisticsScreen';
import { AlertModal } from './components/AlertModal';
import { PetCompanion } from './components/PetCompanion';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Smartphone, Home, BarChart2, Sunrise, Sun, Sunset, Moon, BookOpen } from 'lucide-react';

function App() {
  const { status, activeTheme, currentTab, setCurrentTab, loadStats, showWarning, hasSeenWelcome, isMuted, showWelcome } = useFocusStore();
  const { isFlat, angles } = useFocusGuardian();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [timePeriod, setTimePeriod] = useState(getCurrentTimePeriod());

  useEffect(() => {
    loadStats();
    // Update time period every minute
    const interval = setInterval(() => {
      setTimePeriod(getCurrentTimePeriod());
    }, 60000);
    return () => clearInterval(interval);
  }, [loadStats]);

  useEffect(() => {
    if (audioRef.current) {
      // 如果静音状态被开启，直接暂停
      if (isMuted) {
        audioRef.current.pause();
        return;
      }
      
      if (status === 'focusing') {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => console.log("Audio play prevented:", e));
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [status, activeTheme.audioUrl, isMuted]);

  const isIdle = status === 'idle' || status === 'failed' || status === 'success';
  const petMood = showWarning ? 'warning' : status === 'paused' ? 'pause' : status === 'focusing' ? 'focus' : 'idle';

  const timeGreetings = {
    morning: '早上好，新的一天充满希望',
    afternoon: '下午好，保持专注与活力',
    evening: '傍晚好，享受宁静的时光',
    night: '夜深了，让心灵沉淀下来'
  };

  const bgColors = {
    morning: 'bg-[#fdf8f5]',
    afternoon: 'bg-[#f5f1e7]',
    evening: 'bg-[#f0ece1]',
    night: 'bg-[#f0ece1]'
  };

  const textColors = {
    morning: 'text-[#5c4332]',
    afternoon: 'text-[#5c4332]',
    evening: 'text-[#5c4332]',
    night: 'text-[#5c4332]'
  };

  return (
    <div className={`relative min-h-screen w-full overflow-x-hidden ${bgColors[timePeriod]} ${textColors[timePeriod]} transition-colors duration-1000`}>
      
      <audio id="global-audio" ref={audioRef} loop src={activeTheme.audioUrl} />

      <div 
        className={`fixed inset-0 z-0 transition-opacity duration-1000 ${isIdle ? 'opacity-0' : 'opacity-100'}`}
        style={{
          backgroundImage: `url('${activeTheme.bgUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className={`fixed inset-0 z-0 transition-opacity duration-1000 ${isIdle ? 'opacity-0 pointer-events-none' : 'opacity-100 bg-black/40'}`} />

      {/* 首次访问欢迎页拦截 */}
      {!hasSeenWelcome && <WelcomeScreen />}

      <div className="relative z-10 w-full min-h-screen">
        <div className="flex flex-col h-full w-full max-w-md mx-auto p-6 pb-32">
          
          {isIdle ? (
            currentTab === 'home' ? (
              <div className="flex flex-col gap-6 pt-6 animate-in fade-in slide-in-from-left-4 duration-500">
                <header className="text-center space-y-2 mb-2 relative">
                  <div className="flex items-center justify-center relative w-full">
                    <h1 className="text-[28px] font-black tracking-tight text-[#5c4332] drop-shadow-sm">专注工作台</h1>
                    <button 
                      onClick={showWelcome}
                      className={`absolute right-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[14px] font-bold transition-all duration-300 border shadow-sm active:scale-95 text-[#d4a373] bg-white/80 border-white hover:bg-white hover:shadow-md`}
                    >
                      <BookOpen size={16} />
                      <span>教程</span>
                    </button>
                  </div>
                  <div className={`flex items-center justify-center gap-1.5 text-[14px] font-bold text-[#8c7362]`}>
                    {timePeriod === 'morning' && <Sunrise size={18} className="text-orange-400" />}
                    {timePeriod === 'afternoon' && <Sun size={18} className="text-amber-500" />}
                    {timePeriod === 'evening' && <Sunset size={18} className="text-orange-500" />}
                    {timePeriod === 'night' && <Moon size={18} className="text-indigo-400" />}
                    <span className="tracking-wide">{timeGreetings[timePeriod]}</span>
                  </div>
                </header>

                <div className={`flex flex-col items-center justify-center p-4 rounded-[1.5rem] border transition-all duration-1000 bg-white/70 backdrop-blur-xl border-white/60 shadow-[0_8px_32px_rgba(140,115,98,0.08)]`}>
                  <div className="flex items-center gap-3 w-full justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-[1rem] transition-colors duration-500 shadow-inner ${isFlat ? 'bg-green-100/50 text-green-600' : 'bg-[#fff9f0] text-[#d4a373]'}`}>
                        <Smartphone size={24} className={`transition-transform duration-500 ${isFlat ? 'rotate-0' : 'rotate-12'}`} />
                      </div>
                      <p className="text-[15px] font-bold tracking-wide">
                        {isFlat ? '传感器就绪，可开始' : '请将手机水平放置'}
                      </p>
                    </div>
                    <div className={`flex flex-col gap-0.5 text-[11px] font-mono px-3 py-1.5 rounded-xl transition-colors duration-1000 font-bold tracking-widest text-right bg-[#fff9f0] text-[#8c7362] shadow-inner`}>
                      <span>B: {angles.beta}°</span>
                      <span>G: {angles.gamma}°</span>
                    </div>
                  </div>
                </div>

                <SetupScreen />
              </div>
            ) : (
              <StatisticsScreen />
            )
          ) : (
            <div className="fixed inset-0 z-50 flex flex-col justify-between p-6 overflow-hidden">
              <FocusTimer />
              
              <div className="absolute bottom-0 left-0 right-0 pb-6 pointer-events-auto">
                <PetCompanion mood={petMood} compact={false} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部导航栏 (iOS 悬浮胶囊风格) */}
      {isIdle && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-[320px] h-16 bg-white/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(140,115,98,0.15)] rounded-[2rem] border border-white/60 z-40 flex items-center justify-center animate-in slide-in-from-bottom-10 duration-500">
          <div className="w-full flex justify-around items-center px-4">
            <button 
              onClick={() => setCurrentTab('home')}
              className={`flex flex-col items-center gap-1 w-20 py-2 rounded-2xl transition-all duration-300 ${currentTab === 'home' ? 'text-[#d4a373] bg-[#d4a373]/10 scale-105' : 'text-[#8c7362] hover:text-[#5c4332] hover:bg-black/5'}`}
            >
              <Home size={22} className={currentTab === 'home' ? 'fill-current' : ''} />
              <span className="text-[12px] font-bold">主页</span>
            </button>
            <button 
              onClick={() => setCurrentTab('stats')}
              className={`flex flex-col items-center gap-1 w-20 py-2 rounded-2xl transition-all duration-300 ${currentTab === 'stats' ? 'text-[#d4a373] bg-[#d4a373]/10 scale-105' : 'text-[#8c7362] hover:text-[#5c4332] hover:bg-black/5'}`}
            >
              <BarChart2 size={22} strokeWidth={currentTab === 'stats' ? 3 : 2} />
              <span className="text-[12px] font-bold">统计</span>
            </button>
          </div>
        </div>
      )}

      <AlertModal />
    </div>
  );
}

export default App;
