import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { MedicalReport } from '../types';

export function useReports() {
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getReports();
      setReports(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const uploadReport = async (file: File) => {
    try {
      const response = await apiService.uploadReport(file);
      // Backend returns { ok: true, message, file, report, extractedText }
      if (response.ok) {
        await fetchReports();
      } else {
        throw new Error(response.error || 'Upload failed');
      }
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload report';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteReport = async (id: string) => {
    try {
      await apiService.deleteReport(id);
      await fetchReports();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete report');
      throw err;
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    reports,
    loading,
    error,
    uploadReport,
    deleteReport,
    refetch: fetchReports,
  };
}
