import { useState, useRef, useEffect } from 'react';
import { Search, Volume2, Play, Pause } from 'lucide-react';
import { useFocusStore } from '../store/useFocusStore';

interface MediaControlsProps {
  onImageChange: (url: string) => void;
}

export function MediaControls({ onImageChange }: MediaControlsProps) {
  const [keyword, setKeyword] = useState('');
  const [localVolume, setLocalVolume] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { volume: globalVolume, status } = useFocusStore();
  const isFocusing = status === 'focusing';

  const AUDIO_MAP: Record<string, string> = {
    rain: 'https://cdn.freesound.org/previews/531/531947_10807844-lq.mp3',
    fire: 'https://cdn.freesound.org/previews/339/339326_527080-lq.mp3',
    cafe: 'https://cdn.freesound.org/previews/608/608381_1648170-lq.mp3',
    ocean: 'https://cdn.freesound.org/previews/400/400402_5121236-lq.mp3',
    wind: 'https://cdn.freesound.org/previews/178/178783_1111625-lq.mp3',
    night: 'https://cdn.freesound.org/previews/437/437337_8880464-lq.mp3',
    bird: 'https://cdn.freesound.org/previews/416/416529_5121236-lq.mp3',
    cat: 'https://cdn.freesound.org/previews/118/118558_2080036-lq.mp3',
    default: 'https://cdn.freesound.org/previews/531/531947_10807844-lq.mp3',
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!keyword.trim()) return;

    // 1. 获取高质量壁纸 (使用 Pollinations AI 接口，无需 Key，即时生成/拉取)
    const prompt = encodeURIComponent(`${keyword} aesthetic minimalist dark wallpaper`);
    const imageUrl = `https://image.pollinations.ai/prompt/${prompt}?width=1080&height=1920&nologo=true`;
    onImageChange(imageUrl);

    // 2. 匹配音频
    const searchKey = keyword.toLowerCase();
    const audioKey = Object.keys(AUDIO_MAP).find(k => searchKey.includes(k)) || 'default';
    
    if (audioRef.current) {
      audioRef.current.src = AUDIO_MAP[audioKey];
      // 搜索后自动试听
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.error("Audio play blocked by browser", err));
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.error("Audio play blocked by browser", err));
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = localVolume * globalVolume;
    }
  }, [localVolume, globalVolume]);

  // 专注状态变化时自动控制音频
  useEffect(() => {
    if (audioRef.current) {
      if (isFocusing) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log(e));
      }
    }
  }, [isFocusing]);

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col gap-6">
      <form onSubmit={handleSearch} className="relative flex items-center">
        <input 
          type="text"
          placeholder="搜索声音与壁纸 (如: rain, fire)..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full bg-black/20 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
        />
        <button 
          type="submit" 
          className="absolute right-2 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors cursor-pointer z-10"
        >
          <Search size={16} className="text-white/80" />
        </button>
      </form>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer"
          >
            {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white ml-1" />}
          </button>
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-white/70">环境音量</span>
              <Volume2 size={14} className="text-white/40" />
            </div>
            <input 
              type="range" 
              min="0" max="1" step="0.01"
              value={localVolume}
              onChange={(e) => setLocalVolume(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
            />
          </div>
        </div>
      </div>

      <audio ref={audioRef} loop src={AUDIO_MAP.default} />
    </div>
  );
}
