const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('authToken');

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Medical Reports
  async getReports() {
    return this.request<any>('/reports');
  }

  async uploadReport(file: File) {
    const formData = new FormData();
    formData.append('report', file);
    return this.request<any>('/reports/upload', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  }

  async getReportById(id: string) {
    return this.request<any>(`/reports/${id}`);
  }

  async deleteReport(id: string) {
    return this.request<any>(`/reports/${id}`, {
      method: 'DELETE',
    });
  }

  // AI Assistant
  async chatWithAI(message: string, conversationHistory?: any[]) {
    return this.request<any>('/rag-chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        conversationHistory,
      }),
    });
  }

  async analyzeReport(reportId: string) {
    return this.request<any>(`/ai/analyze-report/${reportId}`, {
      method: 'POST',
    });
  }

  // Medication
  async getMedications() {
    return this.request<any>('/medications');
  }

  async addMedication(medication: any) {
    return this.request<any>('/medications', {
      method: 'POST',
      body: JSON.stringify(medication),
    });
  }

  async updateMedication(id: string, medication: any) {
    return this.request<any>(`/medications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(medication),
    });
  }

  async deleteMedication(id: string) {
    return this.request<any>(`/medications/${id}`, {
      method: 'DELETE',
    });
  }

  async markMedicationTaken(id: string) {
    return this.request<any>(`/medications/${id}/take`, {
      method: 'POST',
    });
  }

  // Health Timeline
  async getTimelineEvents(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return this.request<any>(`/timeline?${params.toString()}`);
  }

  async getHealthStats() {
    return this.request<any>('/health/stats');
  }

  // Hospital Finder
  async findNearbyHospitals(lat?: number, lng?: number, radius?: number) {
    const params = new URLSearchParams();
    if (lat) params.append('lat', lat.toString());
    if (lng) params.append('lng', lng.toString());
    if (radius) params.append('radius', radius.toString());
    return this.request<any>(`/hospitals/nearby?${params.toString()}`);
  }

  async searchHospitals(query: string, filters?: any) {
    const params = new URLSearchParams();
    params.append('query', query);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params.append(key, String(value));
      });
    }
    return this.request<any>(`/hospitals/search?${params.toString()}`);
  }

  // User Profile
  async getUserProfile() {
    return this.request<any>('/user/profile');
  }

  async updateUserProfile(profile: any) {
    return this.request<any>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  // Settings
  async getSettings() {
    return this.request<any>('/user/settings');
  }

  async updateSettings(settings: any) {
    return this.request<any>('/user/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }
}

export const apiService = new ApiService();
