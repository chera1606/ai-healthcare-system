import { useState } from 'react';
import { useMedications } from '../hooks/useMedications';
import { MEDICATION_STATUS } from '../constants';

interface MedicationProps {
  activeTab: string;
}

export default function Medication({ activeTab }: MedicationProps) {
  const { medications, adherence, loading, error, markAsTaken } = useMedications();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleMarkAsTaken = async (id: string) => {
    try {
      await markAsTaken(id);
    } catch (error) {
      console.error('Failed to mark medication as taken:', error);
    }
  };

  return (
    <main className="flex-1 h-screen overflow-y-auto custom-scrollbar px-marginDesktop py-lg bg-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-xl">
          <h1 className="font-headlineLg text-headlineLg text-slate-900 mb-sm">Medication Management</h1>
          <p className="text-slate-500 font-bodyMd">Track your medications, set reminders, and monitor adherence.</p>
        </div>

        {/* Adherence Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-xl">
          <div className="glass-card rounded-xl p-lg shadow-sm">
            <div className="flex items-center justify-between mb-md">
              <span className="font-labelMd text-slate-500">Weekly Adherence</span>
              <span className="material-symbols-outlined text-emerald-600">trending_up</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-displayLg font-displayLg text-slate-800">{adherence?.weekly || 92}%</span>
              <span className="text-labelSm text-emerald-600 mb-2 font-bold">+5%</span>
            </div>
            <p className="text-bodySm text-slate-400 mt-xs">Excellent progress this week</p>
          </div>
          <div className="glass-card rounded-xl p-lg shadow-sm">
            <div className="flex items-center justify-between mb-md">
              <span className="font-labelMd text-slate-500">Medications Active</span>
              <span className="material-symbols-outlined text-blue-600">medication</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-displayLg font-displayLg text-slate-800">{adherence?.medicationsActive || medications.length}</span>
              <span className="text-labelSm text-slate-400 mb-2">total</span>
            </div>
            <p className="text-bodySm text-slate-400 mt-xs">All medications on schedule</p>
          </div>
          <div className="glass-card rounded-xl p-lg shadow-sm">
            <div className="flex items-center justify-between mb-md">
              <span className="font-labelMd text-slate-500">Next Reminder</span>
              <span className="material-symbols-outlined text-blue-600">alarm</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-displayLg font-displayLg text-blue-600">{adherence?.nextReminder || '10:00'}</span>
              <span className="text-labelSm text-slate-400 mb-2">PM</span>
            </div>
            <p className="text-bodySm text-slate-400 mt-xs">Atorvastatin due today</p>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="mb-xl">
          <div className="flex justify-between items-center mb-lg">
            <h2 className="font-labelMd font-semibold text-slate-800">Today's Schedule</h2>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-lg py-md bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-labelMd hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-blue-200"
            >
              <span className="material-symbols-outlined">add</span>
              Add Medication
            </button>
          </div>

          {loading && medications.length === 0 ? (
            <div className="text-center py-xl glass-card rounded-xl border-slate-200">
              <span className="material-symbols-outlined text-4xl text-blue-600 animate-spin">refresh</span>
              <p className="text-bodySm text-slate-500 mt-sm">Loading medications...</p>
            </div>
          ) : medications.length === 0 ? (
            <div className="text-center py-xl glass-card rounded-xl border-slate-200">
              <span className="material-symbols-outlined text-4xl text-slate-400">medication</span>
              <p className="text-bodySm text-slate-500 mt-sm">No medications scheduled</p>
            </div>
          ) : (
            <div className="glass-card rounded-xl shadow-sm overflow-hidden flex flex-col">
              {medications.map((med, index) => (
                <div key={med.id} className={`flex items-center gap-md p-lg ${index !== medications.length - 1 ? 'border-b border-slate-200/60' : ''}`}>
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 flex-shrink-0 border border-blue-500/20">
                    <span className="material-symbols-outlined text-[24px]">{med.icon}</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-xs">
                      <span className="font-labelMd font-semibold text-slate-800">{med.name}</span>
                      <span className="text-labelSm text-slate-500">{med.dosage}</span>
                    </div>
                    <div className="flex items-center gap-4 text-bodySm text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        {med.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">repeat</span>
                        {med.frequency}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-md">
                    <span className={`px-3 py-1 rounded-full text-labelSm font-semibold border ${
                      med.status === MEDICATION_STATUS.TAKEN ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                      med.status === MEDICATION_STATUS.PENDING ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                      med.status === MEDICATION_STATUS.PARTIAL ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                      'bg-rose-500/10 text-rose-600 border-rose-500/20'
                    }`}>
                      {med.status}
                    </span>
                    {med.status === MEDICATION_STATUS.PENDING && (
                      <button
                        onClick={() => handleMarkAsTaken(med.id)}
                        className="px-sm py-1 bg-emerald-500 hover:bg-emerald-400 text-white rounded text-labelSm font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-emerald-200"
                      >
                        Mark Taken
                      </button>
                    )}
                    <button className="p-sm hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
                      <span className="material-symbols-outlined text-slate-500">more_vert</span>
                    </button>
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

        {/* Medication History */}
        <div className="mb-xl">
          <h2 className="font-labelMd font-semibold text-slate-800 mb-lg">Adherence History</h2>
          <div className="glass-card rounded-xl p-lg shadow-sm">
            <div className="flex items-end justify-between h-48 mb-md gap-2">
              {adherence?.history ? (
                adherence.history.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-blue-500/10 rounded-t-lg relative" style={{ height: '100%' }}>
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-blue-600 rounded-t-lg transition-all shadow-[0_-2px_10px_rgba(37,99,235,0.15)]" 
                        style={{ height: `${day.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-[11px] text-slate-500">{day.day}</span>
                  </div>
                ))
              ) : (
                ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                  const height = [80, 100, 90, 95, 85, 100, 92][index];
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-blue-500/10 rounded-t-lg relative animate-pulse" style={{ height: '100%' }}>
                        <div className="absolute bottom-0 left-0 right-0 bg-blue-600 rounded-t-lg shadow-[0_-2px_10px_rgba(37,99,235,0.15)]" style={{ height: `${height}%` }}></div>
                      </div>
                      <span className="text-[11px] text-slate-500">{day}</span>
                    </div>
                  );
                })
              )}
            </div>
            <div className="flex items-center justify-between text-bodySm text-slate-500 border-t border-slate-100 pt-md mt-sm">
              <span>Average Rate: <strong className="text-blue-600">90%</strong></span>
              <span>Best Day: <strong className="text-emerald-600 font-bold">Tuesday (100%)</strong></span>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div>
          <h2 className="font-labelMd font-semibold text-slate-800 mb-lg">AI Recommendations</h2>
          <div className="glass-card rounded-xl p-lg shadow-sm">
            <div className="flex items-start gap-md mb-md">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              </div>
              <div>
                <h3 className="font-labelMd font-semibold text-slate-800 mb-xs">Optimization Suggestions</h3>
                <p className="text-bodySm text-slate-500 leading-relaxed">
                  Based on your adherence patterns, here are some suggestions:
                </p>
              </div>
            </div>
            <div className="space-y-md">
              <div className="flex items-start gap-md p-sm bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                <span className="material-symbols-outlined text-emerald-600 text-[20px]">check_circle</span>
                <div>
                  <span className="font-bodySm font-semibold text-slate-700">Morning routine optimization</span>
                  <p className="text-bodySm text-slate-500">Consider taking all morning medications together at 08:00 AM</p>
                </div>
              </div>
              <div className="flex items-start gap-md p-sm bg-blue-500/5 border border-blue-500/10 rounded-lg">
                <span className="material-symbols-outlined text-blue-600 text-[20px]">info</span>
                <div>
                  <span className="font-bodySm font-semibold text-slate-700">Reminder adjustment</span>
                  <p className="text-bodySm text-slate-500">Evening reminder could be set 15 minutes earlier for better adherence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
