export type CurrencyCode = 'INR' | 'USD' | 'AED' | 'GBP' | 'EUR' | 'SGD' | 'CAD';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  rateAgainstINR: number; // 1 CurrencyUnit = X INR (e.g. 1 USD = 86.5 INR)
}

export interface SubPlot {
  id: string;
  plotNumber: string; // e.g. "Plot 01"
  sqFt: number;
  cents: number;
  dimensions?: string; // e.g. "30 x 40"
  facing?: 'North' | 'East' | 'West' | 'South' | 'North-East' | 'Corner Plot';
  pricePerSqFt: number;
  totalPrice: number;
  status: 'available' | 'booked' | 'sold';
  year1Amount?: number;
  year2Amount?: number;
  year5Amount?: number;
}

export interface Plot {
  id: string;
  title: string;
  state: string;
  district: string;
  locality: string;
  dtcpNumber: string;
  isDtcpApproved: boolean;
  totalSqFt: number;
  cents: number;
  pricePerSqFt: number;
  totalPrice: number; // in INR
  plotImages: string[];
  locationImage: string;
  layoutPlanImage: string;
  layoutHtml?: string;
  plotImageHtml?: string;
  locationImageHtml?: string;
  subPlots?: SubPlot[];
  ownerName1: string;
  ownerPhone1: string;
  ownerName2?: string;
  ownerPhone2?: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerEmail?: string;
  status: 'pending_verification' | 'verified_broadcasted' | 'booked' | 'rejected' | 'sold';
  sellerBroadcastStatus?: 'pending_broadcast' | 'broadcasted';
  adminNotes?: string;
  expectedAppreciationRate: number; // e.g. 12%, 15%, 18%
  facing: 'North' | 'East' | 'West' | 'South' | 'North-East' | 'Corner Plot';
  roadWidthFt: number;
  highlights: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Seller {
  id: string;
  name: string;
  phone: string;
  email: string;
  companyName?: string;
  incomeTaxPan?: string;
  country?: string;
  district: string;
  state: string;
  status: 'active' | 'pending' | 'suspended';
  createdDate: string;
}

export interface CompanySettings {
  companyName: string;
  tagline: string;
  primaryPhone: string;
  secondaryPhone: string;
  whatsappNumber: string;
  email: string;
  nriDeskEmail: string;
  officeAddress: string;
  dtcpAssuranceBadgeText: string;
  defaultAnnualGrowthRate: number;
  usdtToInrRate: number;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  smtpFromEmail?: string;
}

export interface PlotInquiry {
  id: string;
  plotId: string;
  plotTitle: string;
  investorName: string;
  investorEmail: string;
  investorPhone: string;
  country: string;
  currency: CurrencyCode;
  investmentHorizonYears: number;
  message?: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'site_visit_scheduled' | 'closed';
}
