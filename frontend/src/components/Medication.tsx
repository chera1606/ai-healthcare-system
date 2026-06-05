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
    <main className="flex-1 h-screen overflow-y-auto custom-scrollbar px-marginDesktop py-lg bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-xl">
          <h1 className="font-headlineLg text-headlineLg text-onSurface mb-sm">Medication Management</h1>
          <p className="text-onSurfaceVariant font-bodyMd">Track your medications, set reminders, and monitor adherence.</p>
        </div>

        {/* Adherence Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-xl">
          <div className="bg-white border border-outlineVariant rounded-xl p-lg shadow-sm">
            <div className="flex items-center justify-between mb-md">
              <span className="font-labelMd text-onSurfaceVariant">Weekly Adherence</span>
              <span className="material-symbols-outlined text-emeraldGreen">trending_up</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-displayLg font-displayLg text-onSurface">{adherence?.weekly || 92}%</span>
              <span className="text-labelSm text-emeraldGreen mb-2">+5%</span>
            </div>
            <p className="text-bodySm text-onSurfaceVariant mt-xs">Excellent progress this week</p>
          </div>
          <div className="bg-white border border-outlineVariant rounded-xl p-lg shadow-sm">
            <div className="flex items-center justify-between mb-md">
              <span className="font-labelMd text-onSurfaceVariant">Medications Active</span>
              <span className="material-symbols-outlined text-primary">medication</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-displayLg font-displayLg text-onSurface">{adherence?.medicationsActive || medications.length}</span>
              <span className="text-labelSm text-onSurfaceVariant mb-2">total</span>
            </div>
            <p className="text-bodySm text-onSurfaceVariant mt-xs">All medications on schedule</p>
          </div>
          <div className="bg-white border border-outlineVariant rounded-xl p-lg shadow-sm">
            <div className="flex items-center justify-between mb-md">
              <span className="font-labelMd text-onSurfaceVariant">Next Reminder</span>
              <span className="material-symbols-outlined text-tertiary">alarm</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-displayLg font-displayLg text-onSurface">{adherence?.nextReminder || '10:00'}</span>
              <span className="text-labelSm text-onSurfaceVariant mb-2">PM</span>
            </div>
            <p className="text-bodySm text-onSurfaceVariant mt-xs">Atorvastatin due today</p>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="mb-xl">
          <div className="flex justify-between items-center mb-lg">
            <h2 className="font-labelMd font-semibold text-onSurface">Today's Schedule</h2>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-lg py-md bg-primary text-white rounded-lg font-labelMd hover:opacity-90 transition-all"
            >
              <span className="material-symbols-outlined">add</span>
              Add Medication
            </button>
          </div>

          {loading && medications.length === 0 ? (
            <div className="text-center py-xl bg-white border border-outlineVariant rounded-xl">
              <span className="material-symbols-outlined text-4xl text-outlineVariant animate-spin">refresh</span>
              <p className="text-bodySm text-onSurfaceVariant mt-sm">Loading medications...</p>
            </div>
          ) : medications.length === 0 ? (
            <div className="text-center py-xl bg-white border border-outlineVariant rounded-xl">
              <span className="material-symbols-outlined text-4xl text-outlineVariant">medication</span>
              <p className="text-bodySm text-onSurfaceVariant mt-sm">No medications scheduled</p>
            </div>
          ) : (
            <div className="bg-white border border-outlineVariant rounded-xl shadow-sm overflow-hidden">
              {medications.map((med, index) => (
                <div key={med.id} className={`flex items-center gap-md p-lg ${index !== medications.length - 1 ? 'border-b border-outlineVariant' : ''}`}>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <span className="material-symbols-outlined text-[24px]">{med.icon}</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-xs">
                      <span className="font-labelMd font-semibold text-onSurface">{med.name}</span>
                      <span className="text-labelSm text-onSurfaceVariant">{med.dosage}</span>
                    </div>
                    <div className="flex items-center gap-4 text-bodySm text-onSurfaceVariant">
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
                    <span className={`px-3 py-1 rounded-full text-labelSm font-medium ${
                      med.status === MEDICATION_STATUS.TAKEN ? 'bg-emeraldGreen/10 text-emeraldGreen' :
                      med.status === MEDICATION_STATUS.PENDING ? 'bg-amber-500/10 text-amber-600' :
                      med.status === MEDICATION_STATUS.PARTIAL ? 'bg-blue-500/10 text-blue-600' :
                      'bg-crimsonRed/10 text-crimsonRed'
                    }`}>
                      {med.status}
                    </span>
                    {med.status === MEDICATION_STATUS.PENDING && (
                      <button
                        onClick={() => handleMarkAsTaken(med.id)}
                        className="px-sm py-1 bg-emeraldGreen text-white rounded text-labelSm font-medium hover:opacity-90 transition-all"
                      >
                        Mark Taken
                      </button>
                    )}
                    <button className="p-sm hover:bg-surfaceContainer rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-onSurfaceVariant">more_vert</span>
                    </button>
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

        {/* Medication History */}
        <div className="mb-xl">
          <h2 className="font-labelMd font-semibold text-onSurface mb-lg">Adherence History</h2>
          <div className="bg-white border border-outlineVariant rounded-xl p-lg shadow-sm">
            <div className="flex items-end justify-between h-48 mb-md">
              {adherence?.history ? (
                adherence.history.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-primary/20 rounded-t-lg relative" style={{ height: '100%' }}>
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-lg transition-all" 
                        style={{ height: `${day.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-labelSm text-onSurfaceVariant">{day.day}</span>
                  </div>
                ))
              ) : (
                ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                  const height = [80, 100, 90, 95, 85, 100, 92][index];
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-primary/20 rounded-t-lg relative" style={{ height: '100%' }}>
                        <div className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-lg" style={{ height: `${height}%` }}></div>
                      </div>
                      <span className="text-labelSm text-onSurfaceVariant">{day}</span>
                    </div>
                  );
                })
              )}
            </div>
            <div className="flex items-center justify-between text-bodySm text-onSurfaceVariant">
              <span>Average: 90%</span>
              <span>Best Day: Tuesday (100%)</span>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div>
          <h2 className="font-labelMd font-semibold text-onSurface mb-lg">AI Recommendations</h2>
          <div className="bg-white border border-outlineVariant rounded-xl p-lg shadow-sm">
            <div className="flex items-start gap-md mb-md">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              </div>
              <div>
                <h3 className="font-labelMd font-semibold text-onSurface mb-xs">Optimization Suggestions</h3>
                <p className="text-bodySm text-onSurfaceVariant leading-relaxed">
                  Based on your adherence patterns, here are some suggestions:
                </p>
              </div>
            </div>
            <div className="space-y-md">
              <div className="flex items-start gap-md p-sm bg-emeraldGreen/5 rounded-lg">
                <span className="material-symbols-outlined text-emeraldGreen text-[20px]">check_circle</span>
                <div>
                  <span className="font-bodySm font-medium text-onSurface">Morning routine optimization</span>
                  <p className="text-bodySm text-onSurfaceVariant">Consider taking all morning medications together at 08:00 AM</p>
                </div>
              </div>
              <div className="flex items-start gap-md p-sm bg-blue-500/5 rounded-lg">
                <span className="material-symbols-outlined text-blue-600 text-[20px]">info</span>
                <div>
                  <span className="font-bodySm font-medium text-onSurface">Reminder adjustment</span>
                  <p className="text-bodySm text-onSurfaceVariant">Evening reminder could be set 15 minutes earlier for better adherence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
