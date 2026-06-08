export default function RightSidebar() {
  return (
    <aside className="h-screen flex-shrink-0 glass-panel border-l border-white/50 flex flex-col p-md z-40 overflow-y-auto custom-scrollbar" style={{ width: '340px' }}>
      <div className="mb-lg pt-sm">
        <span className="font-labelMd text-labelMd uppercase tracking-wider text-blue-600 font-semibold">AI Insights Panel</span>
        <p className="font-bodySm text-bodySm text-slate-500 mt-xs">Deep intelligence analysis active.</p>
      </div>

      {/* Profile Maturity Progress Bar */}
      <div className="mb-xl p-md bg-blue-500/5 border border-blue-500/15 rounded-xl">
        <div className="flex justify-between items-center mb-sm">
          <span className="font-labelSm text-blue-600 font-semibold">Profile Maturity</span>
          <span className="font-labelSm text-blue-600 font-semibold">84%</span>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full w-[84%]"></div>
        </div>
        <p className="text-[11px] text-slate-600 mt-sm leading-tight">Patient behavior model is highly accurate. Predictions have increased by 12% this week.</p>
      </div>

      {/* Weekly Summaries */}
      <div className="space-y-lg">
        <h4 className="font-labelMd text-slate-800 flex items-center gap-sm">
          <span className="material-symbols-outlined text-[18px]">analytics</span>
          Weekly Summary
        </h4>
        <div className="space-y-md">
          <div className="group cursor-pointer hover:translate-x-[-4px] transition-transform duration-300">
            <div className="p-md rounded-xl glass-card glass-card-hover shadow-sm">
              <span className="font-labelSm text-slate-400">JULY 10 - JULY 17</span>
              <p className="font-bodySm text-slate-700 mt-sm">Resting heart rate decreased by 4bpm. Improved recovery noted after evening exercise.</p>
            </div>
          </div>
          <div className="group cursor-pointer hover:translate-x-[-4px] transition-transform duration-300">
            <div className="p-md rounded-xl glass-card glass-card-hover shadow-sm">
              <span className="font-labelSm text-slate-400">JULY 03 - JULY 10</span>
              <p className="font-bodySm text-slate-700 mt-sm">Adherence to physical therapy exercises reached 100%. Range of motion improved by 15%.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Behavioral Predictions */}
      <div className="mt-xl space-y-lg">
        <h4 className="font-labelMd text-slate-800 flex items-center gap-sm">
          <span className="material-symbols-outlined text-[18px]">query_stats</span>
          Predictions
        </h4>
        <div className="space-y-md">
          <div className="flex gap-md items-start p-sm rounded-lg hover:bg-slate-100 transition-all duration-300">
            <div className="p-sm bg-emerald-500/10 rounded-lg text-emerald-600 border border-emerald-500/20">
              <span className="material-symbols-outlined text-[20px]">trending_up</span>
            </div>
            <div>
              <span className="font-labelSm text-slate-800 font-semibold">Vitality Surge</span>
              <p className="text-bodySm text-slate-500 mt-1 leading-tight">High likelihood of peak athletic performance over next 72 hours.</p>
            </div>
          </div>
          <div className="flex gap-md items-start p-sm rounded-lg hover:bg-slate-100 transition-all duration-300">
            <div className="p-sm bg-rose-500/10 rounded-lg text-rose-600 border border-rose-500/20">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </div>
            <div>
              <span className="font-labelSm text-slate-800 font-semibold">Insomnia Risk</span>
              <p className="text-bodySm text-slate-500 mt-1 leading-tight">Pattern suggests 35% increase in sleep latency due to caffeine intake.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-auto pt-lg">
        <button className="w-full p-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-blue-200">
          <span className="material-symbols-outlined">auto_fix_high</span>
          Generate Monthly Report
        </button>
      </div>
    </aside>
  );
}
