import React, { useState, useEffect } from 'react';
import { CompanySettings, CurrencyCode, Plot, PlotInquiry, Seller } from './types';
import { storageService } from './services/storage';
import { apiService } from './services/api';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PlotsCatalog } from './components/PlotsCatalog';
import { YearlyPredictions } from './components/YearlyPredictions';
import { ProcedureSection } from './components/ProcedureSection';
import { NRICorner } from './components/NRICorner';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { PlotDetailModal } from './components/PlotDetailModal';
import { SellerPortal } from './components/SellerPortal';
import { AdminPortal } from './components/AdminPortal';

export default function App() {
  // Core Platform States
  const [settings, setSettings] = useState<CompanySettings>(() => storageService.getCompanySettings());
  const [plots, setPlots] = useState<Plot[]>(() => storageService.getPlots());
  const [sellers, setSellers] = useState<Seller[]>(() => storageService.getSellers());
  const [inquiries, setInquiries] = useState<PlotInquiry[]>(() => storageService.getInquiries());

  // Navigation & View States
  const [activeTab, setActiveTab] = useState<string>('plots');
  const [viewMode, setViewMode] = useState<'public' | 'seller' | 'admin'>('public');
  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>('USD');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');

  // Modals & Selected Plot
  const [selectedPlotForModal, setSelectedPlotForModal] = useState<Plot | null>(null);

  // Authentication States
  const [currentSeller, setCurrentSeller] = useState<Seller | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Synchronize document title with dynamic company name
  useEffect(() => {
    document.title = `${settings.companyName} - DTCP Plot Investments for NRI & Global Investors`;
  }, [settings.companyName]);

  // Load from FastAPI Database on mount (with automatic fallback to storageService)
  useEffect(() => {
    async function loadDataFromApi() {
      try {
        const [apiSettings, apiPlots, apiSellers, apiInquiries] = await Promise.allSettled([
          apiService.getSettings(),
          apiService.getPlots(),
          apiService.getSellers(),
          apiService.getInquiries()
        ]);

        if (apiSettings.status === 'fulfilled' && apiSettings.value) {
          setSettings(apiSettings.value);
          storageService.saveCompanySettings(apiSettings.value);
        }
        if (apiPlots.status === 'fulfilled' && apiPlots.value?.length > 0) {
          setPlots(apiPlots.value);
          storageService.savePlots(apiPlots.value);
        }
        if (apiSellers.status === 'fulfilled' && apiSellers.value?.length > 0) {
          setSellers(apiSellers.value);
          storageService.saveSellers(apiSellers.value);
        }
        if (apiInquiries.status === 'fulfilled' && apiInquiries.value) {
          setInquiries(apiInquiries.value);
          storageService.saveInquiries(apiInquiries.value);
        }
      } catch (err) {
        console.warn('FastAPI backend connection using cached data:', err);
      }
    }
    loadDataFromApi();
  }, []);

  // Handlers synced to Backend
  const handleUpdateSettings = async (newSettings: CompanySettings) => {
    setSettings(newSettings);
    storageService.saveCompanySettings(newSettings);
    try {
      await apiService.updateSettings(newSettings);
    } catch (e) {
      console.error('Failed to sync settings with DB:', e);
    }
  };

  const handleVerifyAndBroadcastPlot = async (plotId: string) => {
    const updatedPlots = plots.map((p) => {
      if (p.id === plotId) {
        return {
          ...p,
          status: 'verified_broadcasted' as const,
          adminNotes: 'DTCP verification passed & approved for public NRI broadcast.',
          updatedAt: new Date().toISOString().split('T')[0],
        };
      }
      return p;
    });
    setPlots(updatedPlots);
    storageService.savePlots(updatedPlots);

    try {
      await apiService.verifyPlot(plotId);
    } catch (e) {
      console.error('Failed to verify plot on server:', e);
    }
  };

  const handleRejectPlot = async (plotId: string, reason: string) => {
    const updatedPlots = plots.map((p) => {
      if (p.id === plotId) {
        return {
          ...p,
          status: 'rejected' as const,
          adminNotes: reason,
          updatedAt: new Date().toISOString().split('T')[0],
        };
      }
      return p;
    });
    setPlots(updatedPlots);
    storageService.savePlots(updatedPlots);

    try {
      await apiService.rejectPlot(plotId, reason);
    } catch (e) {
      console.error('Failed to reject plot on server:', e);
    }
  };

  const handleDeletePlot = async (plotId: string) => {
    const updatedPlots = plots.filter((p) => p.id !== plotId);
    setPlots(updatedPlots);
    storageService.savePlots(updatedPlots);

    try {
      await apiService.deletePlot(plotId);
    } catch (e) {
      console.error('Failed to delete plot on server:', e);
    }
  };

  const handleAddSeller = async (sellerData: Omit<Seller, 'id' | 'createdDate'>) => {
    const newSeller: Seller = {
      ...sellerData,
      id: `seller-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
    };
    const updatedSellers = [newSeller, ...sellers];
    setSellers(updatedSellers);
    storageService.saveSellers(updatedSellers);

    try {
      await apiService.createSeller(sellerData);
    } catch (e) {
      console.error('Failed to save seller on server:', e);
    }
  };

  const handleToggleSellerStatus = async (sellerId: string) => {
    const updatedSellers = sellers.map((s) => {
      if (s.id === sellerId) {
        return {
          ...s,
          status: s.status === 'active' ? ('suspended' as const) : ('active' as const),
        };
      }
      return s;
    });
    setSellers(updatedSellers);
    storageService.saveSellers(updatedSellers);

    try {
      await apiService.toggleSeller(sellerId);
    } catch (e) {
      console.error('Failed to toggle seller status on server:', e);
    }
  };

  const handleSubmitPlot = async (plotData: Omit<Plot, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPlot: Plot = {
      ...plotData,
      id: `plot-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    const updatedPlots = [newPlot, ...plots];
    setPlots(updatedPlots);
    storageService.savePlots(updatedPlots);

    try {
      await apiService.createPlot(plotData);
    } catch (e) {
      console.error('Failed to save plot on server:', e);
    }
  };

  const handleInquirySubmit = async (inquiryData: {
    plotId: string;
    plotTitle: string;
    name: string;
    email: string;
    phone: string;
    country: string;
    currency: CurrencyCode;
    horizonYears: number;
    message: string;
  }) => {
    const newInquiry: PlotInquiry = {
      id: `inq-${Date.now()}`,
      plotId: inquiryData.plotId,
      plotTitle: inquiryData.plotTitle,
      investorName: inquiryData.name,
      investorEmail: inquiryData.email,
      investorPhone: inquiryData.phone,
      country: inquiryData.country,
      currency: inquiryData.currency,
      investmentHorizonYears: inquiryData.horizonYears,
      message: inquiryData.message,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'new',
    };
    const updatedInquiries = [newInquiry, ...inquiries];
    setInquiries(updatedInquiries);
    storageService.saveInquiries(updatedInquiries);

    try {
      await apiService.createInquiry({
        plotId: inquiryData.plotId,
        plotTitle: inquiryData.plotTitle,
        investorName: inquiryData.name,
        investorEmail: inquiryData.email,
        investorPhone: inquiryData.phone,
        country: inquiryData.country,
        currency: inquiryData.currency,
        investmentHorizonYears: inquiryData.horizonYears,
        message: inquiryData.message,
      });
    } catch (e) {
      console.error('Failed to submit inquiry to server:', e);
    }
  };

  const handleGeneralInquiry = async (data: {
    name: string;
    phone: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    const newInquiry: PlotInquiry = {
      id: `inq-${Date.now()}`,
      plotId: 'general',
      plotTitle: data.subject,
      investorName: data.name,
      investorEmail: data.email,
      investorPhone: data.phone,
      country: 'USA / NRI',
      currency: activeCurrency,
      investmentHorizonYears: 5,
      message: data.message,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'new',
    };
    const updatedInquiries = [newInquiry, ...inquiries];
    setInquiries(updatedInquiries);
    storageService.saveInquiries(updatedInquiries);

    try {
      await apiService.createInquiry({
        plotId: 'general',
        plotTitle: data.subject,
        investorName: data.name,
        investorEmail: data.email,
        investorPhone: data.phone,
        country: 'USA / NRI',
        currency: activeCurrency,
        investmentHorizonYears: 5,
        message: data.message,
      });
    } catch (e) {
      console.error('Failed to submit general inquiry to server:', e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFCF9] text-slate-900">
      {/* Dynamic Global Top Navigation */}
      <Navbar
        settings={settings}
        activeCurrency={activeCurrency}
        onCurrencyChange={setActiveCurrency}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setViewMode('public');
          const element = document.getElementById(tab);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onOpenSellerPortal={() => setViewMode('seller')}
        onOpenAdminPortal={() => setViewMode('admin')}
        isSellerLoggedIn={!!currentSeller}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {viewMode === 'seller' ? (
          <SellerPortal
            sellers={sellers}
            plots={plots}
            currentSeller={currentSeller}
            onLoginSeller={(seller) => setCurrentSeller(seller)}
            onLogoutSeller={() => setCurrentSeller(null)}
            onSubmitPlot={handleSubmitPlot}
            onClose={() => setViewMode('public')}
          />
        ) : viewMode === 'admin' ? (
          <AdminPortal
            settings={settings}
            plots={plots}
            sellers={sellers}
            inquiries={inquiries}
            isAdminLoggedIn={isAdminLoggedIn}
            onLoginAdmin={() => setIsAdminLoggedIn(true)}
            onLogoutAdmin={() => setIsAdminLoggedIn(false)}
            onUpdateSettings={handleUpdateSettings}
            onVerifyAndBroadcastPlot={handleVerifyAndBroadcastPlot}
            onRejectPlot={handleRejectPlot}
            onDeletePlot={handleDeletePlot}
            onAddSeller={handleAddSeller}
            onToggleSellerStatus={handleToggleSellerStatus}
            onClose={() => setViewMode('public')}
          />
        ) : (
          /* PUBLIC INVESTOR EXPERIENCE */
          <div className="space-y-0">
            {/* Hero Section with Motive for Buy Plot */}
            <Hero
              settings={settings}
              activeCurrency={activeCurrency}
              totalPlotsCount={plots.filter((p) => p.status === 'verified_broadcasted').length}
              onExplorePlots={() => {
                const el = document.getElementById('plots');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenCalculator={() => {
                const el = document.getElementById('predictions');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onFilterChange={setSelectedDistrict}
              selectedDistrict={selectedDistrict}
            />

            {/* DTCP Verified Plots Catalog Section */}
            <div id="plots">
              <PlotsCatalog
                plots={plots}
                activeCurrency={activeCurrency}
                onViewDetails={(plot) => setSelectedPlotForModal(plot)}
                onCalculateYield={(plot) => {
                  setSelectedPlotForModal(plot);
                  const el = document.getElementById('predictions');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                onInquire={(plot) => setSelectedPlotForModal(plot)}
                selectedDistrict={selectedDistrict}
                onDistrictChange={setSelectedDistrict}
              />
            </div>

            {/* 10-Year ROI Predictions & Multi-Year Calculator */}
            <div id="predictions">
              <YearlyPredictions
                plots={plots}
                activeCurrency={activeCurrency}
                onSelectPlotForInquiry={(plot) => setSelectedPlotForModal(plot)}
              />
            </div>

            {/* End-to-End Legal Assurance & Procedures */}
            <div id="procedure">
              <ProcedureSection
                settings={settings}
                onContactClick={() => {
                  const el = document.getElementById('contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </div>

            {/* NRI / Global Investors Corner (POA, Remote Purchase, RBI Compliance) */}
            <div id="nri">
              <NRICorner
                settings={settings}
                activeCurrency={activeCurrency}
                onCurrencyChange={setActiveCurrency}
                onExplorePlots={() => {
                  const el = document.getElementById('plots');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </div>

            {/* Contact & Consultation Section */}
            <div id="contact">
              <ContactSection
                settings={settings}
                onSubmitGeneralInquiry={handleGeneralInquiry}
              />
            </div>
          </div>
        )}
      </main>

      {/* Plot Detail & Inquiry Modal */}
      <PlotDetailModal
        plot={selectedPlotForModal}
        isOpen={!!selectedPlotForModal}
        onClose={() => setSelectedPlotForModal(null)}
        activeCurrency={activeCurrency}
        onSubmitInquiry={handleInquirySubmit}
      />

      {/* Footer */}
      <Footer settings={settings} onTabChange={(tab) => {
        setActiveTab(tab);
        setViewMode('public');
        const element = document.getElementById(tab);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }} />
    </div>
  );
}
