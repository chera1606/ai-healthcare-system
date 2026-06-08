import { useState } from 'react';
import { useHospitalFinder } from '../hooks/useHospitalFinder';
import { HOSPITAL_TYPES } from '../constants';

interface HospitalFinderProps {
  activeTab: string;
}

export default function HospitalFinder({ activeTab }: HospitalFinderProps) {
  const { hospitals, loading, error, searchHospitals, findNearbyCurrentLocation } = useHospitalFinder();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<string>('All');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      await searchHospitals(searchQuery, filter !== 'All' ? { type: filter } : undefined);
    } catch (error) {
      console.error('Failed to search hospitals:', error);
    }
  };

  const handleLocationSearch = async () => {
    try {
      await findNearbyCurrentLocation();
    } catch (error) {
      console.error('Failed to get location:', error);
    }
  };

  const filteredHospitals = hospitals.filter(hospital => {
    if (filter === 'All') return true;
    if (filter === 'Emergency') return hospital.emergency;
    return hospital.type === filter;
  });

  return (
    <main className="flex-1 h-screen overflow-y-auto custom-scrollbar px-marginDesktop py-lg bg-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-xl">
          <h1 className="font-headlineLg text-headlineLg text-slate-900 mb-sm">Hospital Finder</h1>
          <p className="text-slate-500 font-bodyMd">Find nearby hospitals and emergency care facilities with real-time information.</p>
        </div>

        {/* Search and Filter */}
        <div className="glass-card rounded-xl p-lg shadow-sm mb-xl">
          <div className="flex flex-col md:flex-row gap-md mb-md">
            <div className="flex-grow relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input 
                className="w-full glass-input rounded-lg pl-10 pr-4 py-md text-bodyMd" 
                placeholder="Search hospitals by name or specialty..." 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                disabled={loading}
              />
            </div>
            <button 
              onClick={handleSearch}
              className="px-lg py-md bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-labelMd hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/15"
              disabled={loading || !searchQuery.trim()}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          <div className="flex flex-wrap gap-sm">
            {['All', 'Emergency', ...Object.values(HOSPITAL_TYPES)].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-sm py-1 rounded-full text-labelSm font-semibold transition-all ${
                  filter === type 
                    ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-[0_0_12px_rgba(37,99,235,0.08)]' 
                    : 'bg-slate-50 text-slate-500 border border-slate-200/60 hover:bg-blue-50/50 hover:text-blue-500'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          {error && (
            <div className="mt-md p-sm bg-rose-50 text-rose-600 border border-rose-200/60 rounded-lg text-bodySm">
              {error}
            </div>
          )}
        </div>

        {/* Map Section */}
        <div className="glass-card rounded-xl overflow-hidden shadow-sm mb-xl h-80 relative">
          <div className="w-full h-full bg-gradient-to-br from-blue-50/60 to-slate-100/40 flex items-center justify-center">
            <div className="text-center">
              <span className="material-symbols-outlined text-6xl text-blue-300">map</span>
              <p className="text-slate-500 text-sm mt-2 font-medium">Interactive Map</p>
              <p className="text-slate-400 text-xs mt-1">Showing {filteredHospitals.length} hospitals in your area</p>
            </div>
          </div>
          <div className="absolute top-4 right-4 bg-white/80 border border-slate-200/50 backdrop-blur-md rounded-lg shadow-md p-sm flex gap-1">
            <button 
              onClick={handleLocationSearch}
              className="p-sm hover:bg-blue-50 rounded-lg transition-colors text-slate-500 hover:text-blue-600"
              title="Use my location"
              disabled={loading}
            >
              <span className="material-symbols-outlined text-[20px]">my_location</span>
            </button>
            <button className="p-sm hover:bg-blue-50 rounded-lg transition-colors text-slate-500 hover:text-blue-600" title="Zoom in">
              <span className="material-symbols-outlined text-[20px]">zoom_in</span>
            </button>
            <button className="p-sm hover:bg-blue-50 rounded-lg transition-colors text-slate-500 hover:text-blue-600" title="Zoom out">
              <span className="material-symbols-outlined text-[20px]">zoom_out</span>
            </button>
          </div>
        </div>

        {/* Hospital List */}
        <div>
          <div className="flex justify-between items-center mb-lg">
            <h2 className="font-labelMd font-semibold text-slate-800">Nearby Hospitals</h2>
            <span className="text-labelSm text-slate-400">{filteredHospitals.length} results found</span>
          </div>

          {loading && hospitals.length === 0 ? (
            <div className="text-center py-xl glass-card rounded-xl">
              <span className="material-symbols-outlined text-4xl text-blue-400 animate-spin">refresh</span>
              <p className="text-bodySm text-slate-500 mt-sm">Searching hospitals...</p>
            </div>
          ) : filteredHospitals.length === 0 ? (
            <div className="text-center py-xl glass-card rounded-xl">
              <span className="material-symbols-outlined text-4xl text-slate-300">local_hospital</span>
              <p className="text-bodySm text-slate-500 mt-sm">No hospitals found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredHospitals.map((hospital) => (
                <div key={hospital.id} className="glass-card glass-card-hover rounded-xl p-lg shadow-sm group">
                  <div className="flex items-start justify-between mb-md">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${
                        hospital.emergency ? 'bg-rose-50 text-rose-500 border-rose-200/60' : 'bg-blue-50 text-blue-500 border-blue-200/60'
                      }`}>
                        <span className="material-symbols-outlined text-[24px]">{hospital.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-labelMd font-semibold text-slate-800 mb-xs">{hospital.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-labelSm text-slate-500">
                            <span className="material-symbols-outlined text-[16px] text-amber-500">star</span>
                            {hospital.rating}
                          </span>
                          <span className="text-labelSm text-slate-300">•</span>
                          <span className="text-labelSm text-slate-500">{hospital.type}</span>
                        </div>
                      </div>
                    </div>
                    {hospital.emergency && (
                      <span className="px-2 py-1 bg-rose-50 text-rose-500 border border-rose-200/60 rounded text-labelSm font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">emergency</span>
                        24/7
                      </span>
                    )}
                  </div>

                  <div className="space-y-sm mb-md">
                    <div className="flex items-center gap-2 text-bodySm text-slate-500">
                      <span className="material-symbols-outlined text-[18px]">location_on</span>
                      {hospital.address}
                    </div>
                    <div className="flex items-center gap-4 text-bodySm text-slate-500">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px] text-blue-500">directions_car</span>
                        {hospital.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px] text-indigo-400">schedule</span>
                        Wait: {hospital.waitTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-sm">
                    <button className="flex-1 flex items-center justify-center gap-2 py-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-labelMd hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-blue-500/15">
                      <span className="material-symbols-outlined text-[18px]">directions</span>
                      Get Directions
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-sm bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60 rounded-lg font-labelMd transition-all active:scale-[0.98]">
                      <span className="material-symbols-outlined text-[18px]">call</span>
                      Call
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Emergency Section */}
        <div className="mt-xl">
          <div className="bg-rose-50/70 border border-rose-200/60 rounded-xl p-lg shadow-sm">
            <div className="flex items-center gap-md flex-wrap">
              <div className="w-16 h-16 rounded-full bg-rose-100 border border-rose-200/60 flex items-center justify-center text-rose-500 flex-shrink-0">
                <span className="material-symbols-outlined text-[32px]">emergency</span>
              </div>
              <div className="flex-grow min-w-[200px]">
                <h2 className="font-headlineMd text-headlineMd text-slate-900 mb-xs">Emergency Assistance</h2>
                <p className="text-bodySm text-slate-600">If you're experiencing a medical emergency, call 911 immediately.</p>
              </div>
              <button className="px-lg py-md bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold font-labelMd transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-rose-500/20">
                Call 911
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
