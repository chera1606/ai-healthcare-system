export default function RightSidebar() {
  return (
    <aside className="h-screen flex-shrink-0 glass-panel border-l border-outlineVariant flex flex-col p-md z-40 overflow-y-auto custom-scrollbar" style={{ width: '340px' }}>
      <div className="mb-lg pt-sm">
        <span className="font-labelMd text-labelMd uppercase tracking-wider text-tertiary">AI Insights Panel</span>
        <p className="font-bodySm text-bodySm text-onSurfaceVariant mt-xs">Deep intelligence analysis active.</p>
      </div>

      {/* Intelligence Progress Bar */}
      <div className="mb-xl p-md bg-tertiary/10 rounded-xl">
        <div className="flex justify-between items-center mb-sm">
          <span className="font-labelSm text-tertiary">Profile Maturity</span>
          <span className="font-labelSm text-tertiary">84%</span>
        </div>
        <div className="w-full bg-tertiaryFixed h-2 rounded-full overflow-hidden">
          <div className="bg-tertiary h-full w-[84%]"></div>
        </div>
        <p className="text-[11px] text-tertiary mt-sm leading-tight">Patient behavior model is highly accurate. Predictions have increased by 12% this week.</p>
      </div>

      {/* Weekly Summaries */}
      <div className="space-y-lg">
        <h4 className="font-labelMd text-onSurface flex items-center gap-sm">
          <span className="material-symbols-outlined text-[18px]">analytics</span>
          Weekly Summary
        </h4>
        <div className="space-y-md">
          <div className="group cursor-pointer hover:translate-x-[-4px] transition-transform">
            <div className="p-md rounded-xl bg-white border border-outlineVariant shadow-sm group-hover:border-tertiary">
              <span className="font-labelSm text-outline">JULY 10 - JULY 17</span>
              <p className="font-bodySm text-onSurface mt-sm">Resting heart rate decreased by 4bpm. Improved recovery noted after evening exercise.</p>
            </div>
          </div>
          <div className="group cursor-pointer hover:translate-x-[-4px] transition-transform">
            <div className="p-md rounded-xl bg-white border border-outlineVariant shadow-sm group-hover:border-tertiary">
              <span className="font-labelSm text-outline">JULY 03 - JULY 10</span>
              <p className="font-bodySm text-onSurface mt-sm">Adherence to physical therapy exercises reached 100%. Range of motion improved by 15%.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Behavioral Predictions */}
      <div className="mt-xl space-y-lg">
        <h4 className="font-labelMd text-onSurface flex items-center gap-sm">
          <span className="material-symbols-outlined text-[18px]">query_stats</span>
          Predictions
        </h4>
        <div className="space-y-md">
          <div className="flex gap-md items-start p-sm">
            <div className="p-sm bg-secondary/10 rounded-lg text-secondary">
              <span className="material-symbols-outlined text-[20px]">trending_up</span>
            </div>
            <div>
              <span className="font-labelSm text-onSurface">Vitality Surge</span>
              <p className="text-bodySm text-onSurfaceVariant">High likelihood of peak athletic performance over next 72 hours.</p>
            </div>
          </div>
          <div className="flex gap-md items-start p-sm">
            <div className="p-sm bg-error/10 rounded-lg text-error">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </div>
            <div>
              <span className="font-labelSm text-onSurface">Insomnia Risk</span>
              <p className="text-bodySm text-onSurfaceVariant">Pattern suggests 35% increase in sleep latency due to caffeine intake.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-auto pt-lg">
        <button className="w-full p-md bg-tertiary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all">
          <span className="material-symbols-outlined">auto_fix_high</span>
          Generate Monthly Report
        </button>
      </div>
    </aside>
  );
}
