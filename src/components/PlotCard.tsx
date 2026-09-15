import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Maximize2, 
  Phone, 
  User, 
  ArrowUpRight, 
  Compass, 
  TrendingUp,
  Image as ImageIcon,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { CurrencyCode, Plot } from '../types';
import { formatCurrency, formatRatePerSqFt } from '../utils/currency';

interface PlotCardProps {
  plot: Plot;
  activeCurrency: CurrencyCode;
  onViewDetails: (plot: Plot) => void;
  onCalculateYield: (plot: Plot) => void;
  onInquire: (plot: Plot) => void;
}

export const PlotCard: React.FC<PlotCardProps> = ({
  plot,
  activeCurrency,
  onViewDetails,
  onCalculateYield,
  onInquire,
}) => {
  const isVerified = plot.status === 'verified_broadcasted';
  const mainImage = plot.plotImages[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group">
      {/* Image and Badges Header */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={mainImage}
          alt={plot.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay for badges legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <div className="flex flex-col gap-1.5">
            {plot.isDtcpApproved && (
              <span className="inline-flex items-center gap-1 bg-[#68D800] text-black font-extrabold text-[11px] px-2.5 py-1 rounded-md shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-black" />
                DTCP APPROVED
              </span>
            )}
            <span className="inline-flex items-center gap-1 bg-black/80 text-white backdrop-blur-xs font-semibold text-[10px] px-2 py-0.5 rounded">
              {plot.dtcpNumber}
            </span>
          </div>

          {/* Broadcast Status Badge */}
          {isVerified ? (
            <span className="inline-flex items-center gap-1 bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-xs">
              <CheckCircle2 className="w-3 h-3 text-white" />
              BROADCASTED
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-amber-500 text-black font-bold text-[10px] px-2.5 py-1 rounded-full shadow-xs">
              <Lock className="w-3 h-3 text-black" />
              PENDING VERIFICATION
            </span>
          )}
        </div>

        {/* Bottom Image Overlay: Pricing & Yield */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
          <div>
            <div className="text-[11px] text-gray-200 font-medium">Total Investment</div>
            <div className="text-xl font-extrabold text-[#68D800] leading-none">
              {formatCurrency(plot.totalPrice, activeCurrency)}
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-white">
              <TrendingUp className="w-3 h-3 text-[#68D800]" />
              ~{plot.expectedAppreciationRate}% ROI/yr
            </span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Location Hierarchy: State, District, Locality */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold mb-1">
            <MapPin className="w-3.5 h-3.5 text-[#4FAF00] shrink-0" />
            <span className="text-black font-bold">{plot.locality}</span>
          </div>
          <div className="text-[11px] text-gray-500 font-medium pl-5 mb-2">
            {plot.district}, {plot.state}
          </div>

          {/* Plot Title */}
          <h3 
            onClick={() => onViewDetails(plot)}
            className="font-extrabold text-base text-black group-hover:text-[#4FAF00] transition-colors line-clamp-1 cursor-pointer"
          >
            {plot.title}
          </h3>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-3 gap-2 py-3 my-2 border-y border-gray-100 text-xs">
            <div className="bg-gray-50 p-2 rounded-lg text-center">
              <div className="text-[10px] text-gray-400 font-medium uppercase">Plot Area</div>
              <div className="font-extrabold text-black mt-0.5">{plot.totalSqFt} sq.ft</div>
              <div className="text-[10px] text-gray-500 font-semibold">{plot.cents} Cents</div>
            </div>

            <div className="bg-gray-50 p-2 rounded-lg text-center">
              <div className="text-[10px] text-gray-400 font-medium uppercase">Rate/sq.ft</div>
              <div className="font-extrabold text-emerald-800 mt-0.5">
                {formatRatePerSqFt(plot.pricePerSqFt, activeCurrency)}
              </div>
              <div className="text-[10px] text-gray-500 font-semibold">{plot.facing} Face</div>
            </div>

            <div className="bg-gray-50 p-2 rounded-lg text-center">
              <div className="text-[10px] text-gray-400 font-medium uppercase">Approach</div>
              <div className="font-extrabold text-black mt-0.5">{plot.roadWidthFt} Ft Road</div>
              <div className="text-[10px] text-gray-500 font-semibold">Blacktop Tar</div>
            </div>
          </div>

          {/* Owner Details 1 & 2 as requested */}
          <div className="bg-[#F8FCF5] border border-[#E0F5C8] rounded-xl p-3 text-xs space-y-1.5">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex justify-between items-center">
              <span>Verified Ownership Record</span>
              <span className="text-emerald-700 font-extrabold text-[10px]">Admin Audited</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-black font-semibold">
                <User className="w-3.5 h-3.5 text-[#4FAF00]" />
                <span className="line-clamp-1">{plot.ownerName1}</span>
              </div>
              <a 
                href={`tel:${plot.ownerPhone1}`} 
                className="text-[11px] font-bold text-gray-700 hover:text-black flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-gray-200"
              >
                <Phone className="w-2.5 h-2.5 text-[#4FAF00]" />
                <span>{plot.ownerPhone1}</span>
              </a>
            </div>

            {plot.ownerName2 && (
              <div className="flex items-center justify-between pt-1 border-t border-[#E8F8D8]">
                <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span className="line-clamp-1">{plot.ownerName2}</span>
                </div>
                {plot.ownerPhone2 && (
                  <a 
                    href={`tel:${plot.ownerPhone2}`} 
                    className="text-[11px] text-gray-600 hover:text-black flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-gray-200"
                  >
                    <Phone className="w-2.5 h-2.5 text-gray-400" />
                    <span>{plot.ownerPhone2}</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={() => onViewDetails(plot)}
            className="flex-1 py-2.5 px-3 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#68D800]" />
            <span>View Plat & Snaps</span>
          </button>

          <button
            onClick={() => onCalculateYield(plot)}
            className="py-2.5 px-3 bg-[#EBFBD5] hover:bg-[#d8f8a8] border border-[#68D800]/50 text-black font-extrabold text-xs rounded-xl transition-colors flex items-center gap-1"
            title="Forecast Yearly Returns for this plot"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#4FAF00]" />
            <span>ROI</span>
          </button>

          <button
            onClick={() => onInquire(plot)}
            className="py-2.5 px-3 bg-[#68D800] hover:bg-[#5bc200] text-black font-extrabold text-xs rounded-xl transition-colors flex items-center gap-1 shadow-xs"
            title="Direct Booking / Inquire"
          >
            <span>Inquire</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
