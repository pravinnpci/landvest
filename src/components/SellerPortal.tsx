import React, { useState } from 'react';
import { 
  UserCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  PlusCircle, 
  ArrowRight, 
  LogOut, 
  Phone, 
  Mail, 
  Lock, 
  KeyRound, 
  Image as ImageIcon, 
  MapPin, 
  FileCheck2, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  TrendingUp,
  User,
  Upload,
  Loader2
} from 'lucide-react';
import { Plot, Seller } from '../types';
import { formatCurrency, formatRatePerSqFt } from '../utils/currency';
import { apiService } from '../services/api';

interface SellerPortalProps {
  sellers: Seller[];
  plots: Plot[];
  currentSeller: Seller | null;
  onLoginSeller: (seller: Seller) => void;
  onLogoutSeller: () => void;
  onSubmitPlot: (plotData: Omit<Plot, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

export const SellerPortal: React.FC<SellerPortalProps> = ({
  sellers,
  plots,
  currentSeller,
  onLoginSeller,
  onLogoutSeller,
  onSubmitPlot,
  onClose,
}) => {
  // OTP Auth States
  const [mobileOrEmail, setMobileOrEmail] = useState('');
  const [otpStep, setOtpStep] = useState<'input' | 'verify'>('input');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [identifiedSeller, setIdentifiedSeller] = useState<Seller | null>(null);

  // Plot Submission States
  const [isPostingNew, setIsPostingNew] = useState(false);
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
      console.error('Upload failed, keeping current url:', err);
    } finally {
      setIsUploading(null);
    }
  };

  // Owners
  const [ownerName1, setOwnerName1] = useState('');
  const [ownerPhone1, setOwnerPhone1] = useState('');
  const [ownerName2, setOwnerName2] = useState('');
  const [ownerPhone2, setOwnerPhone2] = useState('');
  const [highlightsInput, setHighlightsInput] = useState(
    '100% DTCP Approved, 40ft Tar Road, Underground Drainage, Near Highway Junction'
  );

  // Derived Values
  const cents = Number((totalSqFt / 435.6).toFixed(2));
  const calculatedTotalPrice = totalSqFt * pricePerSqFt;

  // Handle Request OTP
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const query = mobileOrEmail.trim().toLowerCase();
    // Check if seller was onboarded by admin
    const matched = sellers.find(
      (s) =>
        s.phone.replace(/\s+/g, '').includes(query.replace(/\s+/g, '')) ||
        s.email.toLowerCase() === query
    );

    if (!matched) {
      setAuthError(
        'This phone/email is not an onboarded seller. Sellers are created by Admin. Please contact Admin or click a pre-onboarded test seller below.'
      );
      return;
    }

    if (matched.status !== 'active') {
      setAuthError('Your seller profile is currently pending Admin activation.');
      return;
    }

    // Generate simulated 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setIdentifiedSeller(matched);
    setOtpStep('verify');
  };

  // Handle Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp.trim() === generatedOtp || enteredOtp.trim() === '123456') {
      if (identifiedSeller) {
        onLoginSeller(identifiedSeller);
        // Pre-fill owner 1 with seller info
        setOwnerName1(identifiedSeller.name);
        setOwnerPhone1(identifiedSeller.phone);
        setOtpStep('input');
        setEnteredOtp('');
        setGeneratedOtp('');
      }
    } else {
      setAuthError('Invalid OTP code. Please check the code or use the 1-click fill.');
    }
  };

  // Handle Submit Plot
  const handlePlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSeller) return;

    const highlightsArray = highlightsInput
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean);

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
      ownerName1,
      ownerPhone1,
      ownerName2: ownerName2.trim() || undefined,
      ownerPhone2: ownerPhone2.trim() || undefined,
      sellerId: currentSeller.id,
      sellerName: currentSeller.companyName || currentSeller.name,
      sellerPhone: currentSeller.phone,
      status: 'pending_verification', // Per requirement: Seller post required after Admin verified and broadcast
      adminNotes: 'New seller submission. Awaiting admin DTCP check and broadcast approval.',
      expectedAppreciationRate,
      facing,
      roadWidthFt,
      highlights: highlightsArray,
    });

    setPostSuccessMessage(true);
    setIsPostingNew(false);
    setTimeout(() => {
      setPostSuccessMessage(false);
    }, 4000);
  };

  // Filter plots submitted by this seller
  const sellerPlots = currentSeller
    ? plots.filter((p) => p.sellerId === currentSeller.id || p.sellerPhone === currentSeller.phone)
    : [];

  return (
    <div className="py-10 bg-[#FAFCF9] min-h-[80vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#EBFBD5] text-black text-xs font-bold px-3 py-1 rounded-full border border-[#68D800]/50 mb-2">
              <UserCheck className="w-3.5 h-3.5 text-[#4FAF00]" />
              <span>SELLER ONBOARDING & LISTING PORTAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-black">
              Seller Dashboard & Plot Submissions
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Secure OTP Login for Admin-onboarded sellers. All listings are verified and broadcasted by Admin to investors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {currentSeller ? (
              <button
                onClick={onLogoutSeller}
                className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout ({currentSeller.name.split(' ')[0]})</span>
              </button>
            ) : null}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800"
            >
              Back to Catalog
            </button>
          </div>
        </div>

        {/* NOT LOGGED IN: OTP AUTHENTICATION */}
        {!currentSeller ? (
          <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#EBFBD5] text-black mx-auto flex items-center justify-center">
                <KeyRound className="w-6 h-6 text-[#4FAF00]" />
              </div>
              <h2 className="text-xl font-extrabold text-black">Seller OTP Verification</h2>
              <p className="text-xs text-gray-500">
                Enter your mobile number or email onboarded by Admin to receive a 6-digit login OTP.
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {otpStep === 'input' ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Registered Mobile Number or Email *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={mobileOrEmail}
                      onChange={(e) => setMobileOrEmail(e.target.value)}
                      placeholder="+91 98421 11223 or email"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                    />
                    <Phone className="w-4 h-4 text-gray-400 absolute right-3 top-3.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#68D800] hover:bg-[#5bc200] text-black font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Send OTP via SMS / Email</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                {/* Simulated Notification Callout */}
                <div className="p-3.5 bg-[#F4FDEB] border border-[#68D800] rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-black">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#4FAF00]" />
                      <span>Simulated SMS/Email OTP Alert</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setEnteredOtp(generatedOtp)}
                      className="text-[10px] bg-[#68D800] text-black px-2 py-0.5 rounded font-black hover:bg-[#5bc200]"
                    >
                      1-Click Auto Fill
                    </button>
                  </div>
                  <p className="text-gray-600">
                    OTP sent to {identifiedSeller?.phone} ({identifiedSeller?.name}):
                  </p>
                  <div className="text-lg font-mono font-black text-black tracking-widest pt-1">
                    {generatedOtp}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Enter 6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-3 text-center tracking-widest font-mono text-lg font-bold bg-gray-50 border border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-black hover:bg-gray-800 text-white font-extrabold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>Verify OTP & Access Seller Portal</span>
                  <CheckCircle2 className="w-4 h-4 text-[#68D800]" />
                </button>

                <button
                  type="button"
                  onClick={() => setOtpStep('input')}
                  className="w-full text-center text-xs text-gray-500 hover:text-black py-1 font-medium"
                >
                  Change Mobile / Resend OTP
                </button>
              </form>
            )}

            {/* Quick Demo Pre-Onboarded Seller Accounts */}
            <div className="pt-4 border-t border-gray-100">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Quick Test Onboarded Sellers (1-Click Login):
              </div>
              <div className="space-y-1.5">
                {sellers.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setMobileOrEmail(s.phone);
                      setIdentifiedSeller(s);
                      const code = '654321';
                      setGeneratedOtp(code);
                      setEnteredOtp(code);
                      setOtpStep('verify');
                    }}
                    className="w-full text-left p-2 rounded-xl bg-gray-50 hover:bg-[#EBFBD5] border border-gray-200 transition-colors flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-black">{s.name}</div>
                      <div className="text-[10px] text-gray-500">
                        {s.companyName} • {s.district}, {s.state}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-[#4FAF00] font-bold">
                      {s.phone}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* LOGGED IN SELLER VIEW */
          <div className="space-y-8">
            {/* Active Seller Summary Banner */}
            <div className="bg-white border-2 border-[#68D800] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold bg-[#EBFBD5] text-black px-2.5 py-0.5 rounded uppercase">
                  Verified Seller Account
                </span>
                <h2 className="text-xl font-extrabold text-black">
                  Welcome, {currentSeller.name}
                </h2>
                <div className="text-xs text-gray-600 flex items-center gap-3">
                  <span>Organization: <strong>{currentSeller.companyName || 'Independent Seller'}</strong></span>
                  <span>•</span>
                  <span>Region: <strong>{currentSeller.district}, {currentSeller.state}</strong></span>
                  <span>•</span>
                  <span>Phone: <strong>{currentSeller.phone}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPostingNew(!isPostingNew)}
                  className="px-5 py-3 bg-[#68D800] hover:bg-[#5bc200] text-black font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isPostingNew ? 'Close Form' : 'Post New Plot for Verification'}</span>
                </button>
              </div>
            </div>

            {/* Success alert */}
            {postSuccessMessage && (
              <div className="p-4 bg-[#EBFBD5] border-2 border-[#68D800] rounded-2xl text-xs sm:text-sm text-black font-bold flex items-center gap-3 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-[#4FAF00] shrink-0" />
                <span>
                  Plot submitted successfully! Status is <strong>Pending Admin Verification</strong>. Once Admin verifies the DTCP sanction order and location snapshot, it will be broadcasted live to domestic and NRI investors.
                </span>
              </div>
            )}

            {/* POST NEW PLOT FORM */}
            {isPostingNew && (
              <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-black flex items-center gap-2">
                      <PlusCircle className="w-5 h-5 text-[#4FAF00]" />
                      <span>Post New Plot (Sent to Admin for Broadcast Clearance)</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Enter plot specifications, DTCP certificate details, location snapshot, and dual owner contacts.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                    Requires Admin Audit
                  </span>
                </div>

                <form onSubmit={handlePlotSubmit} className="space-y-6 text-xs">
                  {/* Row 1: Title & Location */}
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-black text-sm uppercase tracking-wider text-[#4FAF00]">
                      1. Plot Title & Geography
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-3">
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
                        <label className="block font-bold text-gray-700 mb-1">State *</label>
                        <select
                          value={stateName}
                          onChange={(e) => setStateName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                        >
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Telangana">Telangana</option>
                          <option value="Kerala">Kerala</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">District *</label>
                        <input
                          type="text"
                          required
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          placeholder="e.g. Coimbatore, Chennai, Kanchipuram"
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
                          placeholder="e.g. Saravanampatti SEZ Road, 2km from Ring Road"
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Dimensions & Pricing */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <h4 className="font-extrabold text-black text-sm uppercase tracking-wider text-[#4FAF00]">
                      2. Area, Per Sq.Ft Rate & Total Amount
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
                        <span className="text-[10px] text-gray-500 mt-1 block">
                          Per square foot asking rate
                        </span>
                      </div>

                      <div className="bg-[#EBFBD5] p-3 rounded-xl border border-[#68D800]/50 sm:col-span-2 flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-emerald-900 uppercase">
                          Auto-Calculated Total Investment
                        </span>
                        <div className="text-xl font-extrabold text-black">
                          {formatCurrency(calculatedTotalPrice, 'INR')}
                        </div>
                        <span className="text-[11px] text-gray-600">
                          {totalSqFt} sq.ft × ₹{pricePerSqFt} = ₹{calculatedTotalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">DTCP Approval Sanction No. *</label>
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

                  {/* Row 3: Owners 1 & 2 Contact Details */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <h4 className="font-extrabold text-black text-sm uppercase tracking-wider text-[#4FAF00]">
                      3. Owner Details (Title Deed Holders 1 & 2)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Owner 1 Phone Number *</label>
                          <input
                            type="tel"
                            required
                            value={ownerPhone1}
                            onChange={(e) => setOwnerPhone1(e.target.value)}
                            placeholder="+91 98421 11223"
                            className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Owner 2 */}
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          Co-Owner / Joint Holder 2 (Optional)
                        </span>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Owner 2 Name</label>
                          <input
                            type="text"
                            value={ownerName2}
                            onChange={(e) => setOwnerName2(e.target.value)}
                            placeholder="e.g. S. Rajeshwari"
                            className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Owner 2 Phone Number</label>
                          <input
                            type="tel"
                            value={ownerPhone2}
                            onChange={(e) => setOwnerPhone2(e.target.value)}
                            placeholder="+91 98421 99887"
                            className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Images (Plat Images & Location Image) */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <h4 className="font-extrabold text-black text-sm uppercase tracking-wider text-[#4FAF00]">
                      4. Plat Images, Layout Plan & Location Snapshot
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                          type="url"
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
                          type="url"
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
                          type="url"
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

                  {/* Notice and Submit Button */}
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                    <span className="font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-700" />
                      Verification & Broadcast Protocol:
                    </span>
                    <p>
                      Submitting this plot places it into the Admin Verification Pipeline. The Admin team verifies the DTCP order number against the Directorate records and verifies owner contacts before broadcasting it to public and NRI investors.
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsPostingNew(false)}
                      className="px-5 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-[#68D800] hover:bg-[#5bc200] text-black font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
                    >
                      <span>Submit for Admin Broadcast Clearance</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SELLER PLOTS LIST */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-black flex items-center gap-2">
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
                      className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            {plot.status === 'verified_broadcasted' ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" />
                                LIVE & BROADCASTED
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-amber-500 text-black text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                                <Clock className="w-3 h-3" />
                                PENDING ADMIN BROADCAST
                              </span>
                            )}
                            <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              {plot.dtcpNumber}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-sm text-black line-clamp-1">
                            {plot.title}
                          </h4>
                          <div className="text-xs text-gray-500">
                            {plot.locality}, {plot.district}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-sm font-extrabold text-black">
                            {formatCurrency(plot.totalPrice, 'INR')}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            ₹{plot.pricePerSqFt}/sq.ft
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
                          <span className="font-bold text-black">{plot.ownerName1}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block">Road</span>
                          <span className="font-bold text-black">{plot.roadWidthFt} Ft</span>
                        </div>
                      </div>

                      {plot.adminNotes && (
                        <div className="p-2.5 bg-gray-50 rounded-xl text-[11px] text-gray-700">
                          <span className="font-bold text-black block mb-0.5">Admin Note:</span>
                          <span>{plot.adminNotes}</span>
                        </div>
                      )}
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
