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
import { PromoBanner } from './components/PromoBanner';
import { AboutSection } from './components/AboutSection';

export default function App() {
  // Core Platform States
  const [settings, setSettings] = useState<CompanySettings>(() => storageService.getCompanySettings());
  const [plots, setPlots] = useState<Plot[]>(() => storageService.getPlots());
  const [sellers, setSellers] = useState<Seller[]>(() => storageService.getSellers());
  const [inquiries, setInquiries] = useState<PlotInquiry[]>(() => storageService.getInquiries());

  // Navigation & View States - Base-aware & GitHub Pages compatible (supporting Path, Hash #seller/#admin, and Query ?view=seller)
  const getViewFromLocation = (): 'public' | 'seller' | 'admin' => {
    if (typeof window === 'undefined') return 'public';
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();

    if (path.endsWith('/admin') || hash.includes('admin') || search.includes('admin')) {
      return 'admin';
    }
    if (path.endsWith('/seller') || hash.includes('seller') || search.includes('seller')) {
      return 'seller';
    }
    return 'public';
  };

  const [activeTab, setActiveTab] = useState<string>('plots');
  const [viewMode, setViewMode] = useState<'public' | 'seller' | 'admin'>(() => getViewFromLocation());
  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>('USD');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');

  // Modals & Selected Plot
  const [selectedPlotForModal, setSelectedPlotForModal] = useState<Plot | null>(null);

  // Authentication States
  const [currentSeller, setCurrentSeller] = useState<Seller | null>(() => storageService.getCurrentSeller());
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => getViewFromLocation() === 'admin');

  // Universal Navigation URL updater (works seamlessly on GitHub Pages /landvest/ without 404)
  const navigateToView = (mode: 'public' | 'seller' | 'admin') => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      const isGitHubPages = window.location.hostname.includes('github.io');
      const basePath = isGitHubPages ? '/landvest/' : '/';

      if (mode === 'public') {
        window.history.pushState({}, '', isGitHubPages ? basePath : '/');
      } else {
        // Use hash on GitHub Pages so page reloads NEVER 404
        const targetUrl = isGitHubPages ? `${basePath}#${mode}` : `/${mode}`;
        window.history.pushState({}, '', targetUrl);
      }
    }
  };

  // Listen to browser popstate and hashchange
  useEffect(() => {
    const handleUrlChange = () => {
      const mode = getViewFromLocation();
      setViewMode(mode);
      if (mode === 'admin') {
        setIsAdminLoggedIn(true);
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

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
    const targetPlot = plots.find((p) => p.id === plotId);
    if (targetPlot) {
      const submitterSeller = sellers.find(
        (s) => s.id === targetPlot.sellerId || (targetPlot.sellerEmail && s.email.toLowerCase() === targetPlot.sellerEmail.toLowerCase())
      );
      if (submitterSeller && submitterSeller.status === 'suspended') {
        alert(`Cannot approve plot "${targetPlot.title}": The seller (${submitterSeller.name}) is currently SUSPENDED. Please reactivate the seller in the Sellers Directory before approving their plots.`);
        return;
      }
    }

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
    } catch (e: any) {
      console.error('Failed to verify plot on server:', e);
      alert(e.message || 'Failed to verify plot on server.');
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

  const handleAddSeller = async (sellerData: Omit<Seller, 'id' | 'createdDate'>): Promise<Seller> => {
    try {
      const created = await apiService.createSeller(sellerData);
      if (created && created.id) {
        const updatedSellers = [created, ...sellers.filter((s) => s.id !== created.id)];
        setSellers(updatedSellers);
        storageService.saveSellers(updatedSellers);
        return created;
      }
    } catch (e) {
      console.error('Failed to save seller on server:', e);
    }
    const newSeller: Seller = {
      ...sellerData,
      id: `seller-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    const updatedSellers = [newSeller, ...sellers.filter((s) => s.id !== newSeller.id)];
    setSellers(updatedSellers);
    storageService.saveSellers(updatedSellers);
    return newSeller;
  };

  const handleToggleSellerStatus = async (sellerId: string) => {
    const targetSeller = sellers.find((s) => s.id === sellerId);
    if (!targetSeller) return;
    const newStatus = targetSeller.status === 'active' ? ('suspended' as const) : ('active' as const);

    const updatedSellers = sellers.map((s) => {
      if (s.id === sellerId) {
        return {
          ...s,
          status: newStatus,
        };
      }
      return s;
    });
    setSellers(updatedSellers);
    storageService.saveSellers(updatedSellers);

    // Synchronize seller's plots: suspend them if seller is suspended, reactivate if seller is activated
    const updatedPlots = plots.map((p) => {
      const isMatch = p.sellerId === sellerId || (Boolean(p.sellerEmail) && Boolean(targetSeller.email) && p.sellerEmail.toLowerCase() === targetSeller.email.toLowerCase());
      if (isMatch) {
        if (newStatus === 'suspended') {
          if (p.status === 'verified_broadcasted') {
            return {
              ...p,
              status: 'pending_verification' as const,
              adminNotes: 'Seller account suspended by Administrator. Plot hidden from public broadcast.',
            };
          }
        } else if (newStatus === 'active') {
          if (p.adminNotes?.includes('Seller account suspended')) {
            return {
              ...p,
              status: 'verified_broadcasted' as const,
              adminNotes: 'Seller account reactivated. Plot restored to broadcast.',
            };
          }
        }
      }
      return p;
    });
    setPlots(updatedPlots);
    storageService.savePlots(updatedPlots);

    try {
      await apiService.toggleSeller(sellerId);
    } catch (e) {
      console.error('Failed to toggle seller status on server:', e);
    }
  };

  const handleSubmitPlot = async (plotData: Omit<Plot, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const createdPlot = await apiService.createPlot(plotData);
      if (createdPlot && createdPlot.id) {
        const updatedPlots = [createdPlot, ...plots.filter((p) => p.id !== createdPlot.id)];
        setPlots(updatedPlots);
        storageService.savePlots(updatedPlots);
        return;
      }
    } catch (e) {
      console.error('Failed to save plot on server:', e);
    }
    const newPlot: Plot = {
      ...plotData,
      id: `plot-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    const updatedPlots = [newPlot, ...plots.filter((p) => p.id !== newPlot.id)];
    setPlots(updatedPlots);
    storageService.savePlots(updatedPlots);
  };

  const handleEditPlot = async (plotId: string, plotData: Partial<Plot>) => {
    const newStatus = plotData.status || 'pending_verification';
    const newNotes = plotData.adminNotes !== undefined ? plotData.adminNotes : 'Seller revised plot details. Pending Admin re-audit and broadcast approval.';
    const updatedPlots = plots.map((p) => {
      if (p.id === plotId) {
        return {
          ...p,
          ...plotData,
          status: newStatus as any,
          adminNotes: newNotes,
          updatedAt: new Date().toISOString().split('T')[0],
        };
      }
      return p;
    });
    setPlots(updatedPlots);
    storageService.savePlots(updatedPlots);

    try {
      await apiService.updatePlot(plotId, plotData as any);
    } catch (e) {
      console.error('Failed to update plot on server:', e);
    }
  };

  const handleUpdateSeller = async (sellerId: string, sellerData: Partial<Seller>) => {
    const targetSeller = sellers.find((s) => s.id === sellerId);
    const updatedSellers = sellers.map((s) => (s.id === sellerId ? { ...s, ...sellerData } : s));
    setSellers(updatedSellers);
    storageService.saveSellers(updatedSellers);

    if (sellerData.status && targetSeller) {
      const newStatus = sellerData.status;
      const updatedPlots = plots.map((p) => {
        const isMatch = p.sellerId === sellerId || (Boolean(p.sellerEmail) && Boolean(targetSeller.email) && p.sellerEmail.toLowerCase() === targetSeller.email.toLowerCase());
        if (isMatch) {
          if (newStatus === 'suspended' && p.status === 'verified_broadcasted') {
            return {
              ...p,
              status: 'pending_verification' as const,
              adminNotes: 'Seller account suspended by Administrator. Plot hidden from public broadcast.',
            };
          } else if (newStatus === 'active' && p.adminNotes?.includes('Seller account suspended')) {
            return {
              ...p,
              status: 'verified_broadcasted' as const,
              adminNotes: 'Seller account reactivated. Plot restored to broadcast.',
            };
          }
        }
        return p;
      });
      setPlots(updatedPlots);
      storageService.savePlots(updatedPlots);
    }

    try {
      await apiService.updateSeller(sellerId, sellerData);
    } catch (e) {
      console.error('Failed to update seller on server:', e);
    }
  };

  const handleDeleteSeller = async (sellerId: string) => {
    const updatedSellers = sellers.filter((s) => s.id !== sellerId);
    setSellers(updatedSellers);
    storageService.saveSellers(updatedSellers);
    try {
      await apiService.deleteSeller(sellerId);
    } catch (e) {
      console.error('Failed to delete seller on server:', e);
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
    <div className="min-h-screen flex flex-col bg-[#FAFCF9] text-slate-900 w-full">
      {/* Dynamic Global Top Navigation */}
      <Navbar
        settings={settings}
        activeCurrency={activeCurrency}
        onCurrencyChange={setActiveCurrency}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          navigateToView('public');
          const element = document.getElementById(tab);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onOpenSellerPortal={() => {
          navigateToView('seller');
        }}
        isSellerLoggedIn={!!currentSeller}
        currentSeller={currentSeller}
        onLogoutSeller={() => {
          setCurrentSeller(null);
          storageService.saveCurrentSeller(null);
        }}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full">
        {viewMode === 'seller' ? (
          <SellerPortal
            sellers={sellers}
            plots={plots}
            currentSeller={currentSeller}
            activeCurrency={activeCurrency}
            onViewPlotDetails={(plot) => setSelectedPlotForModal(plot)}
            onLoginSeller={(seller) => {
              setCurrentSeller(seller);
              storageService.saveCurrentSeller(seller);
            }}
            onLogoutSeller={() => {
              setCurrentSeller(null);
              storageService.saveCurrentSeller(null);
            }}
            onSubmitPlot={handleSubmitPlot}
            onEditPlot={handleEditPlot}
            onRegisterSeller={handleAddSeller}
            onClose={() => {
              navigateToView('public');
            }}
          />
        ) : viewMode === 'admin' ? (
          <AdminPortal
            settings={settings}
            plots={plots}
            sellers={sellers}
            inquiries={inquiries}
            isAdminLoggedIn={isAdminLoggedIn}
            activeCurrency={activeCurrency}
            onLoginAdmin={() => setIsAdminLoggedIn(true)}
            onLogoutAdmin={() => {
              setIsAdminLoggedIn(false);
              navigateToView('public');
            }}
            onUpdateSettings={handleUpdateSettings}
            onVerifyAndBroadcastPlot={handleVerifyAndBroadcastPlot}
            onRejectPlot={handleRejectPlot}
            onDeletePlot={handleDeletePlot}
            onEditPlot={handleEditPlot}
            onAddSeller={handleAddSeller}
            onUpdateSeller={handleUpdateSeller}
            onDeleteSeller={handleDeleteSeller}
            onToggleSellerStatus={handleToggleSellerStatus}
            onClose={() => {
              navigateToView('public');
            }}
          />
        ) : (
          /* PUBLIC INVESTOR EXPERIENCE */
          <div className="space-y-0 w-full">
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

            {/* High-Impact Promotional Advertisement Banner */}
            <PromoBanner
              activeCurrency={activeCurrency}
              onExplorePlots={() => {
                const el = document.getElementById('plots');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenCalculator={() => {
                const el = document.getElementById('predictions');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
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

            {/* About Us Institutional Profile */}
            <div id="about">
              <AboutSection
                settings={settings}
                onConsultClick={() => {
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
      <Footer 
        settings={settings} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          navigateToView('public');
          const element = document.getElementById(tab);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }} 
        onOpenSellerPortal={() => {
          navigateToView('seller');
        }}
      />
    </div>
  );
}
