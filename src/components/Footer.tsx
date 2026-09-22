import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  PhoneCall, 
  Mail, 
  MapPin, 
  UserCheck, 
  TrendingUp, 
  Globe2,
  FileCheck2
} from 'lucide-react';
import { CompanySettings } from '../types';

interface FooterProps {
  settings: CompanySettings;
  onTabChange: (tab: string) => void;
  onOpenSellerPortal: () => void;
  onOpenAdminPortal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onTabChange,
  onOpenSellerPortal,
  onOpenAdminPortal,
}) => {
  return (
    <footer className="bg-[#111827] text-white border-t border-gray-800 w-full overflow-hidden">
      {/* Top Value Banner */}
      <div className="border-b border-gray-800 py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-[#68D800] text-black flex items-center justify-center font-black shrink-0">
              <ShieldCheck className="w-6 h-6 text-black" />
            </div>
            <div>
              <div className="font-extrabold text-white text-sm">
                100% DTCP Approved & Admin Verified
              </div>
              <div className="text-gray-400 text-xs">
                {settings.dtcpAssuranceBadgeText}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenSellerPortal}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Become a Seller / Seller Login</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info (Dynamic) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#68D800] text-black flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                {settings.companyName}
              </span>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              {settings.tagline}. We empower domestic and overseas NRI investors with mathematical yearly return predictions and complete legal diligence for freehold land.
            </p>

            <div className="pt-2 text-xs space-y-2 text-gray-300">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-[#68D800] shrink-0" />
                <a href={`tel:${settings.primaryPhone}`} className="hover:text-white font-semibold">
                  {settings.primaryPhone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#68D800] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-start gap-2 text-gray-400">
                <MapPin className="w-3.5 h-3.5 text-[#68D800] shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">{settings.officeAddress}</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3 text-xs">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-[11px] text-[#68D800]">
              Investor Portals
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button onClick={() => onTabChange('plots')} className="hover:text-white transition-colors">
                  Explore DTCP Plots
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('predictions')} className="hover:text-white transition-colors">
                  Yearly Predictions (ROI)
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('procedure')} className="hover:text-white transition-colors">
                  Procedure We Take Care
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('nri')} className="hover:text-white transition-colors">
                  NRI & US Investor Desk
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('about')} className="hover:text-white transition-colors">
                  Legal Assurance
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('contact')} className="hover:text-white transition-colors">
                  Contact Us
                </button>
              </li>
              {onOpenAdminPortal && (
                <li className="pt-2 border-t border-gray-800/80">
                  <button onClick={onOpenAdminPortal} className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1">
                    <span>Admin Portal</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Key Corridors */}
          <div className="space-y-3 text-xs">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-[11px] text-[#68D800]">
              Growth Corridors
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li>Coimbatore - Saravanampatti IT & SEZ</li>
              <li>Chennai - Sriperumbudur Industrial Hub</li>
              <li>Kanchipuram - Parandur Airport Zone</li>
              <li>Madurai - Ring Road Junction</li>
              <li>Hosur / Bengaluru Rural Expressway</li>
              <li>Salem & Erode Textile Corridors</li>
            </ul>
          </div>

          {/* Legal Due Diligence */}
          <div className="space-y-3 text-xs">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-[11px] text-[#68D800]">
              Legal Assurance
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-1.5">
                <FileCheck2 className="w-3 h-3 text-[#68D800]" />
                <span>30-Year EC Certified</span>
              </li>
              <li className="flex items-center gap-1.5">
                <FileCheck2 className="w-3 h-3 text-[#68D800]" />
                <span>Direct Revenue Patta</span>
              </li>
              <li className="flex items-center gap-1.5">
                <FileCheck2 className="w-3 h-3 text-[#68D800]" />
                <span>Taluk DGPS Demarcation</span>
              </li>
              <li className="flex items-center gap-1.5">
                <FileCheck2 className="w-3 h-3 text-[#68D800]" />
                <span>Consulate Special POA</span>
              </li>
              <li className="flex items-center gap-1.5">
                <FileCheck2 className="w-3 h-3 text-[#68D800]" />
                <span>100% Repatriable Capital</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="mt-10 pt-6 border-t border-gray-800 text-[11px] text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © {new Date().getFullYear()} {settings.companyName}. All rights reserved. Registered DTCP Facilitator.
          </div>
          <div className="text-gray-400 text-center sm:text-right">
            <span>High-Yield Prediction Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
