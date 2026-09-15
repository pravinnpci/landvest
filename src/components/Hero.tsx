import React from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Award, 
  Coins, 
  MapPin, 
  FileCheck2, 
  ArrowUpRight, 
  Sparkles,
  Search
} from 'lucide-react';
import { CompanySettings, CurrencyCode } from '../types';
import { CURRENCIES, formatCurrency } from '../utils/currency';

interface HeroProps {
  settings: CompanySettings;
  activeCurrency: CurrencyCode;
  totalPlotsCount: number;
  onExplorePlots: () => void;
  onOpenCalculator: () => void;
  onFilterChange: (district: string) => void;
  selectedDistrict: string;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  activeCurrency,
  totalPlotsCount,
  onExplorePlots,
  onOpenCalculator,
  onFilterChange,
  selectedDistrict,
}) => {
  return (
    <section className="relative overflow-hidden bg-white border-b border-gray-100 py-12 md:py-20">
      {/* Background soft subtle geometric glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#EBFBD5]/60 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F2FCE8]/80 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            {/* Catchy Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-[#EBFBD5] border border-[#68D800]/40 px-3.5 py-1.5 rounded-full text-xs font-bold text-black shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#68D800] animate-pulse" />
              <span>HIGH-YIELD DTCP LAND INVESTMENTS</span>
              <span className="text-gray-400">|</span>
              <span className="text-emerald-800 font-semibold">12% - 22% Annual Growth</span>
            </div>

            {/* Main Catchy Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black tracking-tight leading-[1.15]">
              Own High-Growth Land. <br />
              <span className="bg-gradient-to-r from-black via-gray-900 to-[#4FAF00] bg-clip-text text-transparent">
                Predict Returns Before You Invest.
              </span>
            </h1>

            {/* Subtitle with Investment Motive */}
            <p className="text-base sm:text-lg text-gray-700 font-normal leading-relaxed max-w-2xl">
              Unlike depreciating apartments with heavy maintenance, prime DTCP-approved land offers 
              <strong> 100% undivided freehold ownership</strong>, zero structural wear, and explosive compounding value across Tamil Nadu & South India high-growth development corridors.
            </p>

            {/* Key Assurance Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-[#F8FCF5] border border-[#D5F2B5] rounded-xl p-3 flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#68D800] text-black">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-black">100% DTCP Approved</div>
                  <div className="text-[11px] text-gray-500">Zero litigation guarantee</div>
                </div>
              </div>

              <div className="bg-[#F8FCF5] border border-[#D5F2B5] rounded-xl p-3 flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#68D800] text-black">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-black">Yearly Predictions</div>
                  <div className="text-[11px] text-gray-500">1 to 10-year flat cast</div>
                </div>
              </div>

              <div className="bg-[#F8FCF5] border border-[#D5F2B5] rounded-xl p-3 flex items-start gap-2.5 col-span-2 sm:col-span-1">
                <div className="p-1.5 rounded-lg bg-[#68D800] text-black">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-black">Procedure Handled</div>
                  <div className="text-[11px] text-gray-500">Patta, EC & Biometric</div>
                </div>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={onExplorePlots}
                className="px-6 py-3.5 bg-[#68D800] hover:bg-[#5bc200] text-black font-extrabold rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 flex items-center gap-2 text-sm"
              >
                <span>Explore Verified DTCP Plots ({totalPlotsCount})</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                onClick={onOpenCalculator}
                className="px-6 py-3.5 bg-black hover:bg-gray-800 text-white font-bold rounded-xl transition-all flex items-center gap-2 text-sm"
              >
                <TrendingUp className="w-4 h-4 text-[#68D800]" />
                <span>Calculate Yearly ROI</span>
              </button>
            </div>

            {/* Live Filter Bar */}
            <div className="pt-2 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#4FAF00]" />
                Popular Corridors:
              </span>
              {['All', 'Coimbatore', 'Chennai', 'Kanchipuram', 'Madurai', 'Bengaluru Rural'].map((dist) => (
                <button
                  key={dist}
                  onClick={() => onFilterChange(dist === 'All' ? '' : dist)}
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-colors ${
                    (dist === 'All' && !selectedDistrict) || selectedDistrict.toLowerCase().includes(dist.toLowerCase())
                      ? 'bg-black text-white font-bold'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {dist}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: High Yield Investment Comparison Card */}
          <div className="lg:col-span-5">
            <div className="bg-white border-2 border-black rounded-2xl p-5 sm:p-6 shadow-xl relative">
              {/* Green Corner Badge */}
              <div className="absolute -top-3.5 right-6 bg-[#68D800] text-black text-[11px] font-black uppercase px-3 py-1 rounded-full tracking-wider shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                INVESTMENT FORECAST
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Model Comparison: ₹40 Lakhs Investment (5 Years)
                  </div>
                  <h3 className="text-xl font-extrabold text-black pt-1">
                    Land Plots vs. Residential Apartment
                  </h3>
                </div>

                {/* Land Plots Card */}
                <div className="bg-[#F4FDEB] border-2 border-[#68D800] rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block bg-[#68D800] text-black text-[10px] font-extrabold px-2 py-0.5 rounded">
                        RECOMMENDED
                      </span>
                      <h4 className="font-extrabold text-black text-base mt-1">
                        DTCP Approved Plot (16% Avg Growth)
                      </h4>
                      <p className="text-xs text-gray-600">
                        100% Freehold Land • Zero Maintenance • High Liquidity
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-gray-500">Value in 5 Yrs</div>
                      <div className="text-lg font-extrabold text-emerald-700">
                        {formatCurrency(8400000, activeCurrency)}
                      </div>
                      <div className="text-[11px] font-bold text-emerald-800 bg-[#D9F7B3] px-1.5 py-0.2 rounded inline-block">
                        +110% Total Yield
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#D5F2B5] grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <div className="text-gray-500 text-[10px]">Year 1</div>
                      <div className="font-bold text-black">{formatCurrency(4640000, activeCurrency)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-[10px]">Year 3</div>
                      <div className="font-bold text-black">{formatCurrency(6240000, activeCurrency)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-[10px]">Year 5</div>
                      <div className="font-extrabold text-emerald-800">{formatCurrency(8400000, activeCurrency)}</div>
                    </div>
                  </div>
                </div>

                {/* Flat / Apartment Contrast */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 opacity-90">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">
                        Residential Apartment / Flat (7% Growth)
                      </h4>
                      <p className="text-xs text-gray-500">
                        Building Depreciation • High Monthly Maintenance • UDS Dilution
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium text-gray-400">Value in 5 Yrs</div>
                      <div className="text-base font-bold text-gray-700">
                        {formatCurrency(5600000, activeCurrency)}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        +40% Net Yield
                      </div>
                    </div>
                  </div>
                </div>

                {/* NRI Currency Callout */}
                <div className="bg-[#111827] text-white p-3 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-[#68D800]" />
                    <span>
                      Overseas Investor? Current Display: <strong>{activeCurrency}</strong> ({CURRENCIES[activeCurrency].name})
                    </span>
                  </div>
                  <span className="text-[#68D800] font-bold text-[11px]">
                    100% Repatriable
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
