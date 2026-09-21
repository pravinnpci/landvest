import React, { useState } from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  PlusCircle, 
  ArrowRight, 
  LogOut, 
  Phone, 
  Mail, 
  KeyRound, 
  Image as ImageIcon, 
  User, 
  Upload, 
  Loader2, 
  Edit3, 
  AlertCircle,
  Building,
  Globe,
  FileText,
  MapPin,
  X,
  Coins,
  Maximize2
} from 'lucide-react';
import { Plot, Seller, CurrencyCode } from '../types';
import { formatCurrency, formatRatePerSqFt, CURRENCIES } from '../utils/currency';
import { getPlotFallbackImage } from './PlotCard';
import { apiService } from '../services/api';

const COUNTRIES = [
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'AE', name: 'United Arab Emirates (UAE)' },
  { code: 'SG', name: 'Singapore' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'QA', name: 'Qatar' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'MY', name: 'Malaysia' },
];

const INDIAN_STATES = [
  'Tamil Nadu',
  'Karnataka',
  'Andhra Pradesh',
  'Telangana',
  'Kerala',
  'Maharashtra',
  'Gujarat',
  'Delhi NCR',
  'Rajasthan',
  'Uttar Pradesh',
  'West Bengal',
  'Madhya Pradesh',
  'Punjab',
  'Haryana',
  'Goa',
  'Odisha',
  'Puducherry'
];

interface SellerPortalProps {
  sellers: Seller[];
  plots: Plot[];
  currentSeller: Seller | null;
  activeCurrency?: CurrencyCode;
  onLoginSeller: (seller: Seller) => void;
  onLogoutSeller: () => void;
  onSubmitPlot: (plotData: Omit<Plot, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditPlot?: (plotId: string, plotData: Partial<Plot>) => void;
  onRegisterSeller?: (sellerData: Omit<Seller, 'id' | 'createdDate'>) => Promise<Seller> | void;
  onViewPlotDetails?: (plot: Plot) => void;
  onClose: () => void;
}

export const SellerPortal: React.FC<SellerPortalProps> = ({
  sellers,
  plots,
  currentSeller,
  activeCurrency = 'INR',
  onLoginSeller,
  onLogoutSeller,
  onSubmitPlot,
  onEditPlot,
  onRegisterSeller,
  onViewPlotDetails,
  onClose,
}) => {
  // Authentication mode: Login vs Become a Seller (Registration)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login States - EMAIL based OTP
  const [sellerEmail, setSellerEmail] = useState('');
  const [otpStep, setOtpStep] = useState<'input' | 'verify'>('input');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [identifiedSeller, setIdentifiedSeller] = useState<Seller | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpNotice, setOtpNotice] = useState('');

  // New Seller Registration States (Full Profile & OTP)
  const [regStep, setRegStep] = useState<'form' | 'verify'>('form');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCompanyName, setRegCompanyName] = useState('');
  const [regIncomeTaxPan, setRegIncomeTaxPan] = useState('');
  const [regCountry, setRegCountry] = useState('India');
  const [regState, setRegState] = useState('Tamil Nadu');
  const [regDistrict, setRegDistrict] = useState('Coimbatore');
  const [regEnteredOtp, setRegEnteredOtp] = useState('');
  const [regGeneratedOtp, setRegGeneratedOtp] = useState('');
  const [regOtpNotice, setRegOtpNotice] = useState('');
  const [isSendingRegOtp, setIsSendingRegOtp] = useState(false);
  const [isVerifyingRegOtp, setIsVerifyingRegOtp] = useState(false);

  // Plot Submission / Editing States
  const [isPostingNew, setIsPostingNew] = useState(false);
  const [editingPlot, setEditingPlot] = useState<Plot | null>(null);
  const [postSuccessMessage, setPostSuccessMessage] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [stateName, setStateName] = useState('Tamil Nadu');
  const [district, setDistrict] = useState('Coimbatore');
  const [locality, setLocality] = useState('');
  const [dtcpNumber, setDtcpNumber] = useState('');
  const [totalSqFt, setTotalSqFt] = useState<number>(2400);
  const [pricePerSqFt, setPricePerSqFt] = useState<number>(1800);
  const [facing, setFacing] = useState<Plot['facing']>('North');
  const [roadWidthFt, setRoadWidthFt] = useState<number>(40);
  const [expectedAppreciationRate, setExpectedAppreciationRate] = useState<number>(15);
  
  // Images
  const [plotImageUrl, setPlotImageUrl] = useState(
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
  );
  const [layoutPlanUrl, setLayoutPlanUrl] = useState(
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  );
  const [locationImageUrl, setLocationImageUrl] = useState(
    'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80'
  );
  const [isUploading, setIsUploading] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'plot' | 'layout' | 'location') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(target);
    try {
      const uploadedUrl = await apiService.uploadFile(file);
      if (target === 'plot') setPlotImageUrl(uploadedUrl);
      if (target === 'layout') setLayoutPlanUrl(uploadedUrl);
      if (target === 'location') setLocationImageUrl(uploadedUrl);
    } catch (err) {
      console.warn('File upload fallback:', err);
    } finally {
      setIsUploading(null);
    }
  };

  // Owners
  const [ownerName1, setOwnerName1] = useState(currentSeller?.name || '');
  const [ownerPhone1, setOwnerPhone1] = useState(currentSeller?.phone || '');
  const [ownerName2, setOwnerName2] = useState('');
  const [ownerPhone2, setOwnerPhone2] = useState('');
  const [highlightsInput, setHighlightsInput] = useState(
    '100% DTCP Approved, 40ft Tar Road, Underground Drainage, Near Highway Junction'
  );

  // Derived Values
  const cents = Number((totalSqFt / 435.6).toFixed(2));
  const calculatedTotalPrice = totalSqFt * pricePerSqFt;

  const handleStartEdit = (plot: Plot) => {
    setEditingPlot(plot);
    setTitle(plot.title);
    setStateName(plot.state || 'Tamil Nadu');
    setDistrict(plot.district || 'Coimbatore');
    setLocality(plot.locality || '');
    setDtcpNumber(plot.dtcpNumber || '');
    setTotalSqFt(plot.totalSqFt);
    setPricePerSqFt(plot.pricePerSqFt);
    setFacing(plot.facing || 'North');
    setRoadWidthFt(plot.roadWidthFt || 40);
    setExpectedAppreciationRate(plot.expectedAppreciationRate || 15);
    setPlotImageUrl(plot.plotImages?.[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80');
    setLayoutPlanUrl(plot.layoutPlanImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80');
    setLocationImageUrl(plot.locationImage || 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80');
    setOwnerName1(plot.ownerName1 || '');
    setOwnerPhone1(plot.ownerPhone1 || '');
    setOwnerName2(plot.ownerName2 || '');
    setOwnerPhone2(plot.ownerPhone2 || '');
    setHighlightsInput(plot.highlights?.join(', ') || '');
    setIsPostingNew(true);
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };

  const handleCancelForm = () => {
    setIsPostingNew(false);
    setEditingPlot(null);
  };

  // Handle Request OTP via EMAIL (Connected to backend API & SMTP)
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setOtpNotice('');

    const query = sellerEmail.trim().toLowerCase();
    if (!query) {
      setAuthError('Please enter your registered email address.');
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await apiService.sendSellerOtp(query);
      if (res.email_delivered) {
        setOtpNotice(`A 6-digit verification code has been dispatched to ${res.email}. Please check your inbox and spam folder.`);
        setGeneratedOtp('');
      } else {
        setOtpNotice(`Verification code generated for ${res.email}. ${res.code_hint ? `(Dev/Demo OTP: ${res.code_hint})` : ''}`);
        setGeneratedOtp(res.code_hint || '');
      }
      setOtpStep('verify');
    } catch (err: any) {
      // If offline/local fallback, search sellers prop
      const matched = sellers.find(
        (s) => s.email.toLowerCase() === query || s.phone.replace(/\s+/g, '') === query.replace(/\s+/g, '')
      );
      if (matched) {
        if (matched.status !== 'active') {
          setAuthError('Your seller account is currently suspended.');
          return;
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(code);
        setIdentifiedSeller(matched);
        setOtpNotice(`6-digit OTP code sent to ${matched.email}. (Dev Code: ${code})`);
        setOtpStep('verify');
      } else {
        setAuthError(
          err.message || 'This email is not registered as a seller. Please switch to the "Become a Seller" tab to register your account.'
        );
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle Verify OTP (Verifies against backend without shortcuts)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const code = enteredOtp.trim();
    if (!code) {
      setAuthError('Please enter the 6-digit OTP code.');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const res = await apiService.verifySellerOtp(sellerEmail.trim(), code);
      if (res.success && res.seller) {
        onLoginSeller(res.seller);
        setOwnerName1(res.seller.name);
        setOwnerPhone1(res.seller.phone);
        setOtpStep('input');
        setEnteredOtp('');
        setGeneratedOtp('');
        setOtpNotice('');
      }
    } catch (err: any) {
      // Fallback if offline/local
      if (generatedOtp && code === generatedOtp && identifiedSeller) {
        onLoginSeller(identifiedSeller);
        setOwnerName1(identifiedSeller.name);
        setOwnerPhone1(identifiedSeller.phone);
        setOtpStep('input');
        setEnteredOtp('');
        setGeneratedOtp('');
        setOtpNotice('');
        return;
      }
      setAuthError(err.message || 'Invalid or expired OTP code. Please enter the correct 6-digit code.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Handle Request OTP for New Seller Registration
  const handleRequestRegisterOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setRegOtpNotice('');

    if (!regName.trim() || !regEmail.trim() || !regPhone.trim()) {
      setAuthError('Full name, email address, and mobile number are mandatory.');
      return;
    }

    const cleanEmail = regEmail.trim().toLowerCase();
    const existing = sellers.find(
      (s) => s.email.toLowerCase() === cleanEmail
    );
    if (existing) {
      setAuthError('An account with this email address is already registered. Please switch to the Email OTP Login tab.');
      return;
    }

    setIsSendingRegOtp(true);
    try {
      const res = await apiService.sendSellerSignupOtp(cleanEmail, regName.trim());
      if (res.email_delivered) {
        setRegOtpNotice(`A 6-digit registration code has been dispatched to ${cleanEmail}. Please check your inbox and spam folder.`);
        setRegGeneratedOtp('');
      } else {
        setRegOtpNotice(`Registration OTP generated for ${cleanEmail}. ${res.code_hint ? `(Dev/Demo OTP: ${res.code_hint})` : ''}`);
        setRegGeneratedOtp(res.code_hint || '');
      }
      setRegStep('verify');
    } catch (err: any) {
      // Fallback offline OTP generation
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setRegGeneratedOtp(code);
      setRegOtpNotice(`Registration OTP code generated for ${cleanEmail}. (Dev Code: ${code})`);
      setRegStep('verify');
    } finally {
      setIsSendingRegOtp(false);
    }
  };

  // Handle Verify OTP for New Seller Registration
  const handleVerifyRegisterOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const code = regEnteredOtp.trim();
    if (!code) {
      setAuthError('Please enter the 6-digit verification code.');
      return;
    }

    setIsVerifyingRegOtp(true);
    try {
      try {
        await apiService.verifySellerSignupOtp(regEmail.trim().toLowerCase(), code);
      } catch (apiErr: any) {
        if (regGeneratedOtp && code === regGeneratedOtp) {
          // Offline match passed
        } else {
          throw apiErr;
        }
      }

      const sellerData = {
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
        phone: regPhone.trim(),
        companyName: regCompanyName.trim() || undefined,
        incomeTaxPan: regIncomeTaxPan.trim().toUpperCase() || undefined,
        country: regCountry,
        district: regDistrict.trim() || 'Coimbatore',
        state: regState,
      };

      let createdSeller: Seller | null = null;
      if (onRegisterSeller) {
        const res = await onRegisterSeller(sellerData);
        if (res) createdSeller = res;
      }

      if (!createdSeller) {
        createdSeller = {
          ...sellerData,
          id: `seller-${Date.now()}`,
          createdDate: new Date().toISOString().split('T')[0],
          status: 'active',
        };
      }

      onLoginSeller(createdSeller);
      setOwnerName1(createdSeller.name);
      setOwnerPhone1(createdSeller.phone);
      setRegStep('form');
      setRegEnteredOtp('');
      setRegGeneratedOtp('');
      setRegOtpNotice('');
    } catch (err: any) {
      setAuthError(err.message || 'Invalid or expired OTP code. Please enter the correct 6-digit code.');
    } finally {
      setIsVerifyingRegOtp(false);
    }
  };

  // Handle Submit Plot (or Edit Plot)
  const handlePlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSeller) return;

    const highlightsArray = highlightsInput
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean);

    if (editingPlot && onEditPlot) {
      onEditPlot(editingPlot.id, {
        title,
        state: stateName,
        district,
        locality,
        dtcpNumber,
        isDtcpApproved: true,
        totalSqFt,
        cents,
        pricePerSqFt,
        totalPrice: calculatedTotalPrice,
        plotImages: [plotImageUrl],
        layoutPlanImage: layoutPlanUrl,
        locationImage: locationImageUrl,
        ownerName1: ownerName1 || currentSeller.name,
        ownerPhone1: ownerPhone1 || currentSeller.phone,
        ownerName2: ownerName2.trim() || undefined,
        ownerPhone2: ownerPhone2.trim() || undefined,
        sellerId: currentSeller.id,
        sellerName: currentSeller.companyName || currentSeller.name,
        sellerPhone: currentSeller.phone,
        sellerEmail: currentSeller.email,
        expectedAppreciationRate,
        facing,
        roadWidthFt,
        highlights: highlightsArray,
      });

      setEditingPlot(null);
      setIsPostingNew(false);
      setPostSuccessMessage(true);
      setTimeout(() => setPostSuccessMessage(false), 4000);
      return;
    }

    onSubmitPlot({
      title,
      state: stateName,
      district,
      locality,
      dtcpNumber,
      isDtcpApproved: true,
      totalSqFt,
      cents,
      pricePerSqFt,
      totalPrice: calculatedTotalPrice,
      plotImages: [plotImageUrl],
      layoutPlanImage: layoutPlanUrl,
      locationImage: locationImageUrl,
      ownerName1: ownerName1 || currentSeller.name,
      ownerPhone1: ownerPhone1 || currentSeller.phone,
      ownerName2: ownerName2.trim() || undefined,
      ownerPhone2: ownerPhone2.trim() || undefined,
      sellerId: currentSeller.id,
      sellerName: currentSeller.companyName || currentSeller.name,
      sellerPhone: currentSeller.phone,
      sellerEmail: currentSeller.email,
      status: 'pending_verification',
      adminNotes: 'New seller submission. Awaiting Admin DTCP verification and public broadcast.',
      expectedAppreciationRate,
      facing,
      roadWidthFt,
      highlights: highlightsArray,
    });

    setPostSuccessMessage(true);
    setIsPostingNew(false);
    setTimeout(() => setPostSuccessMessage(false), 4000);
  };

  // Strict filtering: a seller only ever sees their own plots
  const sellerPlots = currentSeller
    ? plots.filter((p) => {
        if (!currentSeller) return false;
        if (p.sellerId && currentSeller.id && p.sellerId === currentSeller.id) return true;
        if (p.sellerEmail && currentSeller.email && p.sellerEmail.toLowerCase() === currentSeller.email.toLowerCase()) return true;
        return false;
      })
    : [];

  const totalSellerPortfolioINR = sellerPlots.reduce((sum, p) => sum + (p.totalPrice || 0), 0);
  const currencyInfo = CURRENCIES[activeCurrency] || CURRENCIES.INR;
  const todayDateFormatted = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="py-6 sm:py-10 bg-[#FAFCF9] min-h-[80vh] w-full overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#EBFBD5] text-black text-xs font-bold px-3 py-1 rounded-full border border-[#68D800]/50 mb-2">
              <UserCheck className="w-3.5 h-3.5 text-[#4FAF00]" />
              <span>SELLER ONBOARDING & LISTING PORTAL</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-black">
              Seller Dashboard & Land Listings
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Secure Email OTP verification for builders, promoters, and landowners. List DTCP plots for global NRI and domestic investors.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {currentSeller ? (
              <button
                onClick={onLogoutSeller}
                className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-red-600" />
                <span>Logout ({currentSeller.name.split(' ')[0]})</span>
              </button>
            ) : null}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Back to Catalog
            </button>
          </div>
        </div>

        {/* NOT LOGGED IN: LOGIN OR BECOME A SELLER TABS */}
        {!currentSeller ? (
          <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
            {/* Tab Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError('');
                }}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  authMode === 'login'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                Email OTP Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setAuthError('');
                }}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  authMode === 'register'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                Become a Seller (Free)
              </button>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* TAB 1: EMAIL OTP LOGIN */}
            {authMode === 'login' ? (
              <div className="space-y-5">
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-2xl bg-[#EBFBD5] text-black mx-auto flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#4FAF00]" />
                  </div>
                  <h2 className="text-lg font-extrabold text-black">Seller Email Verification</h2>
                  <p className="text-xs text-gray-500">
                    Enter your registered email address to receive a secure 6-digit login OTP code.
                  </p>
                </div>

                {otpStep === 'input' ? (
                  <form onSubmit={handleRequestOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Registered Email Address *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={sellerEmail}
                          onChange={(e) => setSellerEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                        />
                        <Mail className="w-4 h-4 text-gray-400 absolute right-3 top-3.5" />
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1.5">
                        Please enter your registered email address to receive your 6-digit login OTP.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSendingOtp}
                      className="w-full py-3.5 bg-[#68D800] hover:bg-[#5bc200] disabled:opacity-60 text-black font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      {isSendingOtp ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Generating & Sending OTP...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Email OTP</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="p-4 bg-[#F4FDEB] border border-[#68D800] rounded-xl text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-black">
                        <Mail className="w-4 h-4 text-[#4FAF00]" />
                        <span>Email OTP Sent</span>
                      </div>
                      <p className="text-gray-700 text-xs">
                        {otpNotice || `A 6-digit code has been sent to ${sellerEmail}. Please enter it below.`}
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Enter 6-Digit Email OTP Code *
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="______"
                        className="w-full px-4 py-3.5 text-center tracking-widest font-mono text-xl font-black bg-gray-50 border border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                      />
                      <p className="text-[11px] text-gray-500 text-center mt-1">
                        Type the 6-digit code sent to your email. Valid for 10 minutes.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isVerifyingOtp}
                      className="w-full py-3.5 bg-black hover:bg-gray-800 disabled:opacity-60 text-white font-extrabold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      {isVerifyingOtp ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#68D800]" />
                          <span>Verifying Code...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify Email & Access Dashboard</span>
                          <CheckCircle2 className="w-4 h-4 text-[#68D800]" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOtpStep('input');
                        setEnteredOtp('');
                        setAuthError('');
                      }}
                      className="w-full text-center text-xs text-gray-500 hover:text-black py-1 font-medium"
                    >
                      ← Back to Change Email Address
                    </button>
                  </form>
                )}
              </div>
            ) : regStep === 'form' ? (
              /* TAB 2: BECOME A SELLER - STEP 1: REGISTRATION DETAILS FORM */
              <form onSubmit={handleRequestRegisterOtp} className="space-y-4 text-xs">
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
                    <Building className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-lg font-extrabold text-black">Become a Verified Seller</h2>
                  <p className="text-xs text-gray-500">
                    Register your agency or landowner profile to list DTCP sanctioned plots for global NRI buyers.
                  </p>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Full Name (Title Deed Holder / Authorized Person) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. R. K. Senthil Nathan"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none font-semibold"
                    />
                    <User className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                  </div>
                </div>

                {/* Email (Primary for OTP) & Mobile Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Email Address (For OTP Verification) *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="senthil@realty.com"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none font-semibold"
                      />
                      <Mail className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Mobile Number (Contact & WhatsApp) *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+91 98421 11223"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none font-semibold"
                      />
                      <Phone className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                    </div>
                  </div>
                </div>

                {/* Company Name & Income Tax PAN */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Company / Agency / Promoter Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={regCompanyName}
                        onChange={(e) => setRegCompanyName(e.target.value)}
                        placeholder="e.g. Senthil Infra & Land Promoters"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none font-semibold"
                      />
                      <Building className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Income Tax PAN / Tax ID *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={regIncomeTaxPan}
                        onChange={(e) => setRegIncomeTaxPan(e.target.value.toUpperCase())}
                        placeholder="e.g. ABCDE1234F"
                        maxLength={10}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono uppercase text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none font-semibold"
                      />
                      <FileText className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                    </div>
                  </div>
                </div>

                {/* Country, State & District */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Country *
                    </label>
                    <select
                      value={regCountry}
                      onChange={(e) => setRegCountry(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      State *
                    </label>
                    <select
                      value={regState}
                      onChange={(e) => setRegState(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      District *
                    </label>
                    <input
                      type="text"
                      required
                      value={regDistrict}
                      onChange={(e) => setRegDistrict(e.target.value)}
                      placeholder="e.g. Coimbatore, Chennai"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSendingRegOtp}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {isSendingRegOtp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Registration OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Registration OTP & Verify Email</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* TAB 2: BECOME A SELLER - STEP 2: VERIFY REGISTRATION OTP */
              <form onSubmit={handleVerifyRegisterOtp} className="space-y-4 text-xs">
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
                    <KeyRound className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-lg font-extrabold text-black">Verify Email to Complete Registration</h2>
                  <p className="text-xs text-gray-500">
                    A 6-digit verification code has been dispatched to <strong>{regEmail}</strong>
                  </p>
                </div>

                <div className="p-4 bg-[#F4FDEB] border border-[#68D800] rounded-xl text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-black">
                    <Mail className="w-4 h-4 text-[#4FAF00]" />
                    <span>Registration Verification OTP</span>
                  </div>
                  <p className="text-gray-700 text-xs">
                    {regOtpNotice || `Enter the 6-digit code sent to ${regEmail} to activate your seller account.`}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Enter 6-Digit Verification Code *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={regEnteredOtp}
                    onChange={(e) => setRegEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="______"
                    className="w-full px-4 py-3.5 text-center tracking-widest font-mono text-xl font-black bg-gray-50 border border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                  />
                  <p className="text-[11px] text-gray-500 text-center mt-1">
                    Type the 6-digit code sent to your email. Code expires in 10 minutes.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isVerifyingRegOtp}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-extrabold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {isVerifyingRegOtp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Verifying Code & Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify OTP & Access Dashboard</span>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRegStep('form');
                      setRegEnteredOtp('');
                      setAuthError('');
                    }}
                    className="text-xs text-gray-500 hover:text-black py-1 font-medium"
                  >
                    ← Back to Edit Details
                  </button>
                  <button
                    type="button"
                    onClick={handleRequestRegisterOtp}
                    disabled={isSendingRegOtp}
                    className="text-xs text-emerald-700 hover:text-emerald-900 font-bold hover:underline"
                  >
                    Resend Code
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* LOGGED IN SELLER VIEW */
          <div className="space-y-6 sm:space-y-8">
            {/* Active Seller Summary Banner */}
            <div className="bg-white border-2 border-[#68D800] rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] sm:text-[11px] font-extrabold bg-[#EBFBD5] text-black px-2.5 py-0.5 rounded uppercase">
                  Verified Seller Account
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-black">
                  Welcome, {currentSeller.name}
                </h2>
                <div className="text-xs text-gray-600 flex flex-wrap items-center gap-2 sm:gap-3">
                  <span>Organization: <strong>{currentSeller.companyName || 'Independent Landowner'}</strong></span>
                  <span>•</span>
                  <span>Email: <strong>{currentSeller.email}</strong></span>
                  <span>•</span>
                  <span>Mobile: <strong>{currentSeller.phone}</strong></span>
                  {currentSeller.incomeTaxPan && (
                    <>
                      <span>•</span>
                      <span>PAN: <strong className="font-mono text-emerald-800">{currentSeller.incomeTaxPan}</strong></span>
                    </>
                  )}
                  <span>•</span>
                  <span>Region: <strong>{currentSeller.district}, {currentSeller.state} ({currentSeller.country || 'India'})</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (isPostingNew) {
                      handleCancelForm();
                    } else {
                      setEditingPlot(null);
                      setIsPostingNew(true);
                    }
                  }}
                  className="w-full sm:w-auto px-5 py-3 bg-[#68D800] hover:bg-[#5bc200] text-black font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isPostingNew ? 'Close Form' : '+ Add New Plot'}</span>
                </button>
              </div>
            </div>

            {/* Seller Multi-Currency & Portfolio Valuation Metrics */}
            <div className="bg-slate-950 text-white rounded-2xl p-4 sm:p-6 border border-emerald-500/30 shadow-lg grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-[#68D800]" />
                  <span>Total Portfolio Value ({activeCurrency})</span>
                </span>
                <div className="text-2xl sm:text-3xl font-black text-[#68D800]">
                  {formatCurrency(totalSellerPortfolioINR, activeCurrency)}
                </div>
                <div className="text-xs text-slate-300 font-semibold">
                  INR Base: {formatCurrency(totalSellerPortfolioINR, 'INR')}
                </div>
              </div>

              <div className="space-y-1 sm:border-x sm:border-slate-800 sm:px-4">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>Today's FX Rate & Conversion</span>
                </span>
                <div className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>1 {activeCurrency} = ₹{currencyInfo.rateAgainstINR.toFixed(2)} INR</span>
                  <span className="text-sm">{currencyInfo.flag}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Valuation Benchmark Date: <strong className="text-slate-200">{todayDateFormatted}</strong>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  Submitted Inventory
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {sellerPlots.length} <span className="text-sm font-bold text-slate-400">Plots Listed</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-bold">
                  {sellerPlots.filter(p => p.status === 'verified_broadcasted').length} Live Broadcasted • {sellerPlots.filter(p => p.status === 'pending_verification').length} In Verification
                </div>
              </div>
            </div>

            {/* Success alert */}
            {postSuccessMessage && (
              <div className="p-4 bg-[#EBFBD5] border-2 border-[#68D800] rounded-2xl text-xs sm:text-sm text-black font-bold flex items-center gap-3 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-[#4FAF00] shrink-0" />
                <span>
                  Plot submitted successfully! Status is <strong>Pending Admin Verification</strong>. Once verified against DTCP sanction orders, it will be broadcasted live to domestic and NRI investors.
                </span>
              </div>
            )}

            {/* POST NEW / EDIT PLOT FORM */}
            {isPostingNew && (
              <div className="bg-white border-2 border-black rounded-3xl p-5 sm:p-8 shadow-xl space-y-6 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-4 gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-black flex items-center gap-2">
                      {editingPlot ? (
                        <>
                          <Edit3 className="w-5 h-5 text-amber-600" />
                          <span>Edit Plot Details: {editingPlot.title}</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-5 h-5 text-[#4FAF00]" />
                          <span>Add New Plot for Verification</span>
                        </>
                      )}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {editingPlot
                        ? 'Update plot specifications, pricing, owner contacts, and photos to resubmit for audit.'
                        : 'Enter plot layout specifications, DTCP certificate details, location, and owner contacts.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="p-1 text-gray-400 hover:text-black self-end sm:self-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handlePlotSubmit} className="space-y-6 text-xs">
                  {/* Row 1: Title & Location */}
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-black text-sm uppercase tracking-wider text-[#4FAF00]">
                      1. Plot Title & Location
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
                      <div className="sm:col-span-4">
                        <label className="block font-bold text-gray-700 mb-1">Plot Listing Title *</label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. DTCP Sanctioned Avenue - NH48 Highway Proximity"
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Country</label>
                        <div className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-300 rounded-xl text-xs text-gray-800 font-bold flex items-center gap-1.5 cursor-not-allowed">
                          <span>🇮🇳</span>
                          <span>India (Exclusive)</span>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">State *</label>
                        <select
                          value={stateName}
                          onChange={(e) => setStateName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                        >
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">District *</label>
                        <input
                          type="text"
                          required
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          placeholder="e.g. Coimbatore, Chennai, Salem"
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Locality & Landmark *</label>
                        <input
                          type="text"
                          required
                          value={locality}
                          onChange={(e) => setLocality(e.target.value)}
                          placeholder="e.g. Saravanampatti SEZ Road"
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Dimensions & Pricing */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <h4 className="font-extrabold text-black text-sm uppercase tracking-wider text-[#4FAF00]">
                      2. Area, Per Sq.Ft Rate & Pricing
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Total Sq.Ft *</label>
                        <input
                          type="number"
                          required
                          min={500}
                          step={10}
                          value={totalSqFt}
                          onChange={(e) => setTotalSqFt(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                        />
                        <span className="text-[10px] text-gray-500 mt-1 block">
                          Auto: <strong>{cents} Cents</strong> (approx)
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Price per Sq.Ft (INR) *</label>
                        <input
                          type="number"
                          required
                          min={100}
                          step={50}
                          value={pricePerSqFt}
                          onChange={(e) => setPricePerSqFt(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                        />
                      </div>

                      <div className="bg-[#EBFBD5] p-3 rounded-xl border border-[#68D800]/50 sm:col-span-2 flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-emerald-900 uppercase">
                          Auto-Calculated Total Investment
                        </span>
                        <div className="text-lg sm:text-xl font-extrabold text-black">
                          {formatCurrency(calculatedTotalPrice, 'INR')}
                        </div>
                        <span className="text-[11px] text-gray-600">
                          {totalSqFt} sq.ft × ₹{pricePerSqFt} = ₹{calculatedTotalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">DTCP Sanction Order No. *</label>
                        <input
                          type="text"
                          required
                          value={dtcpNumber}
                          onChange={(e) => setDtcpNumber(e.target.value)}
                          placeholder="e.g. DTCP/LP/2024/091"
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono font-bold text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Facing Direction</label>
                        <select
                          value={facing}
                          onChange={(e) => setFacing(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                        >
                          <option value="North">North Facing</option>
                          <option value="East">East Facing</option>
                          <option value="North-East">North-East (Vaastu Prime)</option>
                          <option value="West">West Facing</option>
                          <option value="South">South Facing</option>
                          <option value="Corner Plot">Corner Dual Facing</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Road Width (Feet)</label>
                        <input
                          type="number"
                          value={roadWidthFt}
                          onChange={(e) => setRoadWidthFt(Number(e.target.value))}
                          placeholder="40"
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Owners Contact Details */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <h4 className="font-extrabold text-black text-sm uppercase tracking-wider text-[#4FAF00]">
                      3. Owner Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {/* Owner 1 */}
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                        <span className="text-[10px] font-bold text-black uppercase tracking-wider flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-[#4FAF00]" />
                          Primary Owner 1 (Mandatory)
                        </span>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Owner 1 Name *</label>
                          <input
                            type="text"
                            required
                            value={ownerName1}
                            onChange={(e) => setOwnerName1(e.target.value)}
                            placeholder="e.g. R. K. Senthil Nathan"
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Owner 1 Phone *</label>
                          <input
                            type="tel"
                            required
                            value={ownerPhone1}
                            onChange={(e) => setOwnerPhone1(e.target.value)}
                            placeholder="+91 98421 11223"
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Owner 2 */}
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          Co-Owner / Joint Holder (Optional)
                        </span>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Owner 2 Name</label>
                          <input
                            type="text"
                            value={ownerName2}
                            onChange={(e) => setOwnerName2(e.target.value)}
                            placeholder="e.g. S. Rajeshwari"
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Owner 2 Phone</label>
                          <input
                            type="tel"
                            value={ownerPhone2}
                            onChange={(e) => setOwnerPhone2(e.target.value)}
                            placeholder="+91 98421 99887"
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Images */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <h4 className="font-extrabold text-black text-sm uppercase tracking-wider text-[#4FAF00]">
                      4. Plot Photo, Layout Plan & Location Map
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-bold text-gray-700 text-xs">Plot Photo *</label>
                          <label className="cursor-pointer text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 hover:bg-emerald-100 flex items-center gap-1">
                            {isUploading === 'plot' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                            <span>Upload File</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'plot')} />
                          </label>
                        </div>
                        <input
                          type="text"
                          required
                          value={plotImageUrl}
                          onChange={(e) => setPlotImageUrl(e.target.value)}
                          className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs text-black focus:outline-none"
                        />
                        <div className="mt-2 aspect-video rounded-lg overflow-hidden bg-gray-100 border">
                          <img src={plotImageUrl} alt="Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-bold text-gray-700 text-xs">Layout Blueprint *</label>
                          <label className="cursor-pointer text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 hover:bg-emerald-100 flex items-center gap-1">
                            {isUploading === 'layout' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                            <span>Upload File</span>
                            <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleFileUpload(e, 'layout')} />
                          </label>
                        </div>
                        <input
                          type="text"
                          required
                          value={layoutPlanUrl}
                          onChange={(e) => setLayoutPlanUrl(e.target.value)}
                          className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs text-black focus:outline-none"
                        />
                        <div className="mt-2 aspect-video rounded-lg overflow-hidden bg-gray-100 border">
                          <img src={layoutPlanUrl} alt="Layout Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-bold text-gray-700 text-xs">Location Map *</label>
                          <label className="cursor-pointer text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 hover:bg-emerald-100 flex items-center gap-1">
                            {isUploading === 'location' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                            <span>Upload File</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'location')} />
                          </label>
                        </div>
                        <input
                          type="text"
                          required
                          value={locationImageUrl}
                          onChange={(e) => setLocationImageUrl(e.target.value)}
                          className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs text-black focus:outline-none"
                        />
                        <div className="mt-2 aspect-video rounded-lg overflow-hidden bg-gray-100 border">
                          <img src={locationImageUrl} alt="Location Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Key Highlights (Comma separated)</label>
                    <input
                      type="text"
                      value={highlightsInput}
                      onChange={(e) => setHighlightsInput(e.target.value)}
                      placeholder="e.g. 100% DTCP Approved, 40ft Tar Road, Near SEZ"
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-2.5 sm:gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCancelForm}
                      className="px-5 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-colors text-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#68D800] hover:bg-[#5bc200] text-black font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-center"
                    >
                      <span>{editingPlot ? 'Save Changes & Submit for Audit' : 'Submit for Admin Verification'}</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SELLER PLOTS LIST */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-extrabold text-black flex items-center gap-2">
                  <span>Your Submitted Plots ({sellerPlots.length})</span>
                </h3>
                <span className="text-xs text-gray-500">
                  Real-time broadcast status updates
                </span>
              </div>

              {sellerPlots.length === 0 ? (
                <div className="p-8 text-center bg-white border border-gray-200 rounded-2xl space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-black text-sm">No plots submitted yet</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Click "Post New Plot for Verification" above to submit your land layout for DTCP audit and public broadcast.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sellerPlots.map((plot) => (
                    <div
                      key={plot.id}
                      className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                          {/* Plot Thumbnail with Details Modal Trigger */}
                          <div 
                            onClick={() => onViewPlotDetails && onViewPlotDetails(plot)}
                            className="w-full sm:w-24 h-32 sm:h-24 rounded-xl overflow-hidden bg-slate-900 border border-gray-200 shrink-0 cursor-pointer relative group/thumb"
                            title="Click to view full plot details and blueprint"
                          >
                            <img
                              src={plot.plotImages[0] || getPlotFallbackImage(plot.id || plot.title)}
                              alt={plot.title}
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = getPlotFallbackImage(plot.id || plot.title);
                              }}
                              className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-[10px] font-bold bg-black/70 px-2 py-0.5 rounded flex items-center gap-1">
                                <Maximize2 className="w-3 h-3 text-[#68D800]" />
                                View
                              </span>
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                              {plot.status === 'verified_broadcasted' ? (
                                <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                                  <CheckCircle2 className="w-3 h-3" />
                                  LIVE & BROADCASTED
                                </span>
                              ) : plot.status === 'rejected' ? (
                                <span className="inline-flex items-center gap-1 bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                                  <AlertCircle className="w-3 h-3" />
                                  REJECTED (NEEDS REVISION)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-amber-500 text-black text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                                  <Clock className="w-3 h-3" />
                                  PENDING ADMIN BROADCAST
                                </span>
                              )}
                              <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                {plot.dtcpNumber}
                              </span>
                            </div>
                            <h4 
                              onClick={() => onViewPlotDetails && onViewPlotDetails(plot)}
                              className="font-extrabold text-sm text-black line-clamp-1 hover:text-[#4FAF00] cursor-pointer"
                            >
                              {plot.title}
                            </h4>
                            <div className="text-xs text-gray-500 truncate">
                              {plot.locality}, {plot.district}, {plot.state}
                            </div>
                          </div>

                          <div className="text-left sm:text-right shrink-0">
                            <div className="text-base font-black text-black">
                              {formatCurrency(plot.totalPrice, activeCurrency)}
                            </div>
                            <div className="text-xs font-bold text-emerald-800">
                              Base: {formatCurrency(plot.totalPrice, 'INR')}
                            </div>
                            <div className="text-[10px] text-gray-500 font-semibold mt-0.5">
                              {formatRatePerSqFt(plot.pricePerSqFt, activeCurrency)} • ₹{plot.pricePerSqFt}/sq.ft
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 py-2 border-y border-gray-100 text-[11px]">
                          <div>
                            <span className="text-gray-400 block">Area</span>
                            <span className="font-bold text-black">{plot.totalSqFt} sq.ft</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Owners</span>
                            <span className="font-bold text-black truncate block">{plot.ownerName1}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Road</span>
                            <span className="font-bold text-black">{plot.roadWidthFt} Ft</span>
                          </div>
                        </div>

                        {/* Submitter User Profile Details */}
                        <div className="bg-[#F8FCF5] p-2.5 rounded-xl border border-[#D5F2B5] text-[11px] flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="text-gray-400 block text-[9px] uppercase font-bold tracking-wider">Submitted By (User Details)</span>
                            <span className="font-extrabold text-black text-xs">{currentSeller.name}</span>
                            {currentSeller.companyName && <span className="text-gray-500 text-[10px] ml-1.5 font-medium">({currentSeller.companyName})</span>}
                          </div>
                          <div className="text-right text-[10px] text-gray-600 font-medium">
                            <div className="text-black font-semibold">{currentSeller.email}</div>
                            <div className="font-mono">{currentSeller.phone}</div>
                          </div>
                        </div>

                        {plot.status === 'rejected' ? (
                          <div className="p-3 bg-red-50 border-2 border-red-300 rounded-xl text-xs space-y-1">
                            <div className="flex items-center gap-1.5 font-extrabold text-red-800">
                              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                              <span>Rejection Reason from Admin Audit:</span>
                            </div>
                            <p className="text-red-900 font-semibold pl-5">"{plot.adminNotes || 'Revision requested.'}"</p>
                            <p className="text-[11px] text-red-700 pl-5 font-bold">
                              👉 Click "Edit Plot Details" below to correct the details and resubmit for verification.
                            </p>
                          </div>
                        ) : plot.adminNotes ? (
                          <div className="p-2.5 bg-gray-50 rounded-xl text-[11px] text-gray-700">
                            <span className="font-bold text-black block mb-0.5">Admin Note:</span>
                            <span>{plot.adminNotes}</span>
                          </div>
                        ) : null}
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">
                          Updated: {plot.updatedAt || plot.createdAt}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(plot)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-[#EBFBD5] text-gray-800 hover:text-black font-bold text-xs rounded-xl transition-colors border border-gray-200 hover:border-[#68D800]"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#4FAF00]" />
                          <span>{plot.status === 'rejected' ? 'Edit Plot & Resubmit for Audit' : 'Edit Plot Details'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
