import React, { useState, useEffect } from 'react';
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

const FALLBACK_PLOT_IMAGES = [
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80',
];

export function getPlotFallbackImage(idOrTitle: string = ''): string {
  let hash = 0;
  for (let i = 0; i < idOrTitle.length; i++) {
    hash = (hash << 5) - hash + idOrTitle.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % FALLBACK_PLOT_IMAGES.length;
  return FALLBACK_PLOT_IMAGES[index];
}

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
  
  const initialImg = (plot.plotImages && plot.plotImages.length > 0 && plot.plotImages[0].trim())
    ? plot.plotImages[0]
    : getPlotFallbackImage(plot.id || plot.title);

  const [currentImg, setCurrentImg] = useState<string>(initialImg);

  useEffect(() => {
    setCurrentImg(
      plot.plotImages && plot.plotImages.length > 0 && plot.plotImages[0].trim()
        ? plot.plotImages[0]
        : getPlotFallbackImage(plot.id || plot.title)
    );
  }, [plot.plotImages, plot.id, plot.title]);

  return (
    <div className="bg-white border-2 border-gray-200 hover:border-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
      {/* Image and Badges Header - Clickable to open full detail popup */}
      <div 
        onClick={() => onViewDetails(plot)}
        className="relative aspect-[16/10] overflow-hidden bg-slate-900 cursor-pointer group/img select-none"
        title="Click on image to view full details and layout plan"
      >
        <img
          src={currentImg}
          alt={plot.title}
          referrerPolicy="no-referrer"
          onError={() => {
            const fallback = getPlotFallbackImage(plot.id || plot.title);
            if (currentImg !== fallback) {
              setCurrentImg(fallback);
            }
          }}
          className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500"
        />

        {/* Hover click hint */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10">
          <span className="bg-white/95 backdrop-blur-md text-black px-3.5 py-1.5 rounded-full text-xs font-black shadow-lg flex items-center gap-1.5 transform translate-y-1 group-hover/img:translate-y-0 transition-transform">
            <Maximize2 className="w-3.5 h-3.5 text-[#4FAF00]" />
            <span>Click to View Plot Details</span>
          </span>
        </div>

        {/* Gradient Overlay for badges legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none z-0" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-20">
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
