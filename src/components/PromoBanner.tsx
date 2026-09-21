import React from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  ArrowUpRight, 
  Sparkles,
  Plane,
  BadgePercent
} from 'lucide-react';
import { CurrencyCode } from '../types';

interface PromoBannerProps {
  activeCurrency: CurrencyCode;
  onExplorePlots: () => void;
  onOpenCalculator: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  activeCurrency,
  onExplorePlots,
  onOpenCalculator,
}) => {
  return (
    <section className="py-6 sm:py-8 px-3 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 border border-emerald-500/30 text-white p-4 sm:p-8 lg:p-10">
        {/* Background Ambient Glows & Geometric Effects */}
        <div className="absolute -top-24 -right-24 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 sm:w-80 h-60 sm:h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left Text Pitch */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
              <span>Institutional Global Land Gateway 2026</span>
            </div>

            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Invest Global Capital. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                Secure 100% DTCP Approved Land Corridors in India.
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Targeted growth corridors across Coimbatore IT Corridor, Parandur International Airport Belt, and Madurai Smart City. Enjoy 12% - 22% compound appreciation with seamless remote Consulate Power of Attorney (POA) and 100% legal repatriation under RBI FEMA norms.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
              <button
                onClick={onExplorePlots}
                className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-center"
              >
                <span>Browse Live DTCP Plots</span>
                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
              </button>

              <button
                onClick={onOpenCalculator}
                className="px-4 py-3 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 text-center"
              >
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Forecast 5 & 10-Yr ROI</span>
              </button>
            </div>
          </div>

          {/* Right Highlights Visual Badge */}
          <div className="lg:col-span-5 xl:col-span-4 bg-slate-900/90 backdrop-blur-xl border border-slate-700/70 p-4 sm:p-5 rounded-2xl space-y-3.5 w-full">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Investor Assurance</span>
              <span className="text-[10px] sm:text-[11px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Verified
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-xs">30-Year Chain Deed Legal Audit</div>
                  <div className="text-[11px] text-slate-400">Panel advocates verify clean encumbrance (EC).</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Plane className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-xs">Consulate Remote POA Assistance</div>
                  <div className="text-[11px] text-slate-400">Buy from USA, UAE, or Europe without flying to India.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <BadgePercent className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-xs">15% - 22% Annual Appreciation</div>
                  <div className="text-[11px] text-slate-400">Strategic expressway & SEZ corridors.</div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Display Currency: <strong className="text-white">{activeCurrency}</strong></span>
              <span className="text-emerald-400 font-semibold">Repatriable up to $1M/yr</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
