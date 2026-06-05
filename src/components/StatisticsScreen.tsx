import { useFocusStore, FocusTag } from '../store/useFocusStore';
import { TreePine, Briefcase, BookOpen, Book, Flower2, MoreHorizontal, Tag } from 'lucide-react';

// 内置 SVG 图标，彻底解决网络裂图问题
const SuccessIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
    <path d="M20 6L9 17L4 12" stroke="#a3b18a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FailedIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80 drop-shadow-sm">
    <path d="M18 6L6 18" stroke="#e29578" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 6L18 18" stroke="#e29578" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TAG_INFO: Record<string, { label: string; color: string; icon: any }> = {
  work: { label: '工作', color: '#d4a373', icon: Briefcase },
  study: { label: '学习', color: '#a3b18a', icon: BookOpen },
  reading: { label: '阅读', color: '#84a98c', icon: Book },
  meditation: { label: '冥想', color: '#e29578', icon: Flower2 },
};

// 预设一些好看的颜色给自定义标签使用
const CUSTOM_COLORS = ['#9e8189', '#b5a197', '#d5bdaf', '#e3d5ca', '#c1b0b5'];

export function StatisticsScreen() {
  const { successCount, failCount, weeklyTimeMinutes, forest } = useFocusStore();

  // 基于当天日期生成固定的前7天日期数组
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  });

  // 根据 forest 里的真实数据计算这7天每天的总专注时长（无论成功还是失败，都计入每日时长统计）
  const dailyFocusMinutes = last7Days.map(dateStr => {
    const treesOnThisDay = forest.filter(tree => {
      const treeDateStr = new Date(tree.timestamp).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
      return treeDateStr === dateStr;
    });
    
    const totalMins = treesOnThisDay.reduce((sum, tree) => sum + tree.duration, 0);
    return totalMins;
  });

  // 计算最大值以确定柱状图比例，如果没有数据则默认最大比例为 60 分钟
  const maxMins = Math.max(...dailyFocusMinutes, 60);

  // 获取自定义标签的信息
  const getTagInfo = (tag: string) => {
    if (TAG_INFO[tag]) {
      return TAG_INFO[tag];
    }
    // 根据字符串计算一个简单的哈希值来分配颜色
    const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const color = CUSTOM_COLORS[hash % CUSTOM_COLORS.length];
    return { label: tag, color, icon: Tag };
  };

  // 计算标签占比 (包含所有内置和自定义标签)
  const uniqueTags = Array.from(new Set(forest.map(t => t.tag || 'other').filter(t => t !== 'other')));
  const tagDistribution = uniqueTags.map(tag => {
    const mins = forest
      .filter(tree => tree.tag === tag && tree.duration > 0)
      .reduce((sum, tree) => sum + tree.duration, 0);
    return { tag, mins };
  }).filter(item => item.mins > 0).sort((a, b) => b.mins - a.mins);

  const totalTagMins = tagDistribution.reduce((sum, item) => sum + item.mins, 0);
  let cumulativePercent = 0;

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-right-4 duration-700 pb-32">
      
      <header className="flex items-center justify-between px-2 mb-2 pt-6">
        <h2 className="text-[28px] font-black text-[#5c4332] tracking-tight drop-shadow-sm">数据统计</h2>
      </header>

      {/* 顶部总览卡片 */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-[0_8px_24px_rgba(140,115,98,0.06)] relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#d4a373]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-[#a3b18a]/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="grid grid-cols-3 gap-2 text-center relative z-10">
          <div className="flex flex-col items-center">
            <span className="text-[32px] font-black text-[#d4a373] tracking-tighter drop-shadow-sm leading-none">{weeklyTimeMinutes}</span>
            <span className="text-[12px] text-[#8c7362] font-bold mt-2">总专注(分)</span>
          </div>
          <div className="flex flex-col items-center border-x border-[#8c7362]/10">
            <span className="text-[32px] font-black text-[#a3b18a] tracking-tighter drop-shadow-sm leading-none">{successCount}</span>
            <span className="text-[12px] text-[#8c7362] font-bold mt-2">成功次数</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[32px] font-black text-[#e29578] tracking-tighter drop-shadow-sm leading-none">{failCount}</span>
            <span className="text-[12px] text-[#8c7362] font-bold mt-2">破戒次数</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* 标签分布环形图 */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-[0_8px_24px_rgba(140,115,98,0.06)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[16px] font-black text-[#5c4332] tracking-wide">专注分类</h3>
          </div>
          
          {tagDistribution.length > 0 ? (
            <div className="flex items-center gap-8">
              {/* 环形图 */}
              <div className="w-24 h-24 relative flex-shrink-0 drop-shadow-sm">
                <svg viewBox="0 0 32 32" className="w-full h-full -rotate-90 rounded-full">
                  {tagDistribution.map((item) => {
                    const percent = item.mins / totalTagMins;
                    const dasharray = `${percent * 100} 100`;
                    const dashoffset = -cumulativePercent * 100;
                    cumulativePercent += percent;
                    return (
                      <circle
                        key={item.tag}
                        r="15.9155"
                        cx="16"
                        cy="16"
                        fill="transparent"
                        stroke={getTagInfo(item.tag).color}
                        strokeWidth="6"
                        strokeDasharray={dasharray}
                        strokeDashoffset={dashoffset}
                        className="transition-all duration-1000"
                      />
                    );
                  })}
                </svg>
              </div>
              
              {/* 图例 */}
              <div className="flex flex-col gap-2 flex-1">
                {tagDistribution.map((item) => {
                  const info = getTagInfo(item.tag);
                  const Icon = info.icon;
                  const percent = Math.round((item.mins / totalTagMins) * 100);
                  return (
                    <div key={item.tag} className="flex items-center justify-between text-[13px]">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: info.color }} />
                        <span className="text-[#8c7362] font-bold flex items-center gap-1">
                          <Icon size={14} />
                          {info.label}
                        </span>
                      </div>
                      <span className="font-black text-[#5c4332]">{percent}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-24 gap-6 opacity-60">
              <div className="w-20 h-20 rounded-full border-[6px] border-[#8c7362]/10 flex-shrink-0" />
              <div className="text-[13px] font-bold text-[#8c7362]">暂无专注数据，快去开始第一次专注吧！</div>
            </div>
          )}
        </div>

      {/* 专注时长趋势 */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-[0_8px_24px_rgba(140,115,98,0.06)]">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-[16px] font-black text-[#5c4332] tracking-wide">本周趋势</h3>
          <span className="text-[11px] text-[#d4a373] font-bold bg-[#d4a373]/10 px-3 py-1 rounded-full border border-[#d4a373]/20">最近7天</span>
        </div>
        
        <div className="h-44 flex items-end justify-between gap-3 pt-10 border-b border-[#8c7362]/10 pb-2 mt-4">
          {last7Days.map((day, i) => {
            const mins = dailyFocusMinutes[i];
            const height = mins === 0 ? 4 : Math.max(8, (mins / maxMins) * 100);
            
            return (
              <div key={day} className="flex flex-col items-center gap-2 flex-1 relative group">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#5c4332] text-white text-[11px] font-bold px-2 py-1 rounded-md whitespace-nowrap z-10 opacity-100 transition-opacity shadow-md pointer-events-none">
                  {mins}m
                </div>
                
                <div className="w-full bg-[#fdfaf5]/50 rounded-xl relative flex items-end justify-center h-32 overflow-hidden shadow-inner">
                  <div 
                    className="w-full bg-gradient-to-t from-[#d4a373] to-[#e2b891] rounded-xl transition-all duration-1000 group-hover:brightness-110 shadow-sm"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-[#8c7362] whitespace-nowrap">{day.split('月')[1]}</span>
              </div>
            );
          })}
        </div>
      </div>
      </div>

      {/* 专注会话记录 */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-[0_8px_24px_rgba(140,115,98,0.06)]">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-[16px] font-black text-[#5c4332] tracking-wide">
            专注时间轴
          </h3>
          <span className="text-[12px] text-[#8c7362] font-bold bg-white/50 px-3 py-1 rounded-full shadow-inner border border-white/60">共 {forest.length} 次</span>
        </div>
        <p className="text-[13px] text-[#8c7362]/80 font-medium mb-6 ml-1">每一次专注，都是成长的印记</p>
        
        {forest.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center gap-3 text-[#8c7362] text-[14px] font-bold bg-white/40 rounded-3xl border border-dashed border-[#8c7362]/20">
            <TreePine size={32} className="text-[#8c7362]/40" />
            <span>这里空空如也，快开始第一次专注吧</span>
          </div>
        ) : (
          <div className="flex flex-col gap-4 relative">
            <div className="absolute left-[23px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#e8dcc4] via-[#e8dcc4]/50 to-transparent" />
            
            {forest.slice().reverse().filter(t => !!t.tag && t.tag !== 'other').map((tree) => {
              const tagInfo = getTagInfo(tree.tag as string);
              
              return (
                <div key={tree.id} className="relative pl-[56px] py-2 flex flex-col justify-center min-h-[48px] group">
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-[3px] border-white flex items-center justify-center shadow-sm z-10 transition-transform duration-300 group-hover:scale-110 ${tree.status === 'success' ? 'bg-[#f0f4eb]' : 'bg-[#fdf4f1]'}`}>
                    <div className="scale-75">
                      {tree.status === 'success' ? <SuccessIcon /> : <FailedIcon />}
                    </div>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-[1.25rem] p-3.5 shadow-sm flex items-center justify-between transition-all duration-300 group-hover:shadow-md group-hover:bg-white">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[15px] font-black ${tree.status === 'success' ? 'text-[#a3b18a]' : 'text-[#e29578]'}`}>
                          {tree.duration} 分钟
                        </span>
                        {tagInfo && (
                          <span className="text-[11px] font-bold text-[#8c7362] bg-[#f5f1e7] px-1.5 py-0.5 rounded flex items-center gap-1">
                            {(() => { const Icon = tagInfo.icon; return <Icon size={10} />; })()}
                            {tagInfo.label}
                          </span>
                        )}
                      </div>
                      <span className="text-[12px] font-bold text-[#8c7362]/60">
                        {new Date(tree.timestamp).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}
                      </span>
                    </div>
                    <div className={`text-[13px] font-bold ${tree.status === 'success' ? 'text-[#a3b18a]' : 'text-[#e29578]'}`}>
                      {tree.status === 'success' ? '已完成' : '破戒'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
