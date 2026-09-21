import React from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Coins, 
  MapPin, 
  FileCheck2, 
  ArrowUpRight, 
  Sparkles
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
    <section className="relative overflow-hidden bg-white border-b border-gray-100 py-8 sm:py-12 md:py-20 w-full">
      {/* Background soft subtle geometric glow */}
      <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-[#EBFBD5]/60 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 sm:w-80 h-64 sm:h-80 bg-[#F2FCE8]/80 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            {/* Catchy Pill Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#EBFBD5] border border-[#68D800]/40 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold text-black shadow-xs max-w-full">
              <span className="w-2 h-2 rounded-full bg-[#68D800] animate-pulse shrink-0" />
              <span className="truncate">HIGH-YIELD DTCP LAND INVESTMENTS</span>
              <span className="text-gray-400 hidden sm:inline">|</span>
              <span className="text-emerald-800 font-semibold hidden sm:inline">12% - 22% Annual Growth</span>
            </div>

            {/* Main Catchy Title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-black tracking-tight leading-[1.15]">
              Own High-Growth Land. <br />
              <span className="bg-gradient-to-r from-black via-gray-900 to-[#4FAF00] bg-clip-text text-transparent">
                Predict Returns Before You Invest.
              </span>
            </h1>

            {/* Subtitle with Investment Motive */}
            <p className="text-sm sm:text-base md:text-lg text-gray-700 font-normal leading-relaxed max-w-2xl">
              Unlike depreciating apartments with heavy maintenance, prime DTCP-approved land offers 
              <strong> 100% undivided freehold ownership</strong>, zero structural wear, and explosive compounding value across Tamil Nadu & South India high-growth development corridors.
            </p>

            {/* Key Assurance Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1">
              <div className="bg-[#F8FCF5] border border-[#D5F2B5] rounded-xl p-3 flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#68D800] text-black shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-black">100% DTCP Approved</div>
                  <div className="text-[11px] text-gray-500">Zero litigation guarantee</div>
                </div>
              </div>

              <div className="bg-[#F8FCF5] border border-[#D5F2B5] rounded-xl p-3 flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#68D800] text-black shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-black">Yearly Predictions</div>
                  <div className="text-[11px] text-gray-500">1 to 10-year flat cast</div>
                </div>
              </div>

              <div className="bg-[#F8FCF5] border border-[#D5F2B5] rounded-xl p-3 flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#68D800] text-black shrink-0">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-black">Procedure Handled</div>
                  <div className="text-[11px] text-gray-500">Patta, EC & Biometric</div>
                </div>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
              <button
                onClick={onExplorePlots}
                className="px-5 py-3.5 bg-[#68D800] hover:bg-[#5bc200] text-black font-extrabold rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-xs sm:text-sm text-center"
              >
                <span>Explore Verified DTCP Plots ({totalPlotsCount})</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                onClick={onOpenCalculator}
                className="px-5 py-3.5 bg-black hover:bg-gray-800 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm text-center"
              >
                <TrendingUp className="w-4 h-4 text-[#68D800]" />
                <span>Calculate Yearly ROI</span>
              </button>
            </div>

            {/* Live Filter Bar */}
            <div className="pt-2 flex items-center gap-1.5 sm:gap-2 flex-wrap text-xs">
              <span className="font-bold text-gray-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#4FAF00] shrink-0" />
                Corridors:
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
          <div className="lg:col-span-5 w-full">
            <div className="bg-white border-2 border-black rounded-2xl p-4 sm:p-6 shadow-xl relative">
              {/* Green Corner Badge */}
              <div className="absolute -top-3.5 right-4 sm:right-6 bg-[#68D800] text-black text-[10px] sm:text-[11px] font-black uppercase px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full tracking-wider shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                INVESTMENT FORECAST
              </div>

              <div className="space-y-3.5 sm:space-y-4">
                <div>
                  <div className="text-[11px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Model Comparison: ₹40 Lakhs Investment (5 Years)
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-black pt-1">
                    Land Plots vs. Residential Apartment
                  </h3>
                </div>

                {/* Land Plots Card */}
                <div className="bg-[#F4FDEB] border-2 border-[#68D800] rounded-xl p-3.5 sm:p-4">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="inline-block bg-[#68D800] text-black text-[10px] font-extrabold px-2 py-0.5 rounded">
                        RECOMMENDED
                      </span>
                      <h4 className="font-extrabold text-black text-sm sm:text-base mt-1">
                        DTCP Approved Plot (16% Avg Growth)
                      </h4>
                      <p className="text-[11px] sm:text-xs text-gray-600">
                        100% Freehold Land • Zero Maintenance • High Liquidity
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] sm:text-xs font-semibold text-gray-500">Value in 5 Yrs</div>
                      <div className="text-base sm:text-lg font-extrabold text-emerald-700">
                        {formatCurrency(8400000, activeCurrency)}
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-bold text-emerald-800 bg-[#D9F7B3] px-1.5 py-0.2 rounded inline-block">
                        +110% Net Yield
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#D5F2B5] grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <div className="text-gray-500 text-[10px]">Year 1</div>
                      <div className="font-bold text-black text-[11px] sm:text-xs">{formatCurrency(4640000, activeCurrency)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-[10px]">Year 3</div>
                      <div className="font-bold text-black text-[11px] sm:text-xs">{formatCurrency(6240000, activeCurrency)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-[10px]">Year 5</div>
                      <div className="font-extrabold text-emerald-800 text-[11px] sm:text-xs">{formatCurrency(8400000, activeCurrency)}</div>
                    </div>
                  </div>
                </div>

                {/* Flat / Apartment Contrast */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 sm:p-3.5 opacity-90">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-bold text-gray-800 text-xs sm:text-sm">
                        Residential Apartment / Flat (7% Growth)
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        Building Depreciation • Maintenance • UDS Dilution
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] font-medium text-gray-400">Value in 5 Yrs</div>
                      <div className="text-sm sm:text-base font-bold text-gray-700">
                        {formatCurrency(5600000, activeCurrency)}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        +40% Net Yield
                      </div>
                    </div>
                  </div>
                </div>

                {/* NRI Currency Callout */}
                <div className="bg-[#111827] text-white p-3 rounded-xl flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Coins className="w-4 h-4 text-[#68D800] shrink-0" />
                    <span className="truncate text-[11px] sm:text-xs">
                      Currency: <strong>{activeCurrency}</strong> ({CURRENCIES[activeCurrency].name})
                    </span>
                  </div>
                  <span className="text-[#68D800] font-bold text-[10px] sm:text-[11px] shrink-0">
                    100% Repatriable
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Visual Corridors Showcase Banner with Glitter Badges */}
        <div className="mt-10 sm:mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-black text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3 h-3 text-black animate-sparkle" />
                  PRIME HOTSPOTS 2026
                </span>
                <span className="text-xs font-bold text-gray-500">Curated DTCP & Freehold Investment Zones</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-black mt-1">
                Featured South India High-Growth Land Corridors
              </h3>
            </div>
            <button
              onClick={onExplorePlots}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 group"
            >
              <span>View All Corridors</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Corridor Card 1 */}
            <div 
              onClick={() => { onFilterChange('Kanchipuram'); onExplorePlots(); }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#68D800] bg-black"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80" 
                  alt="Parandur Greenfield Airport Corridor" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-85"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="bg-[#68D800] text-black text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 animate-sparkle" />
                    22% ROI Projection
                  </span>
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                    Kanchipuram
                  </span>
                </div>
                <div>
                  <h4 className="text-white font-extrabold text-sm sm:text-base group-hover:text-[#68D800] transition-colors">
                    Parandur Greenfield Airport Corridor
                  </h4>
                  <p className="text-[11px] text-gray-300 line-clamp-1 mt-0.5">
                    Fast-growing aerotropolis belt with 6-lane expressway access & 100% DTCP sanction.
                  </p>
                </div>
              </div>
            </div>

            {/* Corridor Card 2 */}
            <div 
              onClick={() => { onFilterChange('Coimbatore'); onExplorePlots(); }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#68D800] bg-black"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=800&q=80" 
                  alt="Saravanampatti IT Expressway" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-85"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="bg-amber-400 text-black text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 animate-sparkle" />
                    High Rental Liquidity
                  </span>
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                    Coimbatore
                  </span>
                </div>
                <div>
                  <h4 className="text-white font-extrabold text-sm sm:text-base group-hover:text-amber-300 transition-colors">
                    Saravanampatti IT Expressway
                  </h4>
                  <p className="text-[11px] text-gray-300 line-clamp-1 mt-0.5">
                    Surrounded by global tech parks, premium colleges & 40ft blacktop avenue roads.
                  </p>
                </div>
              </div>
            </div>

            {/* Corridor Card 3 */}
            <div 
              onClick={() => { onFilterChange('Chennai'); onExplorePlots(); }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#68D800] bg-black"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80" 
                  alt="Oragadam Industrial Mega Corridor" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-85"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="bg-emerald-400 text-black text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5 inline" />
                    Immediate Patta Transfer
                  </span>
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                    Chennai / Sriperumbudur
                  </span>
                </div>
                <div>
                  <h4 className="text-white font-extrabold text-sm sm:text-base group-hover:text-emerald-300 transition-colors">
                    Oragadam EV & Tech Corridor
                  </h4>
                  <p className="text-[11px] text-gray-300 line-clamp-1 mt-0.5">
                    Asia's biggest auto & electronic hardware SEZ belt with rapid capital multiplication.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
