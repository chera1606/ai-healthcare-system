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
    <main className="flex-1 h-screen overflow-y-auto custom-scrollbar px-marginDesktop py-lg bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-xl">
          <h1 className="font-headlineLg text-headlineLg text-onSurface mb-sm">Hospital Finder</h1>
          <p className="text-onSurfaceVariant font-bodyMd">Find nearby hospitals and emergency care facilities with real-time information.</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white border border-outlineVariant rounded-xl p-lg shadow-sm mb-xl">
          <div className="flex flex-col md:flex-row gap-md mb-md">
            <div className="flex-grow relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-onSurfaceVariant">search</span>
              <input 
                className="w-full border border-outlineVariant rounded-lg pl-10 pr-4 py-md text-bodyMd focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
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
              className="px-lg py-md bg-primary text-white rounded-lg font-labelMd hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                className={`px-sm py-1 rounded-full text-labelSm font-medium transition-all ${
                  filter === type 
                    ? 'bg-primary text-white' 
                    : 'bg-surfaceContainer text-onSurfaceVariant hover:bg-surfaceContainerHigh'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          {error && (
            <div className="mt-md p-sm bg-error/10 text-error rounded-lg text-bodySm">
              {error}
            </div>
          )}
        </div>

        {/* Map Section */}
        <div className="bg-white border border-outlineVariant rounded-xl overflow-hidden shadow-sm mb-xl h-80 relative">
          <div className="w-full h-full bg-slate-200 flex items-center justify-center">
            <div className="text-center">
              <span className="material-symbols-outlined text-6xl text-slate-400">map</span>
              <p className="text-slate-500 text-sm mt-2">Interactive Map</p>
              <p className="text-slate-400 text-xs mt-1">Showing {filteredHospitals.length} hospitals in your area</p>
            </div>
          </div>
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-sm flex gap-1">
            <button 
              onClick={handleLocationSearch}
              className="p-sm hover:bg-surfaceContainer rounded-lg transition-colors"
              title="Use my location"
              disabled={loading}
            >
              <span className="material-symbols-outlined text-onSurfaceVariant">my_location</span>
            </button>
            <button className="p-sm hover:bg-surfaceContainer rounded-lg transition-colors" title="Zoom in">
              <span className="material-symbols-outlined text-onSurfaceVariant">zoom_in</span>
            </button>
            <button className="p-sm hover:bg-surfaceContainer rounded-lg transition-colors" title="Zoom out">
              <span className="material-symbols-outlined text-onSurfaceVariant">zoom_out</span>
            </button>
          </div>
        </div>

        {/* Hospital List */}
        <div>
          <div className="flex justify-between items-center mb-lg">
            <h2 className="font-labelMd font-semibold text-onSurface">Nearby Hospitals</h2>
            <span className="text-labelSm text-onSurfaceVariant">{filteredHospitals.length} results found</span>
          </div>

          {loading && hospitals.length === 0 ? (
            <div className="text-center py-xl bg-white border border-outlineVariant rounded-xl">
              <span className="material-symbols-outlined text-4xl text-outlineVariant animate-spin">refresh</span>
              <p className="text-bodySm text-onSurfaceVariant mt-sm">Searching hospitals...</p>
            </div>
          ) : filteredHospitals.length === 0 ? (
            <div className="text-center py-xl bg-white border border-outlineVariant rounded-xl">
              <span className="material-symbols-outlined text-4xl text-outlineVariant">local_hospital</span>
              <p className="text-bodySm text-onSurfaceVariant mt-sm">No hospitals found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredHospitals.map((hospital) => (
                <div key={hospital.id} className="bg-white border border-outlineVariant rounded-xl p-lg shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between mb-md">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        hospital.emergency ? 'bg-crimsonRed/10 text-crimsonRed' : 'bg-primary/10 text-primary'
                      }`}>
                        <span className="material-symbols-outlined text-[24px]">{hospital.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-labelMd font-semibold text-onSurface mb-xs">{hospital.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-labelSm text-onSurfaceVariant">
                            <span className="material-symbols-outlined text-[16px]">star</span>
                            {hospital.rating}
                          </span>
                          <span className="text-labelSm text-outline">•</span>
                          <span className="text-labelSm text-onSurfaceVariant">{hospital.type}</span>
                        </div>
                      </div>
                    </div>
                    {hospital.emergency && (
                      <span className="px-2 py-1 bg-crimsonRed/10 text-crimsonRed rounded text-labelSm font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">emergency</span>
                        24/7
                      </span>
                    )}
                  </div>

                  <div className="space-y-sm mb-md">
                    <div className="flex items-center gap-2 text-bodySm text-onSurfaceVariant">
                      <span className="material-symbols-outlined text-[18px]">location_on</span>
                      {hospital.address}
                    </div>
                    <div className="flex items-center gap-4 text-bodySm text-onSurfaceVariant">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px]">directions_car</span>
                        {hospital.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px]">schedule</span>
                        Wait: {hospital.waitTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-sm">
                    <button className="flex-1 flex items-center justify-center gap-2 py-sm bg-primary text-white rounded-lg font-labelMd hover:opacity-90 transition-all">
                      <span className="material-symbols-outlined text-[18px]">directions</span>
                      Get Directions
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-sm bg-surfaceContainer text-onSurface rounded-lg font-labelMd hover:bg-surfaceContainerHigh transition-all">
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
          <div className="bg-crimsonRed border border-crimsonRed rounded-xl p-lg shadow-sm">
            <div className="flex items-center gap-md">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white flex-shrink-0">
                <span className="material-symbols-outlined text-[32px]">emergency</span>
              </div>
              <div className="flex-grow">
                <h2 className="font-headlineMd text-headlineMd text-white mb-xs">Emergency Assistance</h2>
                <p className="text-bodySm text-white/90">If you're experiencing a medical emergency, call 911 immediately.</p>
              </div>
              <button className="px-lg py-md bg-white text-crimsonRed rounded-lg font-bold font-labelMd hover:bg-white/90 transition-all">
                Call 911
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
