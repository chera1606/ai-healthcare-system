import { useState } from 'react';
import { useHealthTimeline } from '../hooks/useHealthTimeline';
import { formatDate, formatTime } from '../utils/formatDate';
import { TIME_RANGES } from '../constants';

interface HealthTimelineProps {
  activeTab: string;
}

export default function HealthTimeline({ activeTab }: HealthTimelineProps) {
  const { events, stats, loading, error } = useHealthTimeline();
  const [timeRange, setTimeRange] = useState<string>(TIME_RANGES.DAYS_7);

  return (
    <main className="flex-1 h-screen overflow-y-auto custom-scrollbar px-marginDesktop py-lg bg-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-xl">
          <h1 className="font-headlineLg text-headlineLg text-slate-900 mb-sm">Health Timeline</h1>
          <p className="text-slate-500 font-bodyMd">Track your health journey with a comprehensive timeline view.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-xl">
          <div className="glass-card rounded-xl p-lg shadow-sm">
            <div className="flex items-center gap-3 mb-sm">
              <span className="material-symbols-outlined text-rose-500">favorite</span>
              <span className="font-labelMd text-slate-500">Avg Heart Rate</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-displayLg font-displayLg text-slate-800">{stats?.heartRate || 72}</span>
              <span className="text-labelSm text-slate-400 mb-2 font-medium">bpm</span>
            </div>
          </div>
          <div className="glass-card rounded-xl p-lg shadow-sm">
            <div className="flex items-center gap-3 mb-sm">
              <span className="material-symbols-outlined text-blue-600">bloodtype</span>
              <span className="font-labelMd text-slate-500">Blood Pressure</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-displayLg font-displayLg text-slate-800">{stats?.bloodPressure || '120/80'}</span>
              <span className="text-labelSm text-slate-400 mb-2 font-medium">mmHg</span>
            </div>
          </div>
          <div className="glass-card rounded-xl p-lg shadow-sm">
            <div className="flex items-center gap-3 mb-sm">
              <span className="material-symbols-outlined text-indigo-500">monitor_weight</span>
              <span className="font-labelMd text-slate-500">Weight</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-displayLg font-displayLg text-slate-800">{stats?.weight || 165}</span>
              <span className="text-labelSm text-slate-400 mb-2 font-medium">lbs</span>
            </div>
          </div>
          <div className="glass-card rounded-xl p-lg shadow-sm">
            <div className="flex items-center gap-3 mb-sm">
              <span className="material-symbols-outlined text-emerald-600">bedtime</span>
              <span className="font-labelMd text-slate-500">Sleep</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-displayLg font-displayLg text-slate-800">{stats?.sleep || 7.5}</span>
              <span className="text-labelSm text-slate-400 mb-2 font-medium">hrs avg</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="glass-card rounded-xl p-lg shadow-sm mb-xl">
          <div className="flex justify-between items-center mb-lg flex-wrap gap-4">
            <h2 className="font-labelMd font-semibold text-slate-800">Recent Activity</h2>
            <div className="flex gap-md">
              {Object.values(TIME_RANGES).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`text-labelSm font-medium transition-all ${
                    timeRange === range 
                      ? 'text-blue-600 font-bold border-b-2 border-blue-500 pb-1' 
                      : 'text-slate-400 hover:text-slate-600 pb-1'
                  }`}
                >
                  {range} Days
                </button>
              ))}
            </div>
          </div>

          {loading && events.length === 0 ? (
            <div className="text-center py-xl">
              <span className="material-symbols-outlined text-4xl text-blue-600 animate-spin">refresh</span>
              <p className="text-bodySm text-slate-500 mt-sm">Loading timeline...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-xl">
              <span className="material-symbols-outlined text-4xl text-slate-400">history</span>
              <p className="text-bodySm text-slate-500 mt-sm">No events found</p>
            </div>
          ) : (
            <div className="space-y-0">
              {events.map((event, index) => (
                <div key={event.id} className={`flex gap-md ${index !== events.length - 1 ? 'pb-lg border-b border-slate-100' : ''}`}>
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                      event.type === 'Vitals' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                      event.type === 'Medication' ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' :
                      event.type === 'Lab Test' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                      event.type === 'Activity' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                      'bg-rose-500/10 text-rose-600 border-rose-500/20'
                    }`}>
                      <span className="material-symbols-outlined text-[20px]">{event.icon}</span>
                    </div>
                    {index !== events.length - 1 && (
                      <div className="w-px h-full bg-slate-200 my-sm"></div>
                    )}
                  </div>
                  <div className="flex-grow pb-lg pt-1">
                    <div className="flex items-start justify-between mb-xs flex-wrap gap-2">
                      <div>
                        <span className="text-labelSm text-slate-400 mb-1 block font-medium">{formatDate(event.date)} • {formatTime(event.time)}</span>
                        <span className="px-2 py-0.5 bg-slate-100 border border-slate-200/50 rounded text-labelSm text-slate-500">{event.type}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-labelSm font-bold border ${
                        event.status === 'Normal' || event.status === 'Taken' || event.status === 'Complete' || event.status === 'Completed' || event.status === 'Attended' 
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                    <h3 className="font-labelMd font-semibold text-slate-800 mb-xs mt-1">{event.title}</h3>
                    <p className="text-bodySm text-slate-500">{event.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {error && (
            <div className="mt-md p-sm bg-rose-500/10 text-rose-600 border border-rose-500/15 rounded-lg text-bodySm font-semibold">
              {error}
            </div>
          )}
        </div>

        {/* Health Trends Chart */}
        <div className="mt-xl">
          <h2 className="font-labelMd font-semibold text-slate-800 mb-lg">Health Trends</h2>
          <div className="glass-card rounded-xl p-lg shadow-sm">
            <div className="flex justify-between items-center mb-md">
              <div className="flex gap-md">
                <button className="text-labelSm font-bold text-blue-600">Heart Rate</button>
                <button className="text-labelSm font-medium text-slate-500 hover:text-slate-700">Blood Pressure</button>
                <button className="text-labelSm font-medium text-slate-500 hover:text-slate-700">Weight</button>
              </div>
            </div>
            <div className="h-64 relative flex items-end justify-between px-md pt-lg">
              <div className="absolute inset-0 flex items-end justify-between px-md pb-lg">
                <div className="w-8 bg-blue-500/10 h-32 rounded-t"></div>
                <div className="w-8 bg-blue-500/15 h-36 rounded-t"></div>
                <div className="w-8 bg-blue-500/20 h-40 rounded-t"></div>
                <div className="w-8 bg-blue-500/15 h-34 rounded-t"></div>
                <div className="w-8 bg-blue-500/20 h-38 rounded-t"></div>
                <div className="w-8 bg-blue-500/10 h-42 rounded-t"></div>
                <div className="w-8 bg-blue-600 h-48 rounded-t relative shadow-[0_-2px_10px_rgba(37,99,235,0.2)]">
                  <div className="absolute -top-8 -left-4 bg-blue-600 text-white text-[10px] px-2 py-1 rounded-full whitespace-nowrap font-bold shadow-md shadow-blue-200">72 bpm</div>
                </div>
              </div>
              <div className="flex flex-col justify-between h-full text-[10px] text-slate-400 font-medium w-full pointer-events-none">
                <div className="border-t border-slate-200/60 w-full pt-1">100 bpm</div>
                <div className="border-t border-slate-200/60 w-full pt-1">80 bpm</div>
                <div className="border-t border-slate-200/60 w-full pt-1">60 bpm</div>
                <div className="border-t border-slate-200/60 w-full pt-1">40 bpm</div>
              </div>
            </div>
            <div className="flex justify-between px-md mt-sm text-[10px] text-slate-400">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="mt-xl">
          <h2 className="font-labelMd font-semibold text-slate-800 mb-lg">AI Insights</h2>
          <div className="glass-card rounded-xl p-lg shadow-sm">
            <div className="flex items-start gap-md mb-md">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              </div>
              <div>
                <h3 className="font-labelMd font-semibold text-slate-800 mb-xs">Trend Analysis</h3>
                <p className="text-bodySm text-slate-500 leading-relaxed">
                  Your heart rate has been stable over the past week with an average of 72 bpm. This indicates good cardiovascular health. Continue your current exercise routine.
                </p>
              </div>
            </div>
            <div className="flex gap-md flex-wrap">
              <div className="flex-grow p-sm bg-emerald-500/5 border border-emerald-500/10 rounded-lg min-w-[150px]">
                <span className="font-bodySm font-semibold text-slate-600">Heart Rate</span>
                <p className="text-bodySm text-emerald-600 font-bold mt-1">Stable & Healthy</p>
              </div>
              <div className="flex-grow p-sm bg-emerald-500/5 border border-emerald-500/10 rounded-lg min-w-[150px]">
                <span className="font-bodySm font-semibold text-slate-600">Activity Level</span>
                <p className="text-bodySm text-emerald-600 font-bold mt-1">Above Average</p>
              </div>
              <div className="flex-grow p-sm bg-blue-500/5 border border-blue-500/10 rounded-lg min-w-[150px]">
                <span className="font-bodySm font-semibold text-slate-600">Sleep Quality</span>
                <p className="text-bodySm text-blue-600 font-bold mt-1">Good Quality</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
