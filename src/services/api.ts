import { CompanySettings, Plot, PlotInquiry, Seller } from '../types';

const getApiBase = () => {
  if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
    return 'https://landvest-sapravin46-1821s-projects.vercel.app/api';
  }
  return import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:8080/api');
};
const API_BASE = getApiBase();

export const apiService = {
  // SETTINGS
  async getSettings(): Promise<CompanySettings> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateSettings(settings: Partial<CompanySettings>): Promise<CompanySettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  // PLOTS
  async getPlots(status?: string): Promise<Plot[]> {
    const url = status ? `${API_BASE}/plots?status=${status}` : `${API_BASE}/plots`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch plots');
    return res.json();
  },

  async createPlot(plotData: Omit<Plot, 'id' | 'createdAt' | 'updatedAt'>): Promise<Plot> {
    const res = await fetch(`${API_BASE}/plots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plotData)
    });
    if (!res.ok) throw new Error('Failed to create plot');
    return res.json();
  },

  async updatePlot(plotId: string, plotData: Omit<Plot, 'id' | 'createdAt' | 'updatedAt'>): Promise<Plot> {
    const res = await fetch(`${API_BASE}/plots/${plotId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plotData)
    });
    if (!res.ok) throw new Error('Failed to update plot');
    return res.json();
  },

  async verifyPlot(plotId: string): Promise<Plot> {
    const res = await fetch(`${API_BASE}/plots/${plotId}/verify`, { method: 'PUT' });
    if (!res.ok) throw new Error('Failed to verify plot');
    return res.json();
  },

  async rejectPlot(plotId: string, reason: string): Promise<Plot> {
    const res = await fetch(`${API_BASE}/plots/${plotId}/reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    if (!res.ok) throw new Error('Failed to reject plot');
    return res.json();
  },

  async deletePlot(plotId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/plots/${plotId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete plot');
  },

  // SELLERS
  async getSellers(): Promise<Seller[]> {
    const res = await fetch(`${API_BASE}/sellers`);
    if (!res.ok) throw new Error('Failed to fetch sellers');
    return res.json();
  },

  async createSeller(sellerData: Omit<Seller, 'id' | 'createdDate'>): Promise<Seller> {
    const res = await fetch(`${API_BASE}/sellers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sellerData)
    });
    if (!res.ok) throw new Error('Failed to create seller');
    return res.json();
  },

  async toggleSeller(sellerId: string): Promise<Seller> {
    const res = await fetch(`${API_BASE}/sellers/${sellerId}/toggle`, { method: 'PUT' });
    if (!res.ok) throw new Error('Failed to toggle seller status');
    return res.json();
  },

  async updateSeller(sellerId: string, sellerData: Partial<Seller>): Promise<Seller> {
    const res = await fetch(`${API_BASE}/sellers/${sellerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sellerData)
    });
    if (!res.ok) throw new Error('Failed to update seller');
    return res.json();
  },

  async deleteSeller(sellerId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/sellers/${sellerId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete seller');
  },

  // SELLER OTP AUTH
  async sendSellerOtp(email: string): Promise<{ success: boolean; message: string; email_delivered?: boolean; code_hint?: string }> {
    const res = await fetch(`${API_BASE}/auth/seller/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Failed to send OTP code');
    return data;
  },

  async verifySellerOtp(email: string, otp: string): Promise<{ success: boolean; seller: Seller }> {
    const res = await fetch(`${API_BASE}/auth/seller/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Invalid or expired OTP code');
    return data;
  },

  async sendSellerSignupOtp(email: string, name?: string): Promise<{ success: boolean; message: string; email_delivered?: boolean; code_hint?: string }> {
    const res = await fetch(`${API_BASE}/auth/seller/send-signup-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name: name || 'Seller' })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Failed to send registration OTP code');
    return data;
  },

  async verifySellerSignupOtp(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/auth/seller/verify-signup-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Invalid or expired OTP code');
    return data;
  },

  // INQUIRIES
  async getInquiries(): Promise<PlotInquiry[]> {
    const res = await fetch(`${API_BASE}/inquiries`);
    if (!res.ok) throw new Error('Failed to fetch inquiries');
    return res.json();
  },

  async createInquiry(inquiryData: Omit<PlotInquiry, 'id' | 'createdAt' | 'status'>): Promise<PlotInquiry> {
    const res = await fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryData)
    });
    if (!res.ok) throw new Error('Failed to submit inquiry');
    return res.json();
  },

  // ROBUST FILE UPLOAD WITH CLIENT DATA-URL FALLBACK
  async uploadFile(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) return data.url;
      }
    } catch (e) {
      console.warn('Server upload endpoint not reachable, using local Data URL fallback:', e);
    }
    // Universal client-side Data URL fallback (works 100% on GitHub Pages, offline, or cloud)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });
  }
};
