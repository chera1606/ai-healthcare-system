interface MainContentProps {
  activeTab: string;
}

export default function MainContent({ activeTab }: MainContentProps) {
  return (
    <main className="flex-1 h-screen overflow-y-auto custom-scrollbar px-marginDesktop py-lg bg-background">
      {/* Top Header & Greeting */}
      <header className="mb-xl">
        <div className="flex justify-between items-end mb-lg">
          <div>
            <h2 className="font-headlineLg text-headlineLg text-onSurface">Good morning, Alex 👋</h2>
            <p className="text-onSurfaceVariant font-bodyMd">Your health metrics are within optimal range today.</p>
          </div>
          <div className="flex items-center gap-md">
            <div className="flex items-center bg-secondaryContainer px-lg py-sm rounded-full text-onSecondaryContainer font-labelMd gap-2">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              Status: Stable
            </div>
            <div className="relative">
              <span className="material-symbols-outlined text-onSurfaceVariant cursor-pointer p-sm hover:bg-surfaceContainer rounded-full">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full border-2 border-background"></span>
            </div>
          </div>
        </div>

        {/* AI Insight Banner */}
        <div className="glass-panel rounded-xl p-lg flex items-start gap-lg border-l-4 border-primary shadow-sm w-full">
          <div className="p-md bg-primary/10 rounded-lg text-primary">
            <span className="material-symbols-outlined">psychology</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-sm mb-xs">
              <span className="font-labelMd text-primary">AI PREDICTION</span>
              <span className="px-2 py-0.5 bg-tertiaryFixed text-onTertiaryFixedVariant rounded font-labelSm">RAG Powered</span>
            </div>
            <p className="text-onSurface font-bodyMd leading-relaxed">
              Based on your sleep patterns and heart rate variability over the last 48 hours, there is an 82% likelihood of increased stress tomorrow. I recommend a 10-minute guided breathing session this evening.
            </p>
          </div>
        </div>
      </header>

      {/* Bento Grid Widgets */}
      <div className="space-y-10 mb-xl">
        {/* Row 1: Chat & Risk Gauge */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* AI Health Assistant Chat (Large) */}
          <div className="h-[420px] bg-white border border-outlineVariant rounded-xl flex flex-col overflow-hidden shadow-sm">
            <div className="p-md border-b border-outlineVariant flex justify-between items-center bg-surfaceContainerLowest/50">
              <div className="flex items-center gap-md">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                </div>
                <span className="font-labelMd">Health Assistant</span>
              </div>
              <div className="flex gap-2">
                <span className="text-labelSm text-secondary bg-secondaryContainer/30 px-sm py-0.5 rounded">98% Confidence</span>
                <span className="text-labelSm text-outline">v2.4</span>
              </div>
            </div>
            <div className="flex-grow p-lg overflow-y-auto flex flex-col gap-lg custom-scrollbar">
              <div className="flex gap-md max-w-[85%]">
                <div className="flex-grow bg-surfaceContainerLow p-md rounded-2xl rounded-tl-none font-bodySm">
                  Hello Alex! I've analyzed your recent blood work results. Everything looks great, but your Vitamin D levels are slightly below the baseline. Shall we adjust your supplement schedule?
                </div>
              </div>
              <div className="flex gap-md max-w-[85%] self-end">
                <div className="flex-grow bg-primary text-white p-md rounded-2xl rounded-tr-none font-bodySm">
                  Yes, please update my care plan to include the extra dosage for the next two weeks.
                </div>
              </div>
              <div className="flex gap-md max-w-[85%]">
                <div className="flex-grow bg-surfaceContainerLow p-md rounded-2xl rounded-tl-none font-bodySm">
                  <span className="italic text-onSurfaceVariant flex items-center gap-sm mb-sm">
                    <span className="material-symbols-outlined text-[16px]">search</span>
                    Retrieving from medical journals...
                  </span>
                  Analysis complete. I've updated your daily schedule. You'll see a 1000IU supplement reminder at 8:00 AM daily until July 24th.
                </div>
              </div>
            </div>
            <div className="p-md border-t border-outlineVariant flex gap-md items-center">
              <input className="flex-grow border-none bg-surfaceContainerLow rounded-lg focus:ring-2 focus:ring-primary px-lg py-md text-bodyMd" placeholder="Ask about your symptoms or care plan..." type="text" />
              <button className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center hover:opacity-90 active:scale-95 transition-all">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>

          {/* Risk Detection Meter */}
          <div className="bg-white border border-outlineVariant rounded-xl p-lg shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-lg">
                <h3 className="font-labelMd text-onSurfaceVariant uppercase tracking-wide">Risk Detection</h3>
                <span className="material-symbols-outlined text-secondary">verified_user</span>
              </div>
              <div className="flex flex-col items-center py-md">
                {/* Circular Gauge */}
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-surfaceContainerHighest" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="12"></circle>
                    <circle className="text-secondary" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset="380" strokeWidth="12"></circle>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-displayLg font-displayLg text-onSurface">14</span>
                    <span className="text-labelSm text-onSurfaceVariant">Score (0-100)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-md">
              <div className="flex justify-between items-center text-bodySm">
                <span className="text-onSurfaceVariant">Overall Health Risk</span>
                <span className="font-bold text-secondary">Low (Minimal)</span>
              </div>
              <div className="w-full bg-surfaceContainerHighest h-1 rounded-full overflow-hidden">
                <div className="bg-secondary h-full w-[14%]"></div>
              </div>
              <p className="text-labelSm text-onSurfaceVariant italic leading-tight">
                AI monitoring cardiovascular and respiratory markers in real-time. No deviations detected.
              </p>
            </div>
          </div>
        </div>

        {/* Row 2: Medication & Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Medication Tracker (Timeline) */}
          <div className="bg-white border border-outlineVariant rounded-xl p-lg shadow-sm">
            <div className="flex justify-between items-center mb-lg">
              <h3 className="font-labelMd text-onSurfaceVariant uppercase tracking-wide">Medication</h3>
              <span className="text-labelSm font-bold text-primary">92% Adherence</span>
            </div>
            <div className="space-y-lg">
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">pill</span>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <span className="font-labelMd text-onSurface">Lisinopril</span>
                    <span className="text-labelSm text-secondary">Taken</span>
                  </div>
                  <span className="text-bodySm text-onSurfaceVariant">10mg • 08:00 AM</span>
                </div>
              </div>
              <div className="flex items-center gap-md relative">
                <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined">pill</span>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <span className="font-labelMd text-onSurface">Atorvastatin</span>
                    <span className="text-labelSm text-primary">Next: 10:00 PM</span>
                  </div>
                  <span className="text-bodySm text-onSurfaceVariant">20mg • Daily</span>
                </div>
              </div>
              <div className="w-full bg-surfaceContainer h-8 rounded-lg flex items-center px-sm gap-1">
                <div className="h-4 bg-secondary w-1/4 rounded-sm"></div>
                <div className="h-4 bg-secondary w-1/4 rounded-sm"></div>
                <div className="h-4 bg-secondary w-1/4 rounded-sm"></div>
                <div className="h-4 bg-outlineVariant w-1/4 rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* Health Timeline (Trend) */}
          <div className="bg-white border border-outlineVariant rounded-xl p-lg shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-md">
              <h3 className="font-labelMd text-onSurfaceVariant uppercase tracking-wide">Health Timeline</h3>
              <div className="flex gap-md">
                <button className="text-labelSm font-bold text-primary">7 Days</button>
                <button className="text-labelSm font-medium text-onSurfaceVariant">30 Days</button>
              </div>
            </div>
            <div className="h-48 w-full relative flex items-end justify-between px-2 pt-lg">
              {/* Simulated Chart */}
              <div className="absolute inset-0 flex items-end justify-between px-md pb-lg">
                <div className="w-1 bg-primary/20 h-24 rounded-t"></div>
                <div className="w-1 bg-primary/20 h-28 rounded-t"></div>
                <div className="w-1 bg-primary/20 h-32 rounded-t"></div>
                <div className="w-1 bg-primary h-40 rounded-t relative">
                  <div className="absolute -top-10 -left-6 bg-primary text-white text-[10px] px-2 py-1 rounded-full whitespace-nowrap">Current: 72 bpm</div>
                </div>
                <div className="w-1 bg-primary/20 h-36 rounded-t"></div>
                <div className="w-1 bg-primary/20 h-34 rounded-t"></div>
                <div className="w-1 bg-primary/20 h-30 rounded-t"></div>
              </div>
              <div className="flex flex-col justify-between h-full text-[10px] text-outline font-medium w-full pointer-events-none">
                <div className="border-t border-outlineVariant/30 w-full pt-1">Optimal High</div>
                <div className="border-t border-outlineVariant/30 w-full pt-1">Median</div>
                <div className="border-t border-outlineVariant/30 w-full pt-1">Optimal Low</div>
              </div>
            </div>
            <div className="flex justify-between px-md mt-sm text-[10px] text-outline">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>

        {/* Hospital Finder Map UI */}
        <div className="bg-white border border-outlineVariant rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row h-80">
          <div className="w-full md:w-1/3 p-lg flex flex-col justify-between border-r border-outlineVariant">
            <div>
              <h3 className="font-labelMd text-onSurfaceVariant uppercase tracking-wide mb-lg">Emergency Nearest Care</h3>
              <div className="space-y-md">
                <div className="p-md rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex justify-between mb-xs">
                    <span className="font-labelMd text-onSurface">St. Mary's General</span>
                    <span className="text-labelSm text-secondary font-bold">4 min away</span>
                  </div>
                  <p className="text-bodySm text-onSurfaceVariant">Wait time: ~12 mins</p>
                </div>
                <div className="p-md rounded-lg hover:bg-surfaceContainerLow transition-colors cursor-pointer">
                  <div className="flex justify-between mb-xs">
                    <span className="font-labelMd text-onSurface">City Trauma Center</span>
                    <span className="text-labelSm text-onSurfaceVariant">12 min away</span>
                  </div>
                  <p className="text-bodySm text-onSurfaceVariant">Wait time: ~45 mins</p>
                </div>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-md bg-surfaceContainerHighest rounded-lg font-labelMd hover:bg-outlineVariant transition-colors">
              <span className="material-symbols-outlined text-[20px]">directions</span>
              Get Directions
            </button>
          </div>
          <div className="flex-grow bg-surfaceContainer relative">
            {/* Map Placeholder */}
            <div className="w-full h-full flex items-center justify-center bg-slate-200">
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-slate-400">map</span>
                <p className="text-slate-500 text-sm mt-2">Interactive Map</p>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center animate-ping"></div>
              <div className="absolute w-4 h-4 bg-primary border-2 border-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Care Plan Panel */}
        <div className="bg-white border border-outlineVariant rounded-xl p-lg shadow-sm">
          <div className="flex justify-between items-center mb-lg">
            <h3 className="font-labelMd text-onSurfaceVariant uppercase tracking-wide">AI-Optimized Care Schedule</h3>
            <span className="text-labelSm text-outline">Updated 1h ago</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            <div className="flex gap-md">
              <div className="flex flex-col items-center">
                <span className="font-labelSm text-outline">08:00</span>
                <div className="w-px h-full bg-outlineVariant my-sm"></div>
              </div>
              <div>
                <h4 className="font-labelMd text-onSurface">Medication & Vitals</h4>
                <p className="text-bodySm text-onSurfaceVariant">Take prescribed supplements and record blood pressure.</p>
              </div>
            </div>
            <div className="flex gap-md">
              <div className="flex flex-col items-center">
                <span className="font-labelSm text-outline">14:00</span>
                <div className="w-px h-full bg-outlineVariant my-sm"></div>
              </div>
              <div>
                <h4 className="font-labelMd text-onSurface">Hydration Milestone</h4>
                <p className="text-bodySm text-onSurfaceVariant">Recommended 500ml water intake based on activity level.</p>
              </div>
            </div>
            <div className="flex gap-md">
              <div className="flex flex-col items-center">
                <span className="font-labelSm text-outline">21:00</span>
                <div className="w-px h-full bg-outlineVariant my-sm opacity-0"></div>
              </div>
              <div>
                <h4 className="font-labelMd text-onSurface">Sleep Preparation</h4>
                <p className="text-bodySm text-onSurfaceVariant">Low-light activity and guided meditation session.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
