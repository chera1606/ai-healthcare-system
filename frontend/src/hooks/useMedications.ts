import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Medication, AdherenceData } from '../types';

export function useMedications() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [adherence, setAdherence] = useState<AdherenceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getMedications();
      setMedications(response.data?.medications || []);
      setAdherence(response.data?.adherence || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch medications');
    } finally {
      setLoading(false);
    }
  };

  const addMedication = async (medication: Omit<Medication, 'id'>) => {
    try {
      await apiService.addMedication(medication);
      await fetchMedications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add medication');
      throw err;
    }
  };

  const updateMedication = async (id: string, medication: Partial<Medication>) => {
    try {
      await apiService.updateMedication(id, medication);
      await fetchMedications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update medication');
      throw err;
    }
  };

  const deleteMedication = async (id: string) => {
    try {
      await apiService.deleteMedication(id);
      await fetchMedications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete medication');
      throw err;
    }
  };

  const markAsTaken = async (id: string) => {
    try {
      await apiService.markMedicationTaken(id);
      await fetchMedications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark medication as taken');
      throw err;
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  return {
    medications,
    adherence,
    loading,
    error,
    addMedication,
    updateMedication,
    deleteMedication,
    markAsTaken,
    refetch: fetchMedications,
  };
}
