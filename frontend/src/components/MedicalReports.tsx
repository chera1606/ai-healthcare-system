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
    <main className="flex-1 h-screen overflow-y-auto custom-scrollbar px-marginDesktop py-lg bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-xl">
          <h1 className="font-headlineLg text-headlineLg text-onSurface mb-sm">Medical Reports</h1>
          <p className="text-onSurfaceVariant font-bodyMd">View and manage your medical reports with AI-powered insights.</p>
        </div>

        {/* Upload Section */}
        <div className="mb-xl">
          <div className="bg-white border border-outlineVariant rounded-xl p-lg shadow-sm">
            <div className="flex items-center justify-between mb-lg">
              <div>
                <h2 className="font-labelMd font-semibold text-onSurface mb-xs">Upload New Report</h2>
                <p className="text-bodySm text-onSurfaceVariant">Supported formats: PDF, JPG, PNG, DICOM</p>
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-lg py-md bg-primary text-white rounded-lg font-labelMd hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                isDragging ? 'border-primary bg-primary/5' : 'border-outlineVariant hover:border-primary'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="material-symbols-outlined text-6xl text-outlineVariant mb-sm">cloud_upload</span>
              <p className="font-bodyMd text-onSurfaceVariant mb-xs">Drag and drop your medical reports here</p>
              <p className="text-bodySm text-outline">or click to browse files</p>
            </div>
            {error && (
              <div className="mt-md p-sm bg-error/10 text-error rounded-lg text-bodySm">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Reports Grid */}
        <div>
          <div className="flex justify-between items-center mb-lg">
            <h2 className="font-labelMd font-semibold text-onSurface">Your Reports</h2>
            <div className="flex gap-md">
              {['All', ...Object.values(REPORT_TYPES)].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`text-labelSm font-medium transition-colors ${
                    filter === type 
                      ? 'text-primary font-bold' 
                      : 'text-onSurfaceVariant hover:text-onSurface'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {loading && reports.length === 0 ? (
            <div className="text-center py-xl">
              <span className="material-symbols-outlined text-4xl text-outlineVariant animate-spin">refresh</span>
              <p className="text-bodySm text-onSurfaceVariant mt-sm">Loading reports...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-xl bg-white border border-outlineVariant rounded-xl">
              <span className="material-symbols-outlined text-4xl text-outlineVariant">folder_open</span>
              <p className="text-bodySm text-onSurfaceVariant mt-sm">No reports found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <div key={report.id} className="bg-white border border-outlineVariant rounded-xl p-lg shadow-sm hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-md">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[24px]">{report.icon}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-labelSm font-medium ${
                        report.status === 'Analyzed' 
                          ? 'bg-emeraldGreen/10 text-emeraldGreen' 
                          : report.status === 'Pending'
                          ? 'bg-amber-500/10 text-amber-600'
                          : 'bg-blue-500/10 text-blue-600'
                      }`}>
                        {report.status}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(report.id);
                        }}
                        className="text-onSurfaceVariant hover:text-error opacity-0 group-hover:opacity-100 transition-all"
                        title="Delete report"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                  <h3 className="font-labelMd font-semibold text-onSurface mb-xs">{report.name}</h3>
                  <p className="text-bodySm text-onSurfaceVariant mb-md">{formatDate(report.date)}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-labelSm text-outline">{report.type}</span>
                    <button className="text-primary hover:underline text-labelSm font-medium">
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
          <h2 className="font-labelMd font-semibold text-onSurface mb-lg">AI Insights</h2>
          <div className="bg-white border border-outlineVariant rounded-xl p-lg shadow-sm">
            <div className="flex items-start gap-md mb-md">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              </div>
              <div>
                <h3 className="font-labelMd font-semibold text-onSurface mb-xs">Recent Analysis Summary</h3>
                <p className="text-bodySm text-onSurfaceVariant leading-relaxed">
                  Based on your latest reports, your overall health status is good. Key observations:
                </p>
              </div>
            </div>
            <div className="space-y-md">
              <div className="flex items-start gap-md p-sm bg-emeraldGreen/5 rounded-lg">
                <span className="material-symbols-outlined text-emeraldGreen text-[20px]">check_circle</span>
                <div>
                  <span className="font-bodySm font-medium text-onSurface">Cholesterol levels improved</span>
                  <p className="text-bodySm text-onSurfaceVariant">Down from 195 to 180 mg/dL since last check</p>
                </div>
              </div>
              <div className="flex items-start gap-md p-sm bg-amber-500/5 rounded-lg">
                <span className="material-symbols-outlined text-amber-600 text-[20px]">warning</span>
                <div>
                  <span className="font-bodySm font-medium text-onSurface">Vitamin D slightly low</span>
                  <p className="text-bodySm text-onSurfaceVariant">Consider increasing supplement dosage</p>
                </div>
              </div>
              <div className="flex items-start gap-md p-sm bg-emeraldGreen/5 rounded-lg">
                <span className="material-symbols-outlined text-emeraldGreen text-[20px]">check_circle</span>
                <div>
                  <span className="font-bodySm font-medium text-onSurface">Blood pressure stable</span>
                  <p className="text-bodySm text-onSurfaceVariant">Consistent readings within normal range</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
