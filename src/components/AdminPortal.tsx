import React, { useState } from 'react';
import { 
  Lock, 
  Settings, 
  ShieldCheck, 
  UserPlus, 
  Radio, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Trash2, 
  LogOut, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Clock, 
  AlertCircle,
  Eye,
  Plus,
  RefreshCw,
  Coins
} from 'lucide-react';
import { CompanySettings, Plot, PlotInquiry, Seller } from '../types';
import { formatCurrency, formatRatePerSqFt } from '../utils/currency';

interface AdminPortalProps {
  settings: CompanySettings;
  plots: Plot[];
  sellers: Seller[];
  inquiries: PlotInquiry[];
  isAdminLoggedIn: boolean;
  onLoginAdmin: () => void;
  onLogoutAdmin: () => void;
  onUpdateSettings: (newSettings: CompanySettings) => void;
  onVerifyAndBroadcastPlot: (plotId: string) => void;
  onRejectPlot: (plotId: string, reason: string) => void;
  onDeletePlot: (plotId: string) => void;
  onAddSeller: (seller: Omit<Seller, 'id' | 'createdDate'>) => void;
  onToggleSellerStatus: (sellerId: string) => void;
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  settings,
  plots,
  sellers,
  inquiries,
  isAdminLoggedIn,
  onLoginAdmin,
  onLogoutAdmin,
  onUpdateSettings,
  onVerifyAndBroadcastPlot,
  onRejectPlot,
  onDeletePlot,
  onAddSeller,
  onToggleSellerStatus,
  onClose,
}) => {
  // Login States
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'settings' | 'broadcast' | 'sellers' | 'inventory' | 'leads'>('broadcast');

  // Editable Settings Form
  const [companyName, setCompanyName] = useState(settings.companyName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [primaryPhone, setPrimaryPhone] = useState(settings.primaryPhone);
  const [secondaryPhone, setSecondaryPhone] = useState(settings.secondaryPhone);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [email, setEmail] = useState(settings.email);
  const [nriDeskEmail, setNriDeskEmail] = useState(settings.nriDeskEmail);
  const [officeAddress, setOfficeAddress] = useState(settings.officeAddress);
  const [dtcpAssuranceBadgeText, setDtcpAssuranceBadgeText] = useState(settings.dtcpAssuranceBadgeText);
  const [defaultGrowthRate, setDefaultGrowthRate] = useState(settings.defaultAnnualGrowthRate);
  const [savedNotice, setSavedNotice] = useState(false);

  // New Seller Onboarding Form
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerCompany, setSellerCompany] = useState('');
  const [sellerDistrict, setSellerDistrict] = useState('Coimbatore');
  const [sellerState, setSellerState] = useState('Tamil Nadu');
  const [sellerCreatedAlert, setSellerCreatedAlert] = useState(false);

  // Reject modal state
  const [rejectPlotId, setRejectPlotId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (username === 'admin' && password === 'admin123') ||
      (username === 'admin@realestate.com' && password === 'admin')
    ) {
      onLoginAdmin();
      setLoginError('');
    } else {
      setLoginError('Invalid admin credentials. Use admin / admin123');
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      companyName,
      tagline,
      primaryPhone,
      secondaryPhone,
      whatsappNumber,
      email,
      nriDeskEmail,
      officeAddress,
      dtcpAssuranceBadgeText,
      defaultAnnualGrowthRate: defaultGrowthRate,
      usdtToInrRate: settings.usdtToInrRate,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleCreateSeller = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerName || !sellerPhone || !sellerEmail) return;

    onAddSeller({
      name: sellerName,
      phone: sellerPhone,
      email: sellerEmail,
      companyName: sellerCompany || `${sellerName} Realtors`,
      district: sellerDistrict,
      state: sellerState,
      status: 'active',
    });

    setSellerCreatedAlert(true);
    setSellerName('');
    setSellerPhone('');
    setSellerEmail('');
    setSellerCompany('');
    setTimeout(() => setSellerCreatedAlert(false), 3500);
  };

  const pendingPlots = plots.filter((p) => p.status === 'pending_verification');
  const broadcastedPlots = plots.filter((p) => p.status === 'verified_broadcasted');

  return (
    <div className="py-10 bg-[#FAFCF9] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-black text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
              <Lock className="w-3.5 h-3.5 text-[#68D800]" />
              <span>ADMINISTRATIVE COMMAND CENTER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-black">
              Admin Verification & Platform Controls
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Dynamic company configuration, DTCP verification pipeline, seller onboarding & broadcast controls.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdminLoggedIn && (
              <button
                onClick={onLogoutAdmin}
                className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Exit Admin Mode</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800"
            >
              Back to Catalog
            </button>
          </div>
        </div>

        {/* LOGIN FORM IF NOT AUTHENTICATED */}
        {!isAdminLoggedIn ? (
          <div className="max-w-md mx-auto bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#68D800] text-black mx-auto flex items-center justify-center font-black">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-extrabold text-black">Admin Access Required</h2>
              <p className="text-xs text-gray-500">
                Sign in to edit dynamic company settings, onboard seller accounts, and broadcast pending plots.
              </p>
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Username / Admin Email</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Admin Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#68D800] hover:bg-[#5bc200] text-black font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Authenticate Admin Session</span>
              </button>
            </form>

            <div className="pt-3 border-t border-gray-100 text-center">
              <span className="text-[11px] text-gray-500 block mb-1">Default Demo Admin Credentials:</span>
              <div className="inline-block bg-gray-100 px-3 py-1 rounded text-xs font-mono font-bold text-gray-800">
                admin / admin123
              </div>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="space-y-6">
            {/* Admin Tabs Bar */}
            <div className="flex border-b border-gray-200 bg-white rounded-2xl p-1.5 shadow-xs overflow-x-auto text-xs font-bold text-gray-600 gap-1">
              <button
                onClick={() => setActiveTab('broadcast')}
                className={`py-2.5 px-4 rounded-xl transition-colors flex items-center gap-2 ${
                  activeTab === 'broadcast'
                    ? 'bg-[#68D800] text-black font-extrabold shadow-xs'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span>Verification Pipeline ({pendingPlots.length} Pending)</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`py-2.5 px-4 rounded-xl transition-colors flex items-center gap-2 ${
                  activeTab === 'settings'
                    ? 'bg-black text-white font-extrabold shadow-xs'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Settings className="w-4 h-4 text-[#68D800]" />
                <span>Dynamic Company & Brand</span>
              </button>

              <button
                onClick={() => setActiveTab('sellers')}
                className={`py-2.5 px-4 rounded-xl transition-colors flex items-center gap-2 ${
                  activeTab === 'sellers'
                    ? 'bg-black text-white font-extrabold shadow-xs'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <UserPlus className="w-4 h-4 text-[#68D800]" />
                <span>Seller Onboarding ({sellers.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('inventory')}
                className={`py-2.5 px-4 rounded-xl transition-colors flex items-center gap-2 ${
                  activeTab === 'inventory'
                    ? 'bg-black text-white font-extrabold shadow-xs'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Building2 className="w-4 h-4 text-[#68D800]" />
                <span>Inventory Master ({plots.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('leads')}
                className={`py-2.5 px-4 rounded-xl transition-colors flex items-center gap-2 ${
                  activeTab === 'leads'
                    ? 'bg-black text-white font-extrabold shadow-xs'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Mail className="w-4 h-4 text-[#68D800]" />
                <span>Investor Inquiries ({inquiries.length})</span>
              </button>
            </div>

            {/* TAB 1: VERIFICATION & BROADCAST PIPELINE */}
            {activeTab === 'broadcast' && (
              <div className="space-y-6">
                <div className="p-4 bg-[#EBFBD5] border border-[#68D800]/50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-extrabold text-black text-sm block">
                      Seller Post Verification & Broadcast Protocol
                    </span>
                    <span className="text-gray-700">
                      As mandated, seller submissions remain hidden from domestic and NRI investors until you verify the DTCP sanction order copy and approve broadcast.
                    </span>
                  </div>
                  <span className="bg-black text-white font-mono font-bold px-3 py-1 rounded-lg shrink-0 text-center">
                    {pendingPlots.length} Needs Audit
                  </span>
                </div>

                {pendingPlots.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-3xl p-10 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#EBFBD5] text-[#4FAF00] mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-black text-base">All Plots Verified & Broadcasted</h3>
                    <p className="text-xs text-gray-500 max-w-md mx-auto">
                      There are no pending seller submissions waiting for review. All approved plots are actively streaming on the live investor catalog.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {pendingPlots.map((plot) => (
                      <div
                        key={plot.id}
                        className="bg-white border-2 border-amber-400 rounded-3xl p-6 shadow-md space-y-6"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="bg-amber-500 text-black text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                AWAITING BROADCAST APPROVAL
                              </span>
                              <span className="text-xs font-mono font-bold bg-gray-100 text-black px-2.5 py-0.5 rounded">
                                DTCP Sanction: {plot.dtcpNumber}
                              </span>
                            </div>
                            <h3 className="text-lg font-extrabold text-black">{plot.title}</h3>
                            <div className="text-xs text-gray-500">
                              {plot.locality}, {plot.district}, {plot.state} • Submitted by{' '}
                              <strong>{plot.sellerName}</strong> ({plot.sellerPhone})
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xl font-black text-black">
                              {formatCurrency(plot.totalPrice, 'INR')}
                            </div>
                            <div className="text-xs text-emerald-800 font-bold">
                              ₹{plot.pricePerSqFt}/sq.ft • {plot.totalSqFt} sq.ft ({plot.cents} Cents)
                            </div>
                          </div>
                        </div>

                        {/* Images Inspection (Plat & Location Snap) */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <span className="text-[11px] font-bold text-gray-500 block mb-1">Plot Physical Image</span>
                            <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border">
                              <img src={plot.plotImages[0]} alt="Plot" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            </div>
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-gray-500 block mb-1">Plat Master Layout</span>
                            <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border">
                              <img src={plot.layoutPlanImage} alt="Layout" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            </div>
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-gray-500 block mb-1">Location / Satellite Snapshot</span>
                            <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border">
                              <img src={plot.locationImage} alt="Location" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            </div>
                          </div>
                        </div>

                        {/* Title Deed Ownership Checks (Owner 1 & 2) */}
                        <div className="bg-[#F8FCF5] p-4 rounded-2xl border border-[#D5F2B5] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Registered Owner 1</span>
                            <div className="font-extrabold text-black text-sm">{plot.ownerName1}</div>
                            <div className="text-gray-700 font-mono mt-0.5">Phone: {plot.ownerPhone1}</div>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Registered Owner 2 (Co-owner)</span>
                            <div className="font-extrabold text-black text-sm">
                              {plot.ownerName2 || 'None (Single Owner)'}
                            </div>
                            <div className="text-gray-700 font-mono mt-0.5">
                              {plot.ownerPhone2 ? `Phone: ${plot.ownerPhone2}` : 'N/A'}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                          <button
                            onClick={() => {
                              setRejectPlotId(plot.id);
                              setRejectReason('');
                            }}
                            className="px-4 py-2.5 border border-red-300 text-red-700 hover:bg-red-50 font-bold text-xs rounded-xl transition-colors"
                          >
                            Reject / Request Revision
                          </button>

                          <button
                            onClick={() => onVerifyAndBroadcastPlot(plot.id)}
                            className="px-6 py-2.5 bg-[#68D800] hover:bg-[#5bc200] text-black font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
                          >
                            <Radio className="w-4 h-4" />
                            <span>Verify DTCP & Broadcast to Live Catalog</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: DYNAMIC COMPANY & BRAND SETTINGS */}
            {activeTab === 'settings' && (
              <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-black flex items-center gap-2">
                      <Settings className="w-5 h-5 text-[#4FAF00]" />
                      <span>Dynamic Company Name & Branding Configuration</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      The entire platform dynamically updates its branding, navbar title, metadata, contact numbers, and legal badges based on these settings.
                    </p>
                  </div>

                  {savedNotice && (
                    <span className="inline-flex items-center gap-1.5 bg-[#EBFBD5] text-black font-bold text-xs px-3 py-1 rounded-lg border border-[#68D800]">
                      <CheckCircle2 className="w-4 h-4 text-[#4FAF00]" />
                      <span>Brand Settings Saved!</span>
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-gray-700 mb-1">
                        Dynamic Company Name (Updates Across App) *
                      </label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Apex Green Real Estate & Land Investments"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-extrabold text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-gray-700 mb-1">Company Tagline</label>
                      <input
                        type="text"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        placeholder="e.g. High-Yield DTCP Approved Land Investments with End-to-End Legal Assurance"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Primary Phone *</label>
                      <input
                        type="text"
                        required
                        value={primaryPhone}
                        onChange={(e) => setPrimaryPhone(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Secondary / Landline</label>
                      <input
                        type="text"
                        value={secondaryPhone}
                        onChange={(e) => setSecondaryPhone(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">WhatsApp Hotline</label>
                      <input
                        type="text"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Official Support Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Dedicated NRI Desk Email</label>
                      <input
                        type="email"
                        value={nriDeskEmail}
                        onChange={(e) => setNriDeskEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Default Benchmark Annual Growth Rate (%)</label>
                      <input
                        type="number"
                        min="5"
                        max="30"
                        value={defaultGrowthRate}
                        onChange={(e) => setDefaultGrowthRate(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-gray-700 mb-1">DTCP Assurance Top Banner Text</label>
                      <input
                        type="text"
                        value={dtcpAssuranceBadgeText}
                        onChange={(e) => setDtcpAssuranceBadgeText(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-gray-700 mb-1">Registered Office Address</label>
                      <textarea
                        rows={2}
                        value={officeAddress}
                        onChange={(e) => setOfficeAddress(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-8 py-3 bg-[#68D800] hover:bg-[#5bc200] text-black font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save & Apply Dynamic Branding</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 3: SELLER ONBOARDING & MANAGEMENT */}
            {activeTab === 'sellers' && (
              <div className="space-y-6">
                {/* Onboard New Seller Form */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="font-extrabold text-black text-base flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-[#4FAF00]" />
                      <span>Onboard New Verified Seller (Enables Seller OTP Login)</span>
                    </h3>
                    {sellerCreatedAlert && (
                      <span className="text-xs font-bold text-emerald-800 bg-[#EBFBD5] px-3 py-1 rounded-full">
                        Seller Onboarded! They can now log in via OTP.
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleCreateSeller} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Seller Full Name *</label>
                      <input
                        type="text"
                        required
                        value={sellerName}
                        onChange={(e) => setSellerName(e.target.value)}
                        placeholder="e.g. M. Rajesh"
                        className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Seller Mobile Phone (For OTP) *</label>
                      <input
                        type="tel"
                        required
                        value={sellerPhone}
                        onChange={(e) => setSellerPhone(e.target.value)}
                        placeholder="+91 98401 55667"
                        className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Seller Email *</label>
                      <input
                        type="email"
                        required
                        value={sellerEmail}
                        onChange={(e) => setSellerEmail(e.target.value)}
                        placeholder="seller@realty.in"
                        className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Company / Agency Name</label>
                      <input
                        type="text"
                        value={sellerCompany}
                        onChange={(e) => setSellerCompany(e.target.value)}
                        placeholder="e.g. Premier Land Promoters"
                        className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">District</label>
                      <input
                        type="text"
                        value={sellerDistrict}
                        onChange={(e) => setSellerDistrict(e.target.value)}
                        placeholder="e.g. Coimbatore"
                        className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:outline-none"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#68D800] hover:bg-[#5bc200] text-black font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Authorize & Onboard Seller</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Onboarded Sellers Table */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
                  <h3 className="font-extrabold text-black text-base">
                    Active Onboarded Sellers Directory ({sellers.length})
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-200 text-gray-400 uppercase text-[10px] tracking-wider">
                          <th className="py-2.5 font-bold">Seller Name & Firm</th>
                          <th className="py-2.5 font-bold">Mobile Phone (OTP)</th>
                          <th className="py-2.5 font-bold">Email</th>
                          <th className="py-2.5 font-bold">Location</th>
                          <th className="py-2.5 font-bold">Status</th>
                          <th className="py-2.5 font-bold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {sellers.map((s) => (
                          <tr key={s.id} className="hover:bg-gray-50">
                            <td className="py-3">
                              <div className="font-bold text-black">{s.name}</div>
                              <div className="text-[11px] text-gray-500">{s.companyName || 'Independent'}</div>
                            </td>
                            <td className="py-3 font-mono font-bold text-black">{s.phone}</td>
                            <td className="py-3 text-gray-600">{s.email}</td>
                            <td className="py-3 text-gray-600">
                              {s.district}, {s.state}
                            </td>
                            <td className="py-3">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  s.status === 'active'
                                    ? 'bg-[#EBFBD5] text-emerald-900'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {s.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => onToggleSellerStatus(s.id)}
                                className="text-[11px] font-bold text-gray-700 hover:text-black underline"
                              >
                                {s.status === 'active' ? 'Suspend' : 'Activate'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: INVENTORY MASTER */}
            {activeTab === 'inventory' && (
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-black text-base">
                    All Plots in Database ({plots.length})
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-400 uppercase text-[10px] tracking-wider">
                        <th className="py-2.5 font-bold">Plot / DTCP Order</th>
                        <th className="py-2.5 font-bold">Location</th>
                        <th className="py-2.5 font-bold">Area & Price</th>
                        <th className="py-2.5 font-bold">Owner 1 / 2</th>
                        <th className="py-2.5 font-bold">Broadcast Status</th>
                        <th className="py-2.5 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {plots.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="py-3">
                            <div className="font-bold text-black">{p.title}</div>
                            <div className="text-[10px] font-mono text-gray-500">{p.dtcpNumber}</div>
                          </td>
                          <td className="py-3 text-gray-600">
                            <div>{p.locality}</div>
                            <div className="text-[10px] text-gray-400">{p.district}</div>
                          </td>
                          <td className="py-3">
                            <div className="font-bold text-black">{formatCurrency(p.totalPrice, 'INR')}</div>
                            <div className="text-[10px] text-emerald-800 font-medium">
                              ₹{p.pricePerSqFt}/sq.ft • {p.totalSqFt} sq.ft
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="font-bold text-black">{p.ownerName1}</div>
                            {p.ownerName2 && <div className="text-[10px] text-gray-500">{p.ownerName2}</div>}
                          </td>
                          <td className="py-3">
                            {p.status === 'verified_broadcasted' ? (
                              <span className="bg-[#EBFBD5] text-emerald-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                                Broadcasted
                              </span>
                            ) : (
                              <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => onDeletePlot(p.id)}
                              className="p-1 text-red-500 hover:text-red-700 transition-colors"
                              title="Delete Plot"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 5: INVESTOR LEADS */}
            {activeTab === 'leads' && (
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-black text-base">
                    Investor Inquiries & Pre-Booking Leads ({inquiries.length})
                  </h3>
                  <span className="text-xs text-gray-500">
                    Domestic & NRI buyer interest
                  </span>
                </div>

                <div className="space-y-3">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-black text-sm">{inq.investorName}</span>
                          <span className="bg-[#EBFBD5] text-emerald-900 px-2 py-0.5 rounded text-[10px] font-bold">
                            {inq.country} ({inq.currency})
                          </span>
                        </div>
                        <div className="text-gray-600">
                          Plot: <strong>{inq.plotTitle}</strong>
                        </div>
                        <div className="text-gray-500">
                          Contact: {inq.investorPhone} • {inq.investorEmail}
                        </div>
                        {inq.message && (
                          <p className="text-gray-700 bg-white p-2 rounded-lg border border-gray-100 text-[11px] mt-1">
                            "{inq.message}"
                          </p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-gray-400 block">{inq.createdAt}</span>
                        <a
                          href={`tel:${inq.investorPhone}`}
                          className="mt-1.5 inline-flex items-center gap-1 px-3 py-1.5 bg-[#68D800] text-black font-bold text-xs rounded-lg hover:bg-[#5bc200]"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call Lead</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reject Modal */}
        {rejectPlotId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4">
              <h4 className="font-extrabold text-black text-base">Reject or Request Revision</h4>
              <p className="text-xs text-gray-600">
                Please enter a revision note for the seller regarding why this plot cannot be broadcasted yet (e.g. missing DTCP order copy, unclear location snap).
              </p>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Please upload original DTCP sanction order copy and verify Owner 2 phone number."
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:outline-none"
              />
              <div className="flex justify-end gap-2 text-xs font-bold">
                <button
                  onClick={() => setRejectPlotId(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onRejectPlot(rejectPlotId, rejectReason || 'Revision requested by Admin.');
                    setRejectPlotId(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Confirm Rejection Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
