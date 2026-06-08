interface MainContentProps {
  activeTab: string;
}

export default function MainContent({ activeTab }: MainContentProps) {
  return (
    <main className="flex-1 h-screen overflow-y-auto custom-scrollbar px-marginDesktop py-lg bg-transparent">
      {/* Top Header & Greeting */}
      <header className="mb-xl">
        <div className="flex justify-between items-end mb-lg">
          <div>
            <h2 className="font-headlineLg text-headlineLg text-slate-900">Good morning, Alex 👋</h2>
            <p className="text-slate-500 font-bodyMd">Your health metrics are within optimal range today.</p>
          </div>
          <div className="flex items-center gap-md">
            <div className="flex items-center bg-emerald-500/10 border border-emerald-500/15 px-lg py-sm rounded-full text-emerald-600 font-labelMd gap-2">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              Status: Stable
            </div>
            <div className="relative">
              <span className="material-symbols-outlined text-slate-600 cursor-pointer p-sm hover:bg-slate-100 rounded-full transition-colors">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-50"></span>
            </div>
          </div>
        </div>

        {/* AI Insight Banner */}
        <div className="glass-card rounded-xl p-lg flex items-start gap-lg border-l-4 border-blue-500 shadow-sm w-full">
          <div className="p-md bg-blue-500/10 rounded-lg text-blue-600">
            <span className="material-symbols-outlined">psychology</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-sm mb-xs">
              <span className="font-labelMd text-blue-600 font-semibold uppercase tracking-wider">AI Prediction</span>
              <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 rounded font-labelSm font-semibold">RAG Powered</span>
            </div>
            <p className="text-slate-700 font-bodyMd leading-relaxed">
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
          <div className="h-[420px] glass-card rounded-xl flex flex-col overflow-hidden shadow-sm">
            <div className="p-md border-b border-slate-200/50 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-md">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
                  <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                </div>
                <span className="font-labelMd text-slate-800">Health Assistant</span>
              </div>
              <div className="flex gap-2">
                <span className="text-labelSm text-blue-600 bg-blue-500/10 border border-blue-500/15 px-sm py-0.5 rounded font-semibold">98% Confidence</span>
                <span className="text-labelSm text-slate-400">v2.4</span>
              </div>
            </div>
            <div className="flex-grow p-lg overflow-y-auto flex flex-col gap-lg custom-scrollbar">
              <div className="flex gap-md max-w-[85%]">
                <div className="flex-grow bg-slate-100/60 border border-slate-200/50 p-md rounded-2xl rounded-tl-none font-bodySm text-slate-700">
                  Hello Alex! I've analyzed your recent blood work results. Everything looks great, but your Vitamin D levels are slightly below the baseline. Shall we adjust your supplement schedule?
                </div>
              </div>
              <div className="flex gap-md max-w-[85%] self-end">
                <div className="flex-grow bg-blue-600 text-white p-md rounded-2xl rounded-tr-none font-bodySm shadow-sm shadow-blue-200">
                  Yes, please update my care plan to include the extra dosage for the next two weeks.
                </div>
              </div>
              <div className="flex gap-md max-w-[85%]">
                <div className="flex-grow bg-slate-100/60 border border-slate-200/50 p-md rounded-2xl rounded-tl-none font-bodySm text-slate-700">
                  <span className="italic text-blue-600 flex items-center gap-sm mb-sm font-semibold text-xs uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[16px]">search</span>
                    Retrieving from medical journals...
                  </span>
                  Analysis complete. I've updated your daily schedule. You'll see a 1000IU supplement reminder at 8:00 AM daily until July 24th.
                </div>
              </div>
            </div>
            <div className="p-md border-t border-slate-200/50 flex gap-md items-center bg-slate-50/50">
              <input className="flex-grow glass-input rounded-lg px-lg py-md text-bodyMd border-slate-200" placeholder="Ask about your symptoms or care plan..." type="text" />
              <button className="w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-blue-200">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>

          {/* Risk Detection Meter */}
          <div className="glass-card rounded-xl p-lg shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-lg">
                <h3 className="font-labelMd text-slate-500 uppercase tracking-wide">Risk Detection</h3>
                <span className="material-symbols-outlined text-emerald-600">verified_user</span>
              </div>
              <div className="flex flex-col items-center py-md">
                {/* Circular Gauge */}
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-slate-200" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="12"></circle>
                    <circle className="text-emerald-500" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset="380" strokeWidth="12"></circle>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-displayLg font-displayLg text-slate-800">14</span>
                    <span className="text-labelSm text-slate-500">Score (0-100)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-md">
              <div className="flex justify-between items-center text-bodySm">
                <span className="text-slate-500">Overall Health Risk</span>
                <span className="font-bold text-emerald-600">Low (Minimal)</span>
              </div>
              <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[14%]"></div>
              </div>
              <p className="text-labelSm text-slate-500 italic leading-tight">
                AI monitoring cardiovascular and respiratory markers in real-time. No deviations detected.
              </p>
            </div>
          </div>
        </div>

        {/* Row 2: Medication & Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Medication Tracker (Timeline) */}
          <div className="glass-card rounded-xl p-lg shadow-sm">
            <div className="flex justify-between items-center mb-lg">
              <h3 className="font-labelMd text-slate-500 uppercase tracking-wide">Medication</h3>
              <span className="text-labelSm font-bold text-blue-600">92% Adherence</span>
            </div>
            <div className="space-y-lg">
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 border border-blue-500/20">
                  <span className="material-symbols-outlined">pill</span>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <span className="font-labelMd text-slate-800 font-semibold">Lisinopril</span>
                    <span className="text-labelSm text-emerald-600 font-bold">Taken</span>
                  </div>
                  <span className="text-bodySm text-slate-500">10mg • 08:00 AM</span>
                </div>
              </div>
              <div className="flex items-center gap-md relative">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600 border border-indigo-500/20">
                  <span className="material-symbols-outlined">pill</span>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <span className="font-labelMd text-slate-800 font-semibold">Atorvastatin</span>
                    <span className="text-labelSm text-blue-600 font-bold">Next: 10:00 PM</span>
                  </div>
                  <span className="text-bodySm text-slate-500">20mg • Daily</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 border border-slate-200/60 h-8 rounded-lg flex items-center px-sm gap-1">
                <div className="h-4 bg-emerald-500/80 w-1/4 rounded-sm"></div>
                <div className="h-4 bg-emerald-500/80 w-1/4 rounded-sm"></div>
                <div className="h-4 bg-emerald-500/80 w-1/4 rounded-sm"></div>
                <div className="h-4 bg-slate-200 w-1/4 rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* Health Timeline (Trend) */}
          <div className="glass-card rounded-xl p-lg shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-md">
              <h3 className="font-labelMd text-slate-500 uppercase tracking-wide">Health Timeline</h3>
              <div className="flex gap-md">
                <button className="text-labelSm font-bold text-blue-600">7 Days</button>
                <button className="text-labelSm font-medium text-slate-500 hover:text-slate-700">30 Days</button>
              </div>
            </div>
            <div className="h-48 w-full relative flex items-end justify-between px-2 pt-lg">
              {/* Simulated Chart */}
              <div className="absolute inset-0 flex items-end justify-between px-md pb-lg">
                <div className="w-1.5 bg-blue-500/10 h-24 rounded-t"></div>
                <div className="w-1.5 bg-blue-500/15 h-28 rounded-t"></div>
                <div className="w-1.5 bg-blue-500/20 h-32 rounded-t"></div>
                <div className="w-1.5 bg-blue-600 h-40 rounded-t relative shadow-[0_-2px_10px_rgba(37,99,235,0.2)]">
                  <div className="absolute -top-10 -left-6 bg-blue-600 text-white text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap font-bold shadow-md shadow-blue-200">Current: 72 bpm</div>
                </div>
                <div className="w-1.5 bg-blue-500/20 h-36 rounded-t"></div>
                <div className="w-1.5 bg-blue-500/15 h-34 rounded-t"></div>
                <div className="w-1.5 bg-blue-500/10 h-30 rounded-t"></div>
              </div>
              <div className="flex flex-col justify-between h-full text-[10px] text-slate-400 font-medium w-full pointer-events-none">
                <div className="border-t border-slate-200/60 w-full pt-1">Optimal High</div>
                <div className="border-t border-slate-200/60 w-full pt-1">Median</div>
                <div className="border-t border-slate-200/60 w-full pt-1">Optimal Low</div>
              </div>
            </div>
            <div className="flex justify-between px-md mt-sm text-[10px] text-slate-400">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>

        {/* Hospital Finder Map UI */}
        <div className="glass-card rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row h-80">
          <div className="w-full md:w-1/3 p-lg flex flex-col justify-between border-r border-slate-200/50">
            <div>
              <h3 className="font-labelMd text-slate-500 uppercase tracking-wide mb-lg">Emergency Nearest Care</h3>
              <div className="space-y-md">
                <div className="p-md rounded-lg bg-blue-500/5 border border-blue-500/15">
                  <div className="flex justify-between mb-xs">
                    <span className="font-labelMd text-slate-800 font-semibold">St. Mary's General</span>
                    <span className="text-labelSm text-emerald-600 font-bold">4 min away</span>
                  </div>
                  <p className="text-bodySm text-slate-500">Wait time: ~12 mins</p>
                </div>
                <div className="p-md rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                  <div className="flex justify-between mb-xs">
                    <span className="font-labelMd text-slate-700">City Trauma Center</span>
                    <span className="text-labelSm text-slate-500">12 min away</span>
                  </div>
                  <p className="text-bodySm text-slate-500">Wait time: ~45 mins</p>
                </div>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-md bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-labelMd transition-all active:scale-[0.98]">
              <span className="material-symbols-outlined text-[20px]">directions</span>
              Get Directions
            </button>
          </div>
          <div className="flex-grow bg-slate-100 relative">
            {/* Map Placeholder */}
            <div className="w-full h-full flex items-center justify-center bg-slate-50">
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-slate-400">map</span>
                <p className="text-slate-500 text-sm mt-2 font-medium">Interactive Map</p>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center animate-ping"></div>
              <div className="absolute w-4 h-4 bg-blue-600 border-2 border-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Care Plan Panel */}
        <div className="glass-card rounded-xl p-lg shadow-sm">
          <div className="flex justify-between items-center mb-lg">
            <h3 className="font-labelMd text-slate-500 uppercase tracking-wide">AI-Optimized Care Schedule</h3>
            <span className="text-labelSm text-slate-400">Updated 1h ago</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            <div className="flex gap-md">
              <div className="flex flex-col items-center">
                <span className="font-labelSm text-blue-600 font-bold">08:00</span>
                <div className="w-px h-full bg-slate-200 my-sm"></div>
              </div>
              <div>
                <h4 className="font-labelMd text-slate-800 font-semibold">Medication & Vitals</h4>
                <p className="text-bodySm text-slate-500">Take prescribed supplements and record blood pressure.</p>
              </div>
            </div>
            <div className="flex gap-md">
              <div className="flex flex-col items-center">
                <span className="font-labelSm text-blue-600 font-bold">14:00</span>
                <div className="w-px h-full bg-slate-200 my-sm"></div>
              </div>
              <div>
                <h4 className="font-labelMd text-slate-800 font-semibold">Hydration Milestone</h4>
                <p className="text-bodySm text-slate-500">Recommended 500ml water intake based on activity level.</p>
              </div>
            </div>
            <div className="flex gap-md">
              <div className="flex flex-col items-center">
                <span className="font-labelSm text-blue-600 font-bold">21:00</span>
                <div className="w-px h-full bg-slate-200 my-sm opacity-0"></div>
              </div>
              <div>
                <h4 className="font-labelMd text-slate-800 font-semibold">Sleep Preparation</h4>
                <p className="text-bodySm text-slate-500">Low-light activity and guided meditation session.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
