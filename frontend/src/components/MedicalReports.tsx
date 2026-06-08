import { useState, useRef } from 'react';
import { useReports } from '../hooks/useReports';
import { formatDate } from '../utils/formatDate';
import { REPORT_TYPES } from '../constants';

interface MedicalReportsProps {
  activeTab: string;
}

export default function MedicalReports({ activeTab }: MedicalReportsProps) {
  const { reports, loading, error, uploadReport, deleteReport } = useReports();
  const [filter, setFilter] = useState<string>('All');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredReports = reports.filter(report => {
    if (filter === 'All') return true;
    return report.type === filter;
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      await uploadReport(file);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to upload report:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload report');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await deleteReport(id);
      } catch (error) {
        console.error('Failed to delete report:', error);
      }
    }
  };

  return (
    <main className="flex-1 h-screen overflow-y-auto custom-scrollbar px-marginDesktop py-lg bg-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-xl">
          <h1 className="font-headlineLg text-headlineLg text-slate-900 mb-sm">Medical Reports</h1>
          <p className="text-slate-500 font-bodyMd">View and manage your medical reports with AI-powered insights.</p>
        </div>

        {/* Upload Section */}
        <div className="mb-xl">
          <div className="glass-card rounded-xl p-lg shadow-sm">
            <div className="flex items-center justify-between mb-lg flex-wrap gap-4">
              <div>
                <h2 className="font-labelMd font-semibold text-slate-800 mb-xs">Upload New Report</h2>
                <p className="text-bodySm text-slate-500">Supported formats: PDF, JPG, PNG, DICOM</p>
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-lg py-md bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-labelMd hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-200"
                disabled={loading}
              >
                <span className="material-symbols-outlined">{loading ? 'hourglass_empty' : 'upload_file'}</span>
                {loading ? 'Uploading...' : 'Upload Report'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.jpg,.jpeg,.png,.dcm"
              />
            </div>
            <div 
              className={`border-2 border-dashed rounded-xl p-xl text-center transition-all cursor-pointer ${
                isDragging ? 'border-blue-500 bg-blue-500/5' : 'border-slate-300 hover:border-blue-500/40'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="material-symbols-outlined text-6xl text-slate-400 mb-sm">cloud_upload</span>
              <p className="font-bodyMd text-slate-700 mb-xs font-semibold">Drag and drop your medical reports here</p>
              <p className="text-bodySm text-slate-500">or click to browse files</p>
            </div>
            {error && (
              <div className="mt-md p-sm bg-rose-500/10 text-rose-600 border border-rose-500/15 rounded-lg text-bodySm font-semibold">
                {error}
              </div>
            )}
            {uploadSuccess && (
              <div className="mt-md p-sm bg-emerald-500/10 text-emerald-600 border border-emerald-500/15 rounded-lg text-bodySm font-semibold">
                Report uploaded successfully!
              </div>
            )}
          </div>
        </div>

        {/* Reports Grid */}
        <div>
          <div className="flex justify-between items-center mb-lg">
            <h2 className="font-labelMd font-semibold text-slate-800">Your Reports</h2>
            <div className="flex gap-md">
              {['All', ...Object.values(REPORT_TYPES)].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`text-labelSm font-medium transition-all ${
                    filter === type 
                      ? 'text-blue-600 font-bold border-b-2 border-blue-500 pb-1' 
                      : 'text-slate-400 hover:text-slate-600 pb-1'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {loading && reports.length === 0 ? (
            <div className="text-center py-xl">
              <span className="material-symbols-outlined text-4xl text-blue-600 animate-spin">refresh</span>
              <p className="text-bodySm text-slate-500 mt-sm font-semibold">Loading reports...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-xl glass-card rounded-xl border-slate-200">
              <span className="material-symbols-outlined text-4xl text-slate-400">folder_open</span>
              <p className="text-bodySm text-slate-500 mt-sm">No reports found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <div key={report.id} className="glass-card glass-card-hover rounded-xl p-lg shadow-sm hover:shadow-md cursor-pointer group">
                  <div className="flex items-start justify-between mb-md">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 border border-blue-500/20">
                      <span className="material-symbols-outlined text-[24px]">{report.icon}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-labelSm font-semibold border ${
                        report.status === 'Analyzed' 
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                          : report.status === 'Pending'
                          ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                      }`}>
                        {report.status}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(report.id);
                        }}
                        className="text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all p-1 hover:bg-slate-100 rounded"
                        title="Delete report"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                  <h3 className="font-labelMd font-semibold text-slate-800 mb-xs">{report.name}</h3>
                  <p className="text-bodySm text-slate-500 mb-md">{formatDate(report.date)}</p>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-sm mt-sm">
                    <span className="text-labelSm text-slate-400">{report.type}</span>
                    <button className="text-blue-600 hover:text-blue-500 text-labelSm font-bold transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Insights Section */}
        <div className="mt-xl">
          <h2 className="font-labelMd font-semibold text-slate-800 mb-lg">AI Insights</h2>
          <div className="glass-card rounded-xl p-lg shadow-sm">
            <div className="flex items-start gap-md mb-md">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              </div>
              <div>
                <h3 className="font-labelMd font-semibold text-slate-800 mb-xs">Recent Analysis Summary</h3>
                <p className="text-bodySm text-slate-500 leading-relaxed">
                  Based on your latest reports, your overall health status is good. Key observations:
                </p>
              </div>
            </div>
            <div className="space-y-md">
              <div className="flex items-start gap-md p-sm bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                <span className="material-symbols-outlined text-emerald-600 text-[20px]">check_circle</span>
                <div>
                  <span className="font-bodySm font-semibold text-slate-700">Cholesterol levels improved</span>
                  <p className="text-bodySm text-slate-500">Down from 195 to 180 mg/dL since last check</p>
                </div>
              </div>
              <div className="flex items-start gap-md p-sm bg-amber-500/5 border border-amber-500/10 rounded-lg">
                <span className="material-symbols-outlined text-amber-600 text-[20px]">warning</span>
                <div>
                  <span className="font-bodySm font-semibold text-slate-700">Vitamin D slightly low</span>
                  <p className="text-bodySm text-slate-500">Consider increasing supplement dosage</p>
                </div>
              </div>
              <div className="flex items-start gap-md p-sm bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                <span className="material-symbols-outlined text-emerald-600 text-[20px]">check_circle</span>
                <div>
                  <span className="font-bodySm font-semibold text-slate-700">Blood pressure stable</span>
                  <p className="text-bodySm text-slate-500">Consistent readings within normal range</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
