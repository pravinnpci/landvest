import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  Menu, 
  X, 
  PhoneCall, 
  Lock,
  ChevronDown,
  Globe
} from 'lucide-react';
import { CompanySettings, CurrencyCode } from '../types';
import { CURRENCIES } from '../utils/currency';

interface NavbarProps {
  settings: CompanySettings;
  activeCurrency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenSellerPortal: () => void;
  onOpenAdminPortal: () => void;
  isSellerLoggedIn: boolean;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  activeCurrency,
  onCurrencyChange,
  activeTab,
  onTabChange,
  onOpenSellerPortal,
  onOpenAdminPortal,
  isSellerLoggedIn,
  isAdminLoggedIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'plots', label: 'DTCP Plots' },
    { id: 'predictions', label: 'ROI Predictions' },
    { id: 'procedure', label: 'Legal Process' },
    { id: 'nri', label: 'NRI & US Desk' },
    { id: 'about', label: 'Assurance' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      {/* Top Banner: Concise, elegant single line */}
      <div className="bg-slate-950 text-white text-[11px] py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-emerald-500 text-slate-950 font-extrabold px-2 py-0.5 rounded text-[10px] tracking-wide uppercase">
              <ShieldCheck className="w-3 h-3 text-slate-950" />
              100% DTCP Approved
            </span>
            <span className="text-slate-300 hidden md:inline truncate max-w-lg">
              {settings.dtcpAssuranceBadgeText}
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            <a 
              href={`tel:${settings.primaryPhone}`} 
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span className="font-medium">{settings.primaryPhone}</span>
            </a>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="hidden sm:inline">
              US/NRI Desk: <span className="text-emerald-400 font-semibold">{settings.nriDeskEmail}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Single-Line Clean Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Company Brand Logo & Name */}
        <button 
          onClick={() => onTabChange('plots')} 
          className="flex items-center gap-2.5 text-left group focus:outline-none shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-black text-lg text-slate-900 tracking-tight leading-none block">
              {settings.companyName}
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide hidden sm:block">
              Global Land Investment Platform
            </span>
          </div>
        </button>

        {/* Desktop Single-Line Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 text-xs xl:text-sm font-semibold text-slate-600">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onTabChange(link.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === link.id
                  ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Actions: Currency, Become Seller, Admin, Menu */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Currency Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
              title="Change Display Currency for NRI Investors"
            >
              <span className="text-sm">{CURRENCIES[activeCurrency].flag}</span>
              <span>{activeCurrency}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {currencyDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in"
                onMouseLeave={() => setCurrencyDropdownOpen(false)}
              >
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Investor Currency
                </div>
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
                  const curr = CURRENCIES[code];
                  return (
                    <button
                      key={code}
                      onClick={() => {
                        onCurrencyChange(code);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors ${
                        activeCurrency === code 
                          ? 'bg-emerald-50 text-emerald-900 font-bold' 
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{curr.flag}</span>
                        <span>{curr.code}</span>
                      </span>
                      <span className="font-semibold text-slate-500">{curr.symbol}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Become a Seller / Post Plot */}
          <button
            onClick={onOpenSellerPortal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              isSellerLoggedIn 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'bg-white border border-slate-300 hover:border-slate-800 text-slate-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Become a</span>
            <span>{isSellerLoggedIn ? 'Seller Portal' : 'Seller'}</span>
          </button>

          {/* Admin Portal Button */}
          <button
            onClick={onOpenAdminPortal}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isAdminLoggedIn
                ? 'bg-emerald-500 text-slate-950 font-black'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
            title="Administrator Portal"
          >
            <Lock className="w-3 h-3" />
            <span className="hidden md:inline">Admin</span>
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1.5 shadow-lg">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onTabChange(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === link.id
                  ? 'bg-emerald-50 text-emerald-900 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
