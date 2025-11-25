// src/utils/api.ts - Updated for Vercel backend

const API_URL = '/api'; // Vercel API routes

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Profile endpoints
  async saveProfile(profile: any): Promise<{ success: boolean; userId?: string; error?: string }> {
    try {
      const result = await this.request('/profiles', {
        method: 'POST',
        body: JSON.stringify(profile)
      });
      return result;
    } catch (error: any) {
      console.error('Error saving profile:', error);
      return { success: false, error: error.message };
    }
  }

  async getProfile(userId: string): Promise<{ success: boolean; profile?: any; error?: string }> {
    try {
      const result = await this.request(`/profiles/${userId}`);
      return result;
    } catch (error: any) {
      console.error('Error getting profile:', error);
      return { success: false, error: error.message };
    }
  }

  async updateProfile(userId: string, updates: any): Promise<{ success: boolean; profile?: any; error?: string }> {
    try {
      const result = await this.request(`/profiles/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return result;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }
  }

  // Event endpoints
  async getEvents(): Promise<{ success: boolean; events?: any[]; error?: string }> {
    try {
      const result = await this.request('/events');
      return result;
    } catch (error: any) {
      console.error('Error getting events:', error);
      return { success: false, error: error.message };
    }
  }

  async createEvent(eventData: any): Promise<{ success: boolean; event?: any; error?: string }> {
    try {
      const result = await this.request('/events', {
        method: 'POST',
        body: JSON.stringify(eventData)
      });
      return result;
    } catch (error: any) {
      console.error('Error creating event:', error);
      return { success: false, error: error.message };
    }
  }

  async getEvent(eventId: string): Promise<{ success: boolean; event?: any; error?: string }> {
    try {
      const result = await this.request(`/events/${eventId}`);
      return result;
    } catch (error: any) {
      console.error('Error getting event:', error);
      return { success: false, error: error.message };
    }
  }

  async joinEvent(eventId: string, userId: string, userName: string): Promise<{ success: boolean; event?: any; error?: string }> {
    try {
      const result = await this.request(`/events/${eventId}/join`, {
        method: 'POST',
        body: JSON.stringify({ userId, userName })
      });
      return result;
    } catch (error: any) {
      console.error('Error joining event:', error);
      return { success: false, error: error.message };
    }
  }

  async getUserEvents(userId: string): Promise<{ success: boolean; events?: any[]; error?: string }> {
    try {
      const result = await this.request(`/users/${userId}/events`);
      return result;
    } catch (error: any) {
      console.error('Error getting user events:', error);
      return { success: false, error: error.message };
    }
  }

  async initSampleEvents(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const result = await this.request('/init-sample-events', {
        method: 'POST'
      });
      return result;
    } catch (error: any) {
      console.error('Error initializing sample events:', error);
      return { success: false, error: error.message };
    }
  }

  async healthCheck(): Promise<{ success: boolean; status?: string; error?: string }> {
    try {
      const result = await this.request('/health');
      return { success: true, ...result };
    } catch (error: any) {
      console.error('Health check failed:', error);
      return { success: false, error: error.message };
    }
  }
}

export const apiClient = new ApiClient();