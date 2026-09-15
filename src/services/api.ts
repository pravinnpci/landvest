import { CompanySettings, Plot, PlotInquiry, Seller } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

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

  async verifyPlot(plotId: string): Promise<Plot> {
    const res = await fetch(`${API_BASE}/plots/${plotId}/verify`, { method: 'PUT' });
    if (!res.ok) throw new Error('Failed to verify plot');
    return res.json();
  },

  async rejectPlot(plotId: string, reason: string): Promise<Plot> {
    const formData = new FormData();
    formData.append('reason', reason);
    const res = await fetch(`${API_BASE}/plots/${plotId}/reject`, {
      method: 'PUT',
      body: formData
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

  // S3 FILE UPLOAD
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to upload file');
    const data = await res.json();
    return data.url;
  }
};
