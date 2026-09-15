import { CompanySettings, Plot, PlotInquiry, Seller } from '../types';
import { INITIAL_COMPANY_SETTINGS, INITIAL_PLOTS, INITIAL_SELLERS } from '../data/initialData';

const SETTINGS_KEY = 'landvest_company_settings';
const PLOTS_KEY = 'landvest_plots_data';
const SELLERS_KEY = 'landvest_sellers_data';
const INQUIRIES_KEY = 'landvest_inquiries_data';

export const storageService = {
  getCompanySettings(): CompanySettings {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    }
    return INITIAL_COMPANY_SETTINGS;
  },

  saveCompanySettings(settings: CompanySettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  },

  getPlots(): Plot[] {
    try {
      const stored = localStorage.getItem(PLOTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load plots', e);
    }
    return INITIAL_PLOTS;
  },

  savePlots(plots: Plot[]): void {
    try {
      localStorage.setItem(PLOTS_KEY, JSON.stringify(plots));
    } catch (e) {
      console.error('Failed to save plots', e);
    }
  },

  getSellers(): Seller[] {
    try {
      const stored = localStorage.getItem(SELLERS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load sellers', e);
    }
    return INITIAL_SELLERS;
  },

  saveSellers(sellers: Seller[]): void {
    try {
      localStorage.setItem(SELLERS_KEY, JSON.stringify(sellers));
    } catch (e) {
      console.error('Failed to save sellers', e);
    }
  },

  getInquiries(): PlotInquiry[] {
    try {
      const stored = localStorage.getItem(INQUIRIES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load inquiries', e);
    }
    return [
      {
        id: 'inq-101',
        plotId: 'plot-001',
        plotTitle: 'DTCP Prime Avenue - Sector 4 Golden Highway Corridor',
        investorName: 'Rajesh Subramanian (California, USA)',
        investorEmail: 'rajesh.subramanian@techfirm.us',
        investorPhone: '+1 (408) 555-0192',
        country: 'USA',
        currency: 'USD',
        investmentHorizonYears: 3,
        message: 'Interested in buying 2 adjacent plots for long-term investment. Need POA registration procedure.',
        createdAt: '2025-03-08',
        status: 'site_visit_scheduled',
      },
      {
        id: 'inq-102',
        plotId: 'plot-003',
        plotTitle: 'Heritage Palm Valley - Smart City Investment Enclave',
        investorName: 'K. S. Narayanan (Dubai, UAE)',
        investorEmail: 'ksnarayanan@emiratescorp.ae',
        investorPhone: '+971 50 123 4567',
        country: 'UAE',
        currency: 'AED',
        investmentHorizonYears: 5,
        message: 'Please send DTCP order copy and mother deed verification report for Parandur airport proximity zone.',
        createdAt: '2025-03-11',
        status: 'new',
      },
    ];
  },

  saveInquiries(inquiries: PlotInquiry[]): void {
    try {
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
    } catch (e) {
      console.error('Failed to save inquiries', e);
    }
  },

  resetAll(): void {
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(PLOTS_KEY);
    localStorage.removeItem(SELLERS_KEY);
    localStorage.removeItem(INQUIRIES_KEY);
  },
};
