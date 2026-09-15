import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  MapPin, 
  User, 
  Phone, 
  TrendingUp, 
  CheckCircle2, 
  FileCheck2, 
  Calendar, 
  Compass, 
  Layers, 
  Send,
  Coins,
  ArrowUpRight
} from 'lucide-react';
import { CurrencyCode, Plot } from '../types';
import { formatCurrency, formatRatePerSqFt } from '../utils/currency';

interface PlotDetailModalProps {
  plot: Plot | null;
  isOpen: boolean;
  onClose: () => void;
  activeCurrency: CurrencyCode;
  onSubmitInquiry: (inquiryData: {
    plotId: string;
    plotTitle: string;
    name: string;
    email: string;
    phone: string;
    country: string;
    currency: CurrencyCode;
    horizonYears: number;
    message: string;
  }) => void;
}

export const PlotDetailModal: React.FC<PlotDetailModalProps> = ({
  plot,
  isOpen,
  onClose,
  activeCurrency,
  onSubmitInquiry,
}) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'layout' | 'location' | 'roi'>('photos');
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryCountry, setInquiryCountry] = useState('India');
  const [inquiryHorizon, setInquiryHorizon] = useState(3);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !plot) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitInquiry({
      plotId: plot.id,
      plotTitle: plot.title,
      name: inquiryName,
      email: inquiryEmail,
      phone: inquiryPhone,
      country: inquiryCountry,
      currency: activeCurrency,
      horizonYears: inquiryHorizon,
      message: inquiryMessage,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  // 1, 2, 3, 5, 10-year calculations
  const roiCalculations = [1, 2, 3, 5, 10].map((yr) => {
    const val = Math.round(plot.totalPrice * Math.pow(1 + plot.expectedAppreciationRate / 100, yr));
    const profit = val - plot.totalPrice;
    return {
      year: yr,
      value: val,
      profit,
      gainPercent: (((val - plot.totalPrice) / plot.totalPrice) * 100).toFixed(0),
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-black hover:text-white border border-gray-200 flex items-center justify-center transition-all shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 bg-[#FBFDFB]">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 bg-[#68D800] text-black font-extrabold text-xs px-3 py-1 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5 text-black" />
              100% DTCP APPROVED
            </span>
            <span className="text-xs font-mono font-bold bg-black text-white px-2.5 py-1 rounded">
              Order: {plot.dtcpNumber}
            </span>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded">
              ID: {plot.id}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-black tracking-tight">
            {plot.title}
          </h2>

          <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-1 font-medium">
            <MapPin className="w-4 h-4 text-[#4FAF00] shrink-0" />
            <span>{plot.locality}, {plot.district}, {plot.state}</span>
          </div>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-gray-200 px-6 bg-white overflow-x-auto text-xs font-bold text-gray-600 gap-2">
          <button
            onClick={() => setActiveTab('photos')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'photos'
                ? 'border-black text-black font-extrabold'
                : 'border-transparent hover:text-black'
            }`}
          >
            Plot Photos ({plot.plotImages.length})
          </button>
          <button
            onClick={() => setActiveTab('layout')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'layout'
                ? 'border-black text-black font-extrabold'
                : 'border-transparent hover:text-black'
            }`}
          >
            Plat Master Layout
          </button>
          <button
            onClick={() => setActiveTab('location')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'location'
                ? 'border-black text-black font-extrabold'
                : 'border-transparent hover:text-black'
            }`}
          >
            Location & Satellite Snap
          </button>
          <button
            onClick={() => setActiveTab('roi')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'roi'
                ? 'border-[#68D800] text-black font-extrabold bg-[#EBFBD5]/30'
                : 'border-transparent hover:text-black'
            }`}
          >
            Yearly Predictions (1-10 Yrs)
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {activeTab === 'photos' && (
            <div className="space-y-4">
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={plot.plotImages[0]}
                  alt={plot.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              {plot.plotImages.length > 1 && (
                <div className="grid grid-cols-3 gap-3">
                  {plot.plotImages.slice(1).map((img, idx) => (
                    <div key={idx} className="aspect-[16/10] rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                      <img src={img} alt={`Plot detail ${idx + 2}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="space-y-3">
              <div className="p-3 bg-[#EBFBD5] border border-[#68D800]/40 rounded-xl text-xs text-black font-semibold flex items-center justify-between">
                <span>Official DTCP Demarcated Masterplan with 30ft/40ft Blacktop Roads</span>
                <span className="font-mono text-emerald-800">Approved Layout</span>
              </div>
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gray-900 border border-gray-200 flex items-center justify-center relative">
                <img
                  src={plot.layoutPlanImage}
                  alt="Plat Layout Blueprint"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                />
                <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[11px] px-3 py-1 rounded-lg backdrop-blur-xs font-semibold">
                  Facing: {plot.facing} • Road: {plot.roadWidthFt} Ft Wide
                </div>
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div className="space-y-3">
              <div className="p-3 bg-gray-100 rounded-xl text-xs text-gray-700 flex items-center justify-between">
                <span>Satellite Aerial Landmark Snap & Approach Corridor</span>
                <span className="font-bold text-black">{plot.locality}</span>
              </div>
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gray-900 border border-gray-200 relative">
                <img
                  src={plot.locationImage}
                  alt="Location Snap"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-xs font-bold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#68D800]" />
                  <span>{plot.district} High-Growth Corridor</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roi' && (
            <div className="space-y-4">
              <div className="p-4 bg-black text-white rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="text-xs text-[#68D800] font-bold uppercase tracking-wider">
                    Compound Annual Appreciation Model
                  </div>
                  <div className="text-2xl font-black mt-0.5">
                    {plot.expectedAppreciationRate}% Projected Yearly Growth
                  </div>
                  <p className="text-xs text-gray-300">
                    Based on upcoming highway expansion and industrial infrastructure developments.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Current Base Cost</div>
                  <div className="text-xl font-extrabold text-white">
                    {formatCurrency(plot.totalPrice, activeCurrency)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {roiCalculations.map((item) => (
                  <div key={item.year} className="bg-[#F8FCF5] border border-[#D5F2B5] p-3 rounded-xl text-center">
                    <div className="text-xs font-extrabold text-black">Year {item.year}</div>
                    <div className="text-sm font-extrabold text-emerald-800 mt-1">
                      {formatCurrency(item.value, activeCurrency)}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      Gain: +{formatCurrency(item.profit, activeCurrency)}
                    </div>
                    <div className="mt-1 inline-block bg-[#EBFBD5] text-emerald-900 text-[10px] font-bold px-1.5 py-0.2 rounded">
                      +{item.gainPercent}% ROI
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing & Dimensions Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase">Total Investment</span>
              <div className="text-lg font-black text-black mt-0.5">
                {formatCurrency(plot.totalPrice, activeCurrency)}
              </div>
              <span className="text-[10px] text-gray-500 font-medium">In {activeCurrency}</span>
            </div>

            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase">Rate per Sq.Ft</span>
              <div className="text-base font-extrabold text-emerald-800 mt-0.5">
                {formatRatePerSqFt(plot.pricePerSqFt, activeCurrency)}
              </div>
              <span className="text-[10px] text-gray-500 font-medium">Clear pricing</span>
            </div>

            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase">Plot Dimensions</span>
              <div className="text-base font-bold text-black mt-0.5">
                {plot.totalSqFt} sq.ft
              </div>
              <span className="text-[10px] text-gray-500 font-semibold">{plot.cents} Cents (approx)</span>
            </div>

            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase">Facing & Access</span>
              <div className="text-base font-bold text-black mt-0.5">
                {plot.facing}
              </div>
              <span className="text-[10px] text-gray-500 font-semibold">{plot.roadWidthFt} Ft Tar Road</span>
            </div>
          </div>

          {/* Verified Owner Details (Name 1,2 and Phone 1,2) */}
          <div className="bg-[#F8FCF5] border-2 border-[#D5F2B5] rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-extrabold text-black text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4FAF00]" />
                <span>Verified Land Owners & Title Deed Holders</span>
              </h4>
              <span className="text-[11px] bg-[#68D800] text-black font-extrabold px-2 py-0.5 rounded">
                Direct Clear Title
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                <div className="text-[10px] font-bold text-gray-400 uppercase">Primary Owner (1)</div>
                <div className="font-extrabold text-black text-sm mt-0.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#4FAF00]" />
                  <span>{plot.ownerName1}</span>
                </div>
                <a
                  href={`tel:${plot.ownerPhone1}`}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-[#EBFBD5] text-black font-bold text-xs rounded-lg hover:bg-[#d8f8a8] transition-colors"
                >
                  <Phone className="w-3 h-3 text-[#4FAF00]" />
                  <span>{plot.ownerPhone1}</span>
                </a>
              </div>

              {plot.ownerName2 ? (
                <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Co-Owner / Joint Holder (2)</div>
                  <div className="font-extrabold text-black text-sm mt-0.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span>{plot.ownerName2}</span>
                  </div>
                  {plot.ownerPhone2 ? (
                    <a
                      href={`tel:${plot.ownerPhone2}`}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-800 font-bold text-xs rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Phone className="w-3 h-3 text-gray-500" />
                      <span>{plot.ownerPhone2}</span>
                    </a>
                  ) : (
                    <div className="text-[11px] text-gray-400 mt-2">Contact through Primary Owner</div>
                  )}
                </div>
              ) : (
                <div className="bg-white p-3.5 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-xs text-gray-400">
                  Single Owner Sole Proprietor Plot
                </div>
              )}
            </div>

            {/* Highlights List */}
            {plot.highlights && plot.highlights.length > 0 && (
              <div className="mt-4 pt-3 border-t border-[#D5F2B5]">
                <div className="text-xs font-bold text-black mb-2">Plot Highlights & Infrastructure:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-gray-700">
                  {plot.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4FAF00] shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Procedure We Take Care Badge for this plot */}
          <div className="bg-gray-900 text-white rounded-2xl p-4 sm:p-5 text-xs">
            <div className="font-bold text-sm text-[#68D800] mb-2 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-[#68D800]" />
              <span>Full Procedure We Take Care For You:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-gray-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#68D800] shrink-0 mt-0.5" />
                <span>30-Year Encumbrance Certificate & Parent Deed verification</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#68D800] shrink-0 mt-0.5" />
                <span>Patta, Chitta & Adangal revenue transfer in buyer name</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#68D800] shrink-0 mt-0.5" />
                <span>Demarcation stones & biometric registration guidance</span>
              </div>
            </div>
          </div>

          {/* Direct Inquiry / Booking Form */}
          <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-xs">
            <h4 className="font-extrabold text-black text-base mb-1 flex items-center gap-2">
              <Send className="w-4 h-4 text-[#4FAF00]" />
              <span>Lock This Plot or Request Full Legal Dossier</span>
            </h4>
            <p className="text-xs text-gray-500 mb-4">
              Our legal and property advisors will share the certified DTCP plan, link documents, and schedule a physical or live video site tour.
            </p>

            {submitted ? (
              <div className="p-4 bg-[#EBFBD5] border border-[#68D800] rounded-xl text-center text-sm font-bold text-black flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#4FAF00]" />
                <span>Inquiry submitted successfully! Our Senior Land Advisor will contact you within 2 business hours.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      placeholder="e.g. Anand Sundaram"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Mobile / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      placeholder="+91 98401 23456 or +1 408 555 0192"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      placeholder="name@email.com"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Current Country of Residence</label>
                    <select
                      value={inquiryCountry}
                      onChange={(e) => setInquiryCountry(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                    >
                      <option value="India">India</option>
                      <option value="USA">United States (USA)</option>
                      <option value="UAE">United Arab Emirates (UAE/Dubai)</option>
                      <option value="UK">United Kingdom (UK)</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Other">Other Overseas / NRI</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Specific Questions / Visit Requirement</label>
                  <textarea
                    rows={2}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="e.g. Please share DTCP order copy and arrange a weekend video site inspection."
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#68D800] hover:bg-[#5bc200] text-black font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Submit Inquiry & Reserve Site Visit</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
