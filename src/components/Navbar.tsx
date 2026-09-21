import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  Menu, 
  X, 
  PhoneCall, 
  ChevronDown,
  PlusCircle,
  LogOut,
  Mail,
  Sparkles,
  Flame,
  Zap,
  Gift
} from 'lucide-react';
import { CompanySettings, CurrencyCode, Seller } from '../types';
import { CURRENCIES } from '../utils/currency';

interface NavbarProps {
  settings: CompanySettings;
  activeCurrency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenSellerPortal: () => void;
  isSellerLoggedIn: boolean;
  currentSeller?: Seller | null;
  onLogoutSeller?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  activeCurrency,
  onCurrencyChange,
  activeTab,
  onTabChange,
  onOpenSellerPortal,
  isSellerLoggedIn,
  currentSeller,
  onLogoutSeller,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const currencyRef = useRef<HTMLDivElement>(null);

  // Close currency dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setCurrencyDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { id: 'plots', label: 'DTCP Plots' },
    { id: 'predictions', label: 'ROI Predictions' },
    { id: 'procedure', label: 'Legal Process' },
    { id: 'nri', label: 'NRI & US Desk' },
    { id: 'about', label: 'Assurance' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm w-full m-0 p-0">
      {/* Dynamic Bright Scrolling Offer Ticker */}
      <div 
        style={{ background: 'linear-gradient(90deg, #F59E0B 0%, #68D800 45%, #10B981 100%)' }}
        className="text-black py-1.5 px-2 sm:px-4 border-b border-black/10 overflow-hidden shadow-xs w-full m-0"
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-hidden">
          <div className="hidden sm:flex items-center gap-1.5 bg-black text-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 z-10 shadow-sm">
            <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
            <span>INVESTOR OFFERS</span>
          </div>

          <div className="overflow-hidden relative w-full select-none">
            <div className="animate-marquee flex items-center gap-8 text-[11px] sm:text-xs font-black tracking-wide">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-700 inline shrink-0" />
                <span>✈️ PARANDUR GREENFIELD AIRPORT: Pre-launch prime DTCP layout plots open for booking with 20% guaranteed appreciation corridor!</span>
              </span>
              <span className="text-black/40 font-black">✦</span>
              <span className="flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-emerald-950 inline shrink-0" />
                <span>🎁 FESTIVE NRI ADVANTAGE: 0% Processing fee + Free Power of Attorney (POA) registration assistance this month!</span>
              </span>
              <span className="text-black/40 font-black">✦</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-950 inline shrink-0" />
                <span>🛡️ 100% CLEAR TITLE GUARANTEE: 30-Year Encumbrance Certificate (EC) & legal audit verified by High Court panel advocates!</span>
              </span>
              <span className="text-black/40 font-black">✦</span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-900 inline shrink-0" />
                <span>📈 COIMBATORE IT EXPRESSWAY: DTCP approved gated commercial & villa plots with immediate Patta name transfer!</span>
              </span>
              {/* Looping replica */}
              <span className="text-black/40 font-black">✦</span>
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-700 inline shrink-0" />
                <span>✈️ PARANDUR GREENFIELD AIRPORT: Pre-launch prime DTCP layout plots open for booking with 20% guaranteed appreciation corridor!</span>
              </span>
              <span className="text-black/40 font-black">✦</span>
              <span className="flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-emerald-950 inline shrink-0" />
                <span>🎁 FESTIVE NRI ADVANTAGE: 0% Processing fee + Free Power of Attorney (POA) registration assistance this month!</span>
              </span>
              <span className="text-black/40 font-black">✦</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-950 inline shrink-0" />
                <span>🛡️ 100% CLEAR TITLE GUARANTEE: 30-Year Encumbrance Certificate (EC) & legal audit verified by High Court panel advocates!</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Banner: Concise, elegant responsive single line */}
      <div className="bg-slate-950 text-white text-[11px] py-1 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2 overflow-hidden">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="inline-flex items-center gap-1 bg-emerald-500 text-slate-950 font-extrabold px-1.5 py-0.5 rounded text-[10px] tracking-wide uppercase">
              <ShieldCheck className="w-3 h-3 text-slate-950" />
              100% DTCP Approved
            </span>
            <span className="text-slate-300 hidden md:inline truncate max-w-md">
              {settings.dtcpAssuranceBadgeText}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-slate-300 text-[11px] shrink-0">
            <a 
              href={`tel:${settings.primaryPhone}`} 
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="font-semibold text-[11px]">{settings.primaryPhone}</span>
            </a>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="hidden lg:inline text-slate-400">
              NRI Desk: <span className="text-emerald-400 font-semibold">{settings.nriDeskEmail}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Responsive Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Company Brand Logo & Name */}
        <button 
          onClick={() => {
            onTabChange('plots');
            setMobileMenuOpen(false);
          }} 
          className="flex items-center gap-2 text-left group focus:outline-none min-w-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <span className="font-black text-base sm:text-lg text-slate-900 tracking-tight leading-tight block truncate">
              {settings.companyName}
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide hidden sm:block truncate">
              Global Land Investment Platform
            </span>
          </div>
        </button>

        {/* Desktop Navigation Tabs (Hidden on mobile/tablet) */}
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

        {/* Right Actions: Currency, Seller (Desktop & Mobile trigger) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Currency Dropdown (Always visible, compact) */}
          <div className="relative" ref={currencyRef}>
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
              title="Change Display Currency"
              aria-label="Change Display Currency"
            >
              <span className="text-xs sm:text-sm">{CURRENCIES[activeCurrency].flag}</span>
              <span className="text-[11px] sm:text-xs">{activeCurrency}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {currencyDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in"
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
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
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

          {/* Desktop Seller Button */}
          <div className="hidden sm:flex items-center">
            {isSellerLoggedIn ? (
              <button
                onClick={onOpenSellerPortal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all whitespace-nowrap"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Seller Portal</span>
                {currentSeller && (
                  <span className="max-w-[80px] truncate text-[10px] bg-emerald-700/80 px-1 rounded">
                    {currentSeller.name.split(' ')[0]}
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={onOpenSellerPortal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-300 hover:border-slate-800 text-slate-800 transition-all whitespace-nowrap"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Become a Seller</span>
              </button>
            )}
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 shadow-xl max-h-[85vh] overflow-y-auto">
          {/* Seller Action in Mobile Menu */}
          <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl">
            {isSellerLoggedIn ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-extrabold text-emerald-900">
                      Seller Active: {currentSeller?.name}
                    </span>
                  </div>
                  {onLogoutSeller && (
                    <button
                      onClick={() => {
                        onLogoutSeller();
                        setMobileMenuOpen(false);
                      }}
                      className="text-[11px] text-red-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <LogOut className="w-3 h-3" />
                      Logout
                    </button>
                  )}
                </div>
                <button
                  onClick={() => {
                    onOpenSellerPortal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Open Seller Portal (List & Manage Plots)</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <div className="text-xs font-extrabold text-emerald-950">
                    Have Land or DTCP Layout to Sell?
                  </div>
                  <div className="text-[11px] text-emerald-800">
                    Direct access for landowners and builders to list plots for global NRI buyers.
                  </div>
                </div>
                <button
                  onClick={() => {
                    onOpenSellerPortal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Become a Seller / Seller Login</span>
                </button>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Navigation Menu
            </div>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onTabChange(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                  activeTab === link.id
                    ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
                {activeTab === link.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                )}
              </button>
            ))}
          </div>

          {/* Direct Help / Phone */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <a
              href={`tel:${settings.primaryPhone}`}
              className="flex items-center gap-1.5 font-bold text-slate-900 hover:text-emerald-600"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>Call Us: {settings.primaryPhone}</span>
            </a>
            <a
              href={`mailto:${settings.email}`}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-900 text-[11px]"
            >
              <Mail className="w-3 h-3" />
              <span>Email</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
