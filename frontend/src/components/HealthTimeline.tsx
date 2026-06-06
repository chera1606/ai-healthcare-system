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
    <main className="flex-1 h-screen overflow-y-auto custom-scrollbar px-marginDesktop py-lg bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-xl">
          <h1 className="font-headlineLg text-headlineLg text-onSurface mb-sm">Health Timeline</h1>
          <p className="text-onSurfaceVariant font-bodyMd">Track your health journey with comprehensive timeline view.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-xl">
          <div className="bg-white border border-outlineVariant rounded-xl p-lg shadow-sm">
            <div className="flex items-center gap-3 mb-sm">
              <span className="material-symbols-outlined text-primary">favorite</span>
              <span className="font-labelMd text-onSurfaceVariant">Avg Heart Rate</span>
            </div>
            <span className="text-displayLg font-displayLg text-onSurface">{stats?.heartRate || 72}</span>
            <span className="text-labelSm text-onSurfaceVariant">bpm</span>
          </div>
          <div className="bg-white border border-outlineVariant rounded-xl p-lg shadow-sm">
            <div className="flex items-center gap-3 mb-sm">
              <span className="material-symbols-outlined text-emeraldGreen">bloodtype</span>
              <span className="font-labelMd text-onSurfaceVariant">Blood Pressure</span>
            </div>
            <span className="text-displayLg font-displayLg text-onSurface">{stats?.bloodPressure || '120/80'}</span>
            <span className="text-labelSm text-onSurfaceVariant">mmHg</span>
          </div>
          <div className="bg-white border border-outlineVariant rounded-xl p-lg shadow-sm">
            <div className="flex items-center gap-3 mb-sm">
              <span className="material-symbols-outlined text-tertiary">monitor_weight</span>
              <span className="font-labelMd text-onSurfaceVariant">Weight</span>
            </div>
            <span className="text-displayLg font-displayLg text-onSurface">{stats?.weight || 165}</span>
            <span className="text-labelSm text-onSurfaceVariant">lbs</span>
          </div>
          <div className="bg-white border border-outlineVariant rounded-xl p-lg shadow-sm">
            <div className="flex items-center gap-3 mb-sm">
              <span className="material-symbols-outlined text-secondary">bedtime</span>
              <span className="font-labelMd text-onSurfaceVariant">Sleep</span>
            </div>
            <span className="text-displayLg font-displayLg text-onSurface">{stats?.sleep || 7.5}</span>
            <span className="text-labelSm text-onSurfaceVariant">hours avg</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white border border-outlineVariant rounded-xl p-lg shadow-sm">
          <div className="flex justify-between items-center mb-lg">
            <h2 className="font-labelMd font-semibold text-onSurface">Recent Activity</h2>
            <div className="flex gap-md">
              {Object.values(TIME_RANGES).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`text-labelSm font-medium transition-colors ${
                    timeRange === range 
                      ? 'text-primary font-bold' 
                      : 'text-onSurfaceVariant hover:text-onSurface'
                  }`}
                >
                  {range} Days
                </button>
              ))}
            </div>
          </div>

          {loading && events.length === 0 ? (
            <div className="text-center py-xl">
              <span className="material-symbols-outlined text-4xl text-outlineVariant animate-spin">refresh</span>
              <p className="text-bodySm text-onSurfaceVariant mt-sm">Loading timeline...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-xl">
              <span className="material-symbols-outlined text-4xl text-outlineVariant">history</span>
              <p className="text-bodySm text-onSurfaceVariant mt-sm">No events found</p>
            </div>
          ) : (
            <div className="space-y-0">
              {events.map((event, index) => (
                <div key={event.id} className={`flex gap-md ${index !== events.length - 1 ? 'pb-lg border-b border-outlineVariant' : ''}`}>
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      event.type === 'Vitals' ? 'bg-primary/10 text-primary' :
                      event.type === 'Medication' ? 'bg-secondary/10 text-secondary' :
                      event.type === 'Lab Test' ? 'bg-tertiary/10 text-tertiary' :
                      event.type === 'Activity' ? 'bg-emeraldGreen/10 text-emeraldGreen' :
                      'bg-amber-500/10 text-amber-600'
                    }`}>
                      <span className="material-symbols-outlined text-[20px]">{event.icon}</span>
                    </div>
                    {index !== events.length - 1 && (
                      <div className="w-px h-full bg-outlineVariant my-sm"></div>
                    )}
                  </div>
                  <div className="flex-grow pb-lg">
                    <div className="flex items-start justify-between mb-xs">
                      <div>
                        <span className="text-labelSm text-outline mb-1 block">{formatDate(event.date)} • {formatTime(event.time)}</span>
                        <span className="px-2 py-0.5 bg-surfaceContainer rounded text-labelSm text-onSurfaceVariant">{event.type}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-labelSm font-medium ${
                        event.status === 'Normal' || event.status === 'Taken' || event.status === 'Complete' || event.status === 'Completed' || event.status === 'Attended' 
                          ? 'bg-emeraldGreen/10 text-emeraldGreen' 
                          : 'bg-amber-500/10 text-amber-600'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                    <h3 className="font-labelMd font-semibold text-onSurface mb-xs">{event.title}</h3>
                    <p className="text-bodySm text-onSurfaceVariant">{event.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {error && (
            <div className="mt-md p-sm bg-error/10 text-error rounded-lg text-bodySm">
              {error}
            </div>
          )}
        </div>

        {/* Health Trends Chart */}
        <div className="mt-xl">
          <h2 className="font-labelMd font-semibold text-onSurface mb-lg">Health Trends</h2>
          <div className="bg-white border border-outlineVariant rounded-xl p-lg shadow-sm">
            <div className="flex justify-between items-center mb-md">
              <div className="flex gap-md">
                <button className="text-labelSm font-bold text-primary">Heart Rate</button>
                <button className="text-labelSm font-medium text-onSurfaceVariant">Blood Pressure</button>
                <button className="text-labelSm font-medium text-onSurfaceVariant">Weight</button>
              </div>
            </div>
            <div className="h-64 relative flex items-end justify-between px-md pt-lg">
              <div className="absolute inset-0 flex items-end justify-between px-md pb-lg">
                <div className="w-8 bg-primary/20 h-32 rounded-t"></div>
                <div className="w-8 bg-primary/20 h-36 rounded-t"></div>
                <div className="w-8 bg-primary/20 h-40 rounded-t"></div>
                <div className="w-8 bg-primary/20 h-34 rounded-t"></div>
                <div className="w-8 bg-primary/20 h-38 rounded-t"></div>
                <div className="w-8 bg-primary/20 h-42 rounded-t"></div>
                <div className="w-8 bg-primary h-48 rounded-t relative">
                  <div className="absolute -top-8 -left-4 bg-primary text-white text-[10px] px-2 py-1 rounded-full whitespace-nowrap">72 bpm</div>
                </div>
              </div>
              <div className="flex flex-col justify-between h-full text-[10px] text-outline font-medium w-full pointer-events-none">
                <div className="border-t border-outlineVariant/30 w-full pt-1">100 bpm</div>
                <div className="border-t border-outlineVariant/30 w-full pt-1">80 bpm</div>
                <div className="border-t border-outlineVariant/30 w-full pt-1">60 bpm</div>
                <div className="border-t border-outlineVariant/30 w-full pt-1">40 bpm</div>
              </div>
            </div>
            <div className="flex justify-between px-md mt-sm text-[10px] text-outline">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="mt-xl">
          <h2 className="font-labelMd font-semibold text-onSurface mb-lg">AI Insights</h2>
          <div className="bg-white border border-outlineVariant rounded-xl p-lg shadow-sm">
            <div className="flex items-start gap-md mb-md">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              </div>
              <div>
                <h3 className="font-labelMd font-semibold text-onSurface mb-xs">Trend Analysis</h3>
                <p className="text-bodySm text-onSurfaceVariant leading-relaxed">
                  Your heart rate has been stable over the past week with an average of 72 bpm. This indicates good cardiovascular health. Continue your current exercise routine.
                </p>
              </div>
            </div>
            <div className="flex gap-md">
              <div className="flex-1 p-sm bg-emeraldGreen/5 rounded-lg">
                <span className="font-bodySm font-medium text-onSurface">Heart Rate</span>
                <p className="text-bodySm text-emeraldGreen">Stable & Healthy</p>
              </div>
              <div className="flex-1 p-sm bg-emeraldGreen/5 rounded-lg">
                <span className="font-bodySm font-medium text-onSurface">Activity Level</span>
                <p className="text-bodySm text-emeraldGreen">Above Average</p>
              </div>
              <div className="flex-1 p-sm bg-blue-500/5 rounded-lg">
                <span className="font-bodySm font-medium text-onSurface">Sleep Quality</span>
                <p className="text-bodySm text-blue-600">Good</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
