import { useState } from 'react';
import { apiService } from '../services/api';
import { Hospital } from '../types';

export function useHospitalFinder() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findNearby = async (lat?: number, lng?: number, radius?: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.findNearbyHospitals(lat, lng, radius);
      setHospitals(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find hospitals');
    } finally {
      setLoading(false);
    }
  };

  const searchHospitals = async (query: string, filters?: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.searchHospitals(query, filters);
      setHospitals(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search hospitals');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(new Error('Unable to retrieve your location'));
        }
      );
    });
  };

  const findNearbyCurrentLocation = async (radius?: number) => {
    try {
      const location = await getCurrentLocation();
      await findNearby(location.lat, location.lng, radius);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get current location');
    }
  };

  return {
    hospitals,
    loading,
    error,
    findNearby,
    searchHospitals,
    findNearbyCurrentLocation,
    getCurrentLocation,
  };
}
