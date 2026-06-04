import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { TimelineEvent, HealthStats } from '../types';

export function useHealthTimeline(startDate?: string, endDate?: string) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [stats, setStats] = useState<HealthStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      setError(null);
      const [eventsResponse, statsResponse] = await Promise.all([
        apiService.getTimelineEvents(startDate, endDate),
        apiService.getHealthStats(),
      ]);
      setEvents(eventsResponse.data || []);
      setStats(statsResponse.data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health timeline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, [startDate, endDate]);

  return {
    events,
    stats,
    loading,
    error,
    refetch: fetchTimeline,
  };
}
