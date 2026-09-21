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
  Coins,
  X,
  User,
  Compass,
  FileCheck
} from 'lucide-react';
import { CompanySettings, CurrencyCode, Plot, PlotInquiry, Seller } from '../types';
import { formatCurrency, formatRatePerSqFt } from '../utils/currency';

interface AdminPortalProps {
  settings: CompanySettings;
  plots: Plot[];
  sellers: Seller[];
  inquiries: PlotInquiry[];
  isAdminLoggedIn: boolean;
  activeCurrency?: CurrencyCode;
  onLoginAdmin: () => void;
  onLogoutAdmin: () => void;
  onUpdateSettings: (newSettings: CompanySettings) => void;
  onVerifyAndBroadcastPlot: (plotId: string) => void;
  onRejectPlot: (plotId: string, reason: string) => void;
  onDeletePlot: (plotId: string) => void;
  onEditPlot?: (plotId: string, plotData: Partial<Plot>) => void;
  onAddSeller: (seller: Omit<Seller, 'id' | 'createdDate'>) => void;
  onUpdateSeller?: (sellerId: string, sellerData: Partial<Seller>) => void;
  onDeleteSeller?: (sellerId: string) => void;
  onToggleSellerStatus: (sellerId: string) => void;
  onClose: () => void;
}

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
  'Bihar',
  'Jharkhand',
  'Assam',
  'Uttarakhand',
  'Himachal Pradesh',
  'Puducherry',
  'Chandigarh'
];

export const AdminPortal: React.FC<AdminPortalProps> = ({
  settings,
  plots,
  sellers,
  inquiries,
  isAdminLoggedIn,
  activeCurrency = 'INR',
  onLoginAdmin,
  onLogoutAdmin,
  onUpdateSettings,
  onVerifyAndBroadcastPlot,
  onRejectPlot,
  onDeletePlot,
  onEditPlot,
  onAddSeller,
  onUpdateSeller,
  onDeleteSeller,
  onToggleSellerStatus,
  onClose,
}) => {
  // Login States
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'settings' | 'broadcast' | 'sellers' | 'inventory' | 'leads'>('broadcast');

  // Detail View Modals States
  const [selectedSellerForView, setSelectedSellerForView] = useState<Seller | null>(null);
  const [selectedPlotForView, setSelectedPlotForView] = useState<Plot | null>(null);
  const [selectedInquiryForView, setSelectedInquiryForView] = useState<PlotInquiry | null>(null);

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

  // Admin Edit Modal States
  const [editingPlotForAdmin, setEditingPlotForAdmin] = useState<Plot | null>(null);
  const [editingSellerForAdmin, setEditingSellerForAdmin] = useState<Seller | null>(null);

  // SMTP Settings States
  const [smtpHost, setSmtpHost] = useState(settings.smtpHost || '');
  const [smtpPort, setSmtpPort] = useState(settings.smtpPort || 587);
  const [smtpUser, setSmtpUser] = useState(settings.smtpUser || '');
  const [smtpPassword, setSmtpPassword] = useState(settings.smtpPassword || '');
  const [smtpFromEmail, setSmtpFromEmail] = useState(settings.smtpFromEmail || '');

  // New Seller Onboarding Form
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerCompany, setSellerCompany] = useState('');
  const [sellerPan, setSellerPan] = useState('');
  const [sellerCountry, setSellerCountry] = useState('India');
  const [sellerDistrict, setSellerDistrict] = useState('Coimbatore');
  const [sellerState, setSellerState] = useState('Tamil Nadu');
  const [sellerCreatedAlert, setSellerCreatedAlert] = useState(false);

  // Reject modal state
  const [rejectPlotId, setRejectPlotId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Suspended seller warning and confirmation modals
  const [suspendedSellerModalPlot, setSuspendedSellerModalPlot] = useState<Plot | null>(null);
  const [confirmBroadcastPlot, setConfirmBroadcastPlot] = useState<Plot | null>(null);

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
      smtpHost: smtpHost.trim() || undefined,
      smtpPort: Number(smtpPort) || 587,
      smtpUser: smtpUser.trim() || undefined,
      smtpPassword: smtpPassword.trim() || undefined,
      smtpFromEmail: smtpFromEmail.trim() || undefined,
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

            <div className="pt-3 border-t border-gray-100 text-center space-y-1">
              <span className="text-[11px] text-gray-500 block font-semibold">
                Default Credentials: <strong className="text-black">admin</strong> / <strong className="text-black">admin123</strong>
              </span>
              <span className="text-[10px] text-gray-400 block">
                Official Administrative Access • LandVest Secure Gateway
              </span>
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
                <span>Company Branding & Settings</span>
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
                    {pendingPlots.map((plot) => {
                      const submitterSeller = sellers.find(
                        (s) => s.id === plot.sellerId || (Boolean(plot.sellerEmail) && Boolean(s.email) && s.email.toLowerCase() === plot.sellerEmail.toLowerCase())
                      );
                      const isSellerSuspended = submitterSeller?.status === 'suspended';

                      return (
                        <div
                          key={plot.id}
                          className={`bg-white border-2 ${isSellerSuspended ? 'border-red-400' : 'border-amber-400'} rounded-3xl p-6 shadow-md space-y-6 transition-all`}
                        >
                          {/* Warning Banner if Seller is Suspended */}
                          {isSellerSuspended && (
                            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-red-900">
                              <div className="flex items-center gap-3">
                                <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
                                <div>
                                  <div className="font-extrabold text-sm flex items-center gap-2">
                                    <span>SUBMITTER SELLER IS CURRENTLY SUSPENDED</span>
                                    <span className="bg-red-200 text-red-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">Approval Blocked</span>
                                  </div>
                                  <p className="text-xs text-red-700 mt-0.5">
                                    Seller <strong>{plot.sellerName || submitterSeller?.name}</strong> ({plot.sellerEmail || submitterSeller?.email}) is suspended. DTCP verification and public investor broadcast are restricted until the seller is reactivated.
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setActiveTab('sellers')}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black shrink-0 transition-colors flex items-center gap-1.5 shadow-sm"
                              >
                                <User className="w-3.5 h-3.5" />
                                <span>Reactivate Seller</span>
                              </button>
                            </div>
                          )}

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className={`${isSellerSuspended ? 'bg-red-600 text-white' : 'bg-amber-500 text-black'} text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1`}>
                                  <Clock className="w-3.5 h-3.5" />
                                  {isSellerSuspended ? 'SELLER SUSPENDED • BLOCKED' : 'AWAITING BROADCAST APPROVAL'}
                                </span>
                                <span className="text-xs font-mono font-bold bg-gray-100 text-black px-2.5 py-0.5 rounded">
                                  DTCP Sanction: {plot.dtcpNumber}
                                </span>
                              </div>
                              <h3 className="text-lg font-extrabold text-black">{plot.title}</h3>
                              <div className="text-xs text-gray-500">
                                {plot.locality}, {plot.district}, {plot.state} • Submitted by{' '}
                                <strong>{plot.sellerName}</strong> ({plot.sellerPhone || plot.sellerEmail})
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-xl font-black text-black">
                                {formatCurrency(plot.totalPrice, activeCurrency)}
                              </div>
                              {activeCurrency !== 'INR' && (
                                <div className="text-xs font-semibold text-gray-500">
                                  ≈ {formatCurrency(plot.totalPrice, 'INR')}
                                </div>
                              )}
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
                                <img 
                                  src={plot.plotImages[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'} 
                                  alt="Plot" 
                                  referrerPolicy="no-referrer" 
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80';
                                  }}
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-gray-500 block mb-1">Plat Master Layout</span>
                              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border">
                                <img 
                                  src={plot.layoutPlanImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'} 
                                  alt="Layout" 
                                  referrerPolicy="no-referrer" 
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
                                  }}
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-gray-500 block mb-1">Location / Satellite Snapshot</span>
                              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border">
                                <img 
                                  src={plot.locationImage || 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80'} 
                                  alt="Location" 
                                  referrerPolicy="no-referrer" 
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80';
                                  }}
                                  className="w-full h-full object-cover" 
                                />
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
                              onClick={() => setEditingPlotForAdmin(plot)}
                              className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition-colors flex items-center gap-1.5"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                              <span>Edit Plot Details</span>
                            </button>

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
                              onClick={() => {
                                if (isSellerSuspended) {
                                  setSuspendedSellerModalPlot(plot);
                                } else {
                                  setConfirmBroadcastPlot(plot);
                                }
                              }}
                              className={`px-6 py-2.5 ${
                                isSellerSuspended 
                                  ? 'bg-red-100 hover:bg-red-200 text-red-800 border-2 border-red-300 cursor-pointer' 
                                  : 'bg-[#68D800] hover:bg-[#5bc200] text-black shadow-md'
                              } font-extrabold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2`}
                            >
                              {isSellerSuspended ? (
                                <>
                                  <AlertCircle className="w-4 h-4 text-red-600" />
                                  <span>Seller Suspended (Approval Blocked)</span>
                                </>
                              ) : (
                                <>
                                  <Radio className="w-4 h-4" />
                                  <span>Verify DTCP & Broadcast to Live Catalog</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: COMPANY BRANDING & SETTINGS */}
            {activeTab === 'settings' && (
              <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                {/* Dynamic Branding Explanation Banner */}
                <div className="p-4 bg-[#EBFBD5] border border-[#68D800] rounded-2xl space-y-1.5 text-xs">
                  <div className="font-extrabold text-black text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#4FAF00]" />
                    <span>Dynamic Company Brand - Real-Time Platform Sync</span>
                  </div>
                  <p className="text-gray-800 leading-relaxed">
                    <strong>Explanation:</strong> Updating your company name, contact numbers, NRI desk email, office address, and branding here automatically updates the <strong>Navbar Logo, Homepage, NRI Corner, Footer, and contact forms across the entire platform in real time</strong> without requiring code changes.
                  </p>
                </div>

                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-black flex items-center gap-2">
                      <Settings className="w-5 h-5 text-[#4FAF00]" />
                      <span>Company Name & Branding Configuration</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Update your official real estate company name, tagline, phone numbers, NRI desk email, office address, and outgoing SMTP email server.
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

                  {/* SMTP Outgoing Email Server Section */}
                  <div className="pt-6 border-t border-gray-200 space-y-4">
                    <div>
                      <h4 className="text-sm font-extrabold text-black flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#4FAF00]" />
                        <span>Outgoing Email Server (SMTP Configuration for Real OTPs)</span>
                      </h4>
                      <p className="text-gray-500 text-[11px] mt-0.5">
                        Configure your SMTP server (e.g., Gmail, Brevo, SendGrid, Amazon SES, or Hostinger) to deliver actual 6-digit OTPs to sellers' email inboxes.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">SMTP Host</label>
                        <input
                          type="text"
                          value={smtpHost}
                          onChange={(e) => setSmtpHost(e.target.value)}
                          placeholder="smtp.gmail.com"
                          className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">SMTP Port</label>
                        <input
                          type="number"
                          value={smtpPort}
                          onChange={(e) => setSmtpPort(Number(e.target.value))}
                          placeholder="587"
                          className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Sender From Email</label>
                        <input
                          type="email"
                          value={smtpFromEmail}
                          onChange={(e) => setSmtpFromEmail(e.target.value)}
                          placeholder="noreply@landvest.in"
                          className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">SMTP Username / Email</label>
                        <input
                          type="text"
                          value={smtpUser}
                          onChange={(e) => setSmtpUser(e.target.value)}
                          placeholder="admin@landvest.in"
                          className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block font-bold text-gray-700 mb-1">SMTP Password / App Password</label>
                        <input
                          type="password"
                          value={smtpPassword}
                          onChange={(e) => setSmtpPassword(e.target.value)}
                          placeholder="••••••••••••••••"
                          className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-8 py-3 bg-[#68D800] hover:bg-[#5bc200] text-black font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save & Apply All Settings</span>
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

                  <form onSubmit={handleCreateSeller} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
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
                      <label className="block font-bold text-gray-700 mb-1">Country</label>
                      <div className="w-full px-3.5 py-2 bg-gray-100 border border-gray-300 rounded-xl text-xs text-gray-700 font-bold flex items-center gap-1.5 cursor-not-allowed">
                        <span>🇮🇳</span>
                        <span>India</span>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">State *</label>
                      <select
                        value={sellerState}
                        onChange={(e) => setSellerState(e.target.value)}
                        className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:outline-none"
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">District (Type Name) *</label>
                      <input
                        type="text"
                        required
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
                          <th className="py-2.5 font-bold text-right">Actions</th>
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
                            <td className="py-3 text-right space-x-2 whitespace-nowrap">
                              <button
                                onClick={() => setSelectedSellerForView(s)}
                                className="px-2 py-1 bg-gray-100 hover:bg-[#EBFBD5] text-gray-800 hover:text-black rounded-lg font-bold text-[11px] inline-flex items-center gap-1 transition-colors border border-gray-200"
                                title="View Complete Seller Profile"
                              >
                                <Eye className="w-3 h-3 text-[#4FAF00]" />
                                <span>View</span>
                              </button>
                              <button
                                onClick={() => setEditingSellerForAdmin(s)}
                                className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold text-[11px] inline-flex items-center gap-1 transition-colors border border-blue-200"
                                title="Edit Seller Profile"
                              >
                                <Edit3 className="w-3 h-3 text-blue-600" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => onToggleSellerStatus(s.id)}
                                className={`text-[11px] font-bold px-2 py-1 rounded-lg transition-colors ${
                                  s.status === 'active'
                                    ? 'text-amber-700 hover:bg-amber-50'
                                    : 'text-emerald-700 hover:bg-emerald-50'
                                }`}
                              >
                                {s.status === 'active' ? 'Suspend' : 'Activate'}
                              </button>
                              {onDeleteSeller && (
                                <button
                                  onClick={() => onDeleteSeller(s.id)}
                                  className="p-1 text-red-400 hover:text-red-700 transition-colors inline-block"
                                  title="Delete Seller"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
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
                        <th className="py-2.5 font-bold">Submitted By (Seller)</th>
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
                            <div className="font-bold text-black">{formatCurrency(p.totalPrice, activeCurrency)}</div>
                            {activeCurrency !== 'INR' && (
                              <div className="text-[10px] text-gray-500 font-semibold">≈ {formatCurrency(p.totalPrice, 'INR')}</div>
                            )}
                            <div className="text-[10px] text-emerald-800 font-medium">
                              ₹{p.pricePerSqFt}/sq.ft • {p.totalSqFt} sq.ft
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="font-bold text-black">{p.ownerName1}</div>
                            {p.ownerName2 && <div className="text-[10px] text-gray-500">{p.ownerName2}</div>}
                          </td>
                          <td className="py-3">
                            <div className="font-bold text-black">{p.sellerName || 'Direct'}</div>
                            <div className="text-[10px] text-gray-600">{p.sellerPhone}</div>
                            {p.sellerEmail && <div className="text-[10px] text-emerald-800 font-mono">{p.sellerEmail}</div>}
                          </td>
                          <td className="py-3">
                            {p.status === 'verified_broadcasted' ? (
                              <span className="bg-[#EBFBD5] text-emerald-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                                Broadcasted
                              </span>
                            ) : p.status === 'rejected' ? (
                              <span className="bg-red-100 text-red-800 border border-red-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                                Rejected
                              </span>
                            ) : (
                              <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedPlotForView(p)}
                              className="px-2 py-1 bg-gray-100 hover:bg-[#EBFBD5] text-gray-800 hover:text-black rounded-lg font-bold text-[11px] inline-flex items-center gap-1 transition-colors border border-gray-200"
                              title="Audit Plot Specifications & Media"
                            >
                              <Eye className="w-3 h-3 text-[#4FAF00]" />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => setEditingPlotForAdmin(p)}
                              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold text-[11px] inline-flex items-center gap-1 transition-colors border border-blue-200"
                              title="Edit Plot Specifications"
                            >
                              <Edit3 className="w-3 h-3 text-blue-600" />
                              <span>Edit Plot</span>
                            </button>
                            <button
                              onClick={() => onDeletePlot(p.id)}
                              className="p-1 text-red-500 hover:text-red-700 transition-colors inline-block"
                              title="Delete Plot"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

                      <div className="text-right shrink-0 space-y-1.5">
                        <span className="text-[10px] text-gray-400 block">{inq.createdAt}</span>
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => setSelectedInquiryForView(inq)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-800 font-bold text-xs rounded-lg hover:bg-gray-200 border border-gray-200 transition-colors"
                          >
                            <Eye className="w-3 h-3 text-gray-600" />
                            <span>View Details</span>
                          </button>
                          <a
                            href={`tel:${inq.investorPhone}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#68D800] text-black font-bold text-xs rounded-lg hover:bg-[#5bc200] transition-colors"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Call Lead</span>
                          </a>
                        </div>
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

        {/* View Seller Details Modal */}
        {selectedSellerForView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EBFBD5] text-black flex items-center justify-center font-extrabold text-base border border-[#68D800]/50">
                    {selectedSellerForView.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-black">{selectedSellerForView.name}</h3>
                    <p className="text-xs text-gray-500">{selectedSellerForView.companyName || 'Independent Promoter'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSellerForView(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Profile Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                  <span className="text-gray-400 block mb-0.5">Mobile Phone (OTP Auth)</span>
                  <div className="font-mono font-bold text-black flex items-center gap-2">
                    <span>{selectedSellerForView.phone}</span>
                    <a href={`tel:${selectedSellerForView.phone}`} className="text-[#4FAF00] hover:underline text-[11px] font-bold">Call</a>
                  </div>
                </div>
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                  <span className="text-gray-400 block mb-0.5">Registered Email</span>
                  <div className="font-semibold text-black">{selectedSellerForView.email}</div>
                </div>
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                  <span className="text-gray-400 block mb-0.5">Jurisdiction / Location</span>
                  <div className="font-bold text-black">{selectedSellerForView.district}, {selectedSellerForView.state} (India)</div>
                </div>
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                  <span className="text-gray-400 block mb-0.5">Account Status</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedSellerForView.status === 'active' ? 'bg-[#EBFBD5] text-emerald-900' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedSellerForView.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Submitted Plots by this seller */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-black text-sm">
                  Submissions by this Seller ({plots.filter(p => p.sellerId === selectedSellerForView.id || p.sellerPhone === selectedSellerForView.phone).length})
                </h4>
                <div className="space-y-2">
                  {plots.filter(p => p.sellerId === selectedSellerForView.id || p.sellerPhone === selectedSellerForView.phone).map(p => (
                    <div key={p.id} className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-black">{p.title}</div>
                        <div className="text-[11px] text-gray-500">{p.locality}, {p.district} • DTCP: {p.dtcpNumber}</div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.status === 'verified_broadcasted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {p.status === 'verified_broadcasted' ? 'Live & Broadcasted' : 'Pending Verification'}
                        </span>
                        <div className="font-bold text-black mt-0.5">{formatCurrency(p.totalPrice, activeCurrency)}</div>
                        {activeCurrency !== 'INR' && (
                          <div className="text-[10px] text-gray-500 font-semibold">≈ {formatCurrency(p.totalPrice, 'INR')}</div>
                        )}
                      </div>
                    </div>
                  ))}
                  {plots.filter(p => p.sellerId === selectedSellerForView.id || p.sellerPhone === selectedSellerForView.phone).length === 0 && (
                    <p className="text-xs text-gray-400 italic">No plots submitted yet by this seller.</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-gray-100">
                <button
                  onClick={() => setSelectedSellerForView(null)}
                  className="px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Plot Details / Audit Modal */}
        {selectedPlotForView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      selectedPlotForView.status === 'verified_broadcasted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedPlotForView.status === 'rejected'
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {selectedPlotForView.status === 'verified_broadcasted'
                        ? 'LIVE & BROADCASTED'
                        : selectedPlotForView.status === 'rejected'
                        ? 'REJECTED (NEEDS SELLER REVISION)'
                        : 'PENDING DTCP AUDIT'}
                    </span>
                    <span className="font-mono text-[11px] bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                      {selectedPlotForView.dtcpNumber}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-xl text-black">{selectedPlotForView.title}</h3>
                  <p className="text-xs text-gray-500">{selectedPlotForView.locality}, {selectedPlotForView.district}, {selectedPlotForView.state} (India)</p>
                </div>
                <button
                  onClick={() => setSelectedPlotForView(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Photos & Blueprint */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Plot Site Photo</span>
                  <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                    <img src={selectedPlotForView.plotImages?.[0]} alt="Site" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Layout Blueprint</span>
                  <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                    <img src={selectedPlotForView.layoutPlanImage} alt="Layout" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Location Snapshot</span>
                  <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                    <img src={selectedPlotForView.locationImage} alt="Location" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* Financial & Land Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs">
                <div>
                  <span className="text-gray-400 block">Total Investment</span>
                  <span className="font-extrabold text-base text-black">{formatCurrency(selectedPlotForView.totalPrice, activeCurrency)}</span>
                  {activeCurrency !== 'INR' && (
                    <span className="text-[11px] text-gray-500 font-semibold block">≈ {formatCurrency(selectedPlotForView.totalPrice, 'INR')}</span>
                  )}
                </div>
                <div>
                  <span className="text-gray-400 block">Area & Extent</span>
                  <span className="font-bold text-black">{selectedPlotForView.totalSqFt} sq.ft ({selectedPlotForView.cents} Cents)</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Rate / Sq.Ft</span>
                  <span className="font-bold text-emerald-800">₹{selectedPlotForView.pricePerSqFt}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Road & Facing</span>
                  <span className="font-bold text-black">{selectedPlotForView.roadWidthFt} Ft • {selectedPlotForView.facing}</span>
                </div>
              </div>

              {/* Owners and Seller */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Title Deed Holders</span>
                  <div className="font-bold text-black">Primary: {selectedPlotForView.ownerName1} ({selectedPlotForView.ownerPhone1})</div>
                  {selectedPlotForView.ownerName2 && (
                    <div className="text-gray-600">Co-Owner: {selectedPlotForView.ownerName2} ({selectedPlotForView.ownerPhone2})</div>
                  )}
                </div>
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Submitting Promoter / Seller</span>
                  <div className="font-bold text-black">{selectedPlotForView.sellerName}</div>
                  <div className="text-gray-600">Phone: {selectedPlotForView.sellerPhone}</div>
                </div>
              </div>

              {selectedPlotForView.adminNotes && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <strong className="font-bold">Audit History / Note:</strong> {selectedPlotForView.adminNotes}
                </div>
              )}

              {/* Action Buttons in Modal */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setSelectedPlotForView(null)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 text-xs font-bold hover:bg-gray-100"
                >
                  Close
                </button>
                {selectedPlotForView.status === 'pending_verification' && (
                  <>
                    <button
                      onClick={() => {
                        setRejectPlotId(selectedPlotForView.id);
                        setSelectedPlotForView(null);
                      }}
                      className="px-4 py-2 border border-red-300 text-red-700 rounded-xl text-xs font-bold hover:bg-red-50"
                    >
                      Reject / Request Revision
                    </button>
                    <button
                      onClick={() => {
                        onVerifyAndBroadcastPlot(selectedPlotForView.id);
                        setSelectedPlotForView(null);
                      }}
                      className="px-5 py-2 bg-[#68D800] hover:bg-[#5bc200] text-black font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>Verify & Broadcast Live</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* View Investor Inquiry Modal */}
        {selectedInquiryForView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Investor Lead Details</span>
                  <h3 className="font-extrabold text-lg text-black">{selectedInquiryForView.investorName}</h3>
                </div>
                <button
                  onClick={() => setSelectedInquiryForView(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="text-gray-400 block mb-0.5">Target Plot Interest</span>
                  <div className="font-bold text-black text-sm">{selectedInquiryForView.plotTitle}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-gray-400 block mb-0.5">Origin & Currency</span>
                    <div className="font-bold text-black">{selectedInquiryForView.country} ({selectedInquiryForView.currency})</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-gray-400 block mb-0.5">Holding Horizon</span>
                    <div className="font-bold text-black">{selectedInquiryForView.investmentHorizonYears} Years</div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                  <span className="text-gray-400 block">Contact Information</span>
                  <div className="font-mono font-bold text-black">{selectedInquiryForView.investorPhone}</div>
                  <div className="text-gray-600">{selectedInquiryForView.investorEmail}</div>
                </div>

                {selectedInquiryForView.message && (
                  <div className="p-3.5 bg-[#F4FDEB] border border-[#68D800]/40 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-emerald-900 uppercase">Investor Query Message</span>
                    <p className="text-black text-xs italic leading-relaxed">
                      "{selectedInquiryForView.message}"
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <button
                  onClick={() => setSelectedInquiryForView(null)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 text-xs font-bold hover:bg-gray-100"
                >
                  Close
                </button>
                <div className="flex gap-2">
                  <a
                    href={`mailto:${selectedInquiryForView.investorEmail}`}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl"
                  >
                    Send Email
                  </a>
                  <a
                    href={`tel:${selectedInquiryForView.investorPhone}`}
                    className="px-4 py-2 bg-[#68D800] hover:bg-[#5bc200] text-black text-xs font-extrabold rounded-xl flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Investor</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Seller Modal */}
        {editingSellerForAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-black">Edit Seller Profile</h3>
                    <p className="text-xs text-gray-500">Update verified seller information, contact, and jurisdiction</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingSellerForAdmin(null)}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (onUpdateSeller && editingSellerForAdmin) {
                    onUpdateSeller(editingSellerForAdmin.id, {
                      name: editingSellerForAdmin.name,
                      phone: editingSellerForAdmin.phone,
                      email: editingSellerForAdmin.email,
                      companyName: editingSellerForAdmin.companyName,
                      incomeTaxPan: editingSellerForAdmin.incomeTaxPan,
                      district: editingSellerForAdmin.district,
                      state: editingSellerForAdmin.state,
                      status: editingSellerForAdmin.status,
                    });
                  }
                  setEditingSellerForAdmin(null);
                }}
                className="space-y-4 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Seller Full Name *</label>
                    <input
                      type="text"
                      required
                      value={editingSellerForAdmin.name}
                      onChange={(e) =>
                        setEditingSellerForAdmin({ ...editingSellerForAdmin, name: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Mobile Phone (OTP Login) *</label>
                    <input
                      type="tel"
                      required
                      value={editingSellerForAdmin.phone}
                      onChange={(e) =>
                        setEditingSellerForAdmin({ ...editingSellerForAdmin, phone: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={editingSellerForAdmin.email}
                      onChange={(e) =>
                        setEditingSellerForAdmin({ ...editingSellerForAdmin, email: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Company / Firm Name</label>
                    <input
                      type="text"
                      value={editingSellerForAdmin.companyName || ''}
                      onChange={(e) =>
                        setEditingSellerForAdmin({ ...editingSellerForAdmin, companyName: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Income Tax PAN</label>
                    <input
                      type="text"
                      maxLength={10}
                      value={editingSellerForAdmin.incomeTaxPan || ''}
                      onChange={(e) =>
                        setEditingSellerForAdmin({
                          ...editingSellerForAdmin,
                          incomeTaxPan: e.target.value.toUpperCase(),
                        })
                      }
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono uppercase text-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Account Status</label>
                    <select
                      value={editingSellerForAdmin.status}
                      onChange={(e) =>
                        setEditingSellerForAdmin({
                          ...editingSellerForAdmin,
                          status: e.target.value as 'active' | 'suspended',
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:outline-none"
                    >
                      <option value="active">Active (Authorized)</option>
                      <option value="suspended">Suspended (Blocked & Plots Hidden)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">State *</label>
                    <select
                      value={editingSellerForAdmin.state}
                      onChange={(e) =>
                        setEditingSellerForAdmin({ ...editingSellerForAdmin, state: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:outline-none"
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
                      value={editingSellerForAdmin.district}
                      onChange={(e) =>
                        setEditingSellerForAdmin({ ...editingSellerForAdmin, district: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setEditingSellerForAdmin(null)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 text-xs font-bold hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#68D800] hover:bg-[#5bc200] text-black font-extrabold text-xs rounded-xl shadow-xs"
                  >
                    Save Seller Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Plot Modal */}
        {editingPlotForAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-black">Edit Plot Specifications</h3>
                    <p className="text-xs text-gray-500">
                      ID: {editingPlotForAdmin.id} • DTCP: {editingPlotForAdmin.dtcpNumber}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingPlotForAdmin(null)}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (onEditPlot && editingPlotForAdmin) {
                    const totalSq = Number(editingPlotForAdmin.totalSqFt) || 2400;
                    const priceSq = Number(editingPlotForAdmin.pricePerSqFt) || 1800;
                    const calculatedTotal = totalSq * priceSq;
                    const calculatedCents = Number((totalSq / 435.6).toFixed(2));

                    onEditPlot(editingPlotForAdmin.id, {
                      title: editingPlotForAdmin.title,
                      state: editingPlotForAdmin.state,
                      district: editingPlotForAdmin.district,
                      locality: editingPlotForAdmin.locality,
                      dtcpNumber: editingPlotForAdmin.dtcpNumber,
                      totalSqFt: totalSq,
                      cents: calculatedCents,
                      pricePerSqFt: priceSq,
                      totalPrice: calculatedTotal,
                      facing: editingPlotForAdmin.facing,
                      roadWidthFt: Number(editingPlotForAdmin.roadWidthFt) || 30,
                      expectedAppreciationRate: Number(editingPlotForAdmin.expectedAppreciationRate) || 15,
                      ownerName1: editingPlotForAdmin.ownerName1,
                      ownerPhone1: editingPlotForAdmin.ownerPhone1,
                      ownerName2: editingPlotForAdmin.ownerName2 || undefined,
                      ownerPhone2: editingPlotForAdmin.ownerPhone2 || undefined,
                      adminNotes: editingPlotForAdmin.adminNotes,
                      status: editingPlotForAdmin.status,
                    });
                  }
                  setEditingPlotForAdmin(null);
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Plot Title *</label>
                  <input
                    type="text"
                    required
                    value={editingPlotForAdmin.title}
                    onChange={(e) =>
                      setEditingPlotForAdmin({ ...editingPlotForAdmin, title: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Locality *</label>
                    <input
                      type="text"
                      required
                      value={editingPlotForAdmin.locality}
                      onChange={(e) =>
                        setEditingPlotForAdmin({ ...editingPlotForAdmin, locality: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">District *</label>
                    <input
                      type="text"
                      required
                      value={editingPlotForAdmin.district}
                      onChange={(e) =>
                        setEditingPlotForAdmin({ ...editingPlotForAdmin, district: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">DTCP Sanction No *</label>
                    <input
                      type="text"
                      required
                      value={editingPlotForAdmin.dtcpNumber}
                      onChange={(e) =>
                        setEditingPlotForAdmin({ ...editingPlotForAdmin, dtcpNumber: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono text-black focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Plot Area (Sq.Ft) *</label>
                    <input
                      type="number"
                      required
                      value={editingPlotForAdmin.totalSqFt}
                      onChange={(e) =>
                        setEditingPlotForAdmin({
                          ...editingPlotForAdmin,
                          totalSqFt: Number(e.target.value),
                        })
                      }
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Rate per Sq.Ft (₹) *</label>
                    <input
                      type="number"
                      required
                      value={editingPlotForAdmin.pricePerSqFt}
                      onChange={(e) =>
                        setEditingPlotForAdmin({
                          ...editingPlotForAdmin,
                          pricePerSqFt: Number(e.target.value),
                        })
                      }
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Facing Direction</label>
                    <select
                      value={editingPlotForAdmin.facing}
                      onChange={(e) =>
                        setEditingPlotForAdmin({
                          ...editingPlotForAdmin,
                          facing: e.target.value as Plot['facing'],
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:outline-none"
                    >
                      <option value="North">North</option>
                      <option value="East">East</option>
                      <option value="South">South</option>
                      <option value="West">West</option>
                      <option value="North-East">North-East</option>
                      <option value="North-West">North-West</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Owner 1 Name & Phone *</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={editingPlotForAdmin.ownerName1}
                        onChange={(e) =>
                          setEditingPlotForAdmin({ ...editingPlotForAdmin, ownerName1: e.target.value })
                        }
                        placeholder="Name"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:outline-none"
                      />
                      <input
                        type="text"
                        required
                        value={editingPlotForAdmin.ownerPhone1}
                        onChange={(e) =>
                          setEditingPlotForAdmin({ ...editingPlotForAdmin, ownerPhone1: e.target.value })
                        }
                        placeholder="Phone"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Owner 2 Name & Phone (Optional)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={editingPlotForAdmin.ownerName2 || ''}
                        onChange={(e) =>
                          setEditingPlotForAdmin({ ...editingPlotForAdmin, ownerName2: e.target.value })
                        }
                        placeholder="Co-owner Name"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:outline-none"
                      />
                      <input
                        type="text"
                        value={editingPlotForAdmin.ownerPhone2 || ''}
                        onChange={(e) =>
                          setEditingPlotForAdmin({ ...editingPlotForAdmin, ownerPhone2: e.target.value })
                        }
                        placeholder="Co-owner Phone"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Broadcast Status</label>
                    <select
                      value={editingPlotForAdmin.status}
                      onChange={(e) =>
                        setEditingPlotForAdmin({
                          ...editingPlotForAdmin,
                          status: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:outline-none font-bold"
                    >
                      <option value="verified_broadcasted">Verified & Broadcasted (Live)</option>
                      <option value="pending_verification">Pending Verification</option>
                      <option value="rejected">Rejected (Needs Revision)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Admin Audit Notes</label>
                    <input
                      type="text"
                      value={editingPlotForAdmin.adminNotes || ''}
                      onChange={(e) =>
                        setEditingPlotForAdmin({
                          ...editingPlotForAdmin,
                          adminNotes: e.target.value,
                        })
                      }
                      placeholder="e.g. DTCP verified, verified with SRO records"
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-black focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setEditingPlotForAdmin(null)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 text-xs font-bold hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#68D800] hover:bg-[#5bc200] text-black font-extrabold text-xs rounded-xl shadow-xs"
                  >
                    Save Plot Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: SUBMITTER SELLER SUSPENDED WARNING */}
        {suspendedSellerModalPlot && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-red-500">
              <div className="flex items-center gap-3 text-red-600 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-7 h-7 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-black">Action Blocked: Submitter Seller Suspended</h3>
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider">DTCP Broadcast Protection</span>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs space-y-2 mb-5">
                <p className="text-red-900 font-medium">
                  You cannot verify or broadcast <strong>"{suspendedSellerModalPlot.title}"</strong> because the submitting seller is currently suspended:
                </p>
                <div className="bg-white p-3 rounded-xl border border-red-200 text-gray-800 space-y-1">
                  <div><strong>Seller Name:</strong> {suspendedSellerModalPlot.sellerName}</div>
                  <div><strong>Seller Email:</strong> {suspendedSellerModalPlot.sellerEmail || 'N/A'}</div>
                  <div><strong>Plot DTCP No:</strong> {suspendedSellerModalPlot.dtcpNumber}</div>
                  <div><strong>Location:</strong> {suspendedSellerModalPlot.locality}, {suspendedSellerModalPlot.district}</div>
                </div>
                <p className="text-red-800 text-[11px] leading-relaxed">
                  To prevent unauthorized or fraudulent listings from reaching live investors, all plot approvals are disabled while a seller is suspended. To proceed, please review and reactivate the seller in the Sellers Directory first.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSuspendedSellerModalPlot(null)}
                  className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 text-xs font-bold hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSuspendedSellerModalPlot(null);
                    setActiveTab('sellers');
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>Go to Sellers Directory</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CONFIRM DTCP VERIFICATION & BROADCAST */}
        {confirmBroadcastPlot && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-emerald-500">
              <div className="flex items-center gap-3 text-emerald-600 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <Radio className="w-7 h-7 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-black">Confirm Plot Broadcast to Live Market</h3>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Domestic & Global NRI Catalog</span>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs space-y-2 mb-5">
                <p className="text-emerald-950 font-medium">
                  Are you sure you want to verify and broadcast <strong>"{confirmBroadcastPlot.title}"</strong>?
                </p>
                <div className="bg-white p-3 rounded-xl border border-emerald-200 text-gray-800 space-y-1">
                  <div><strong>Plot Title:</strong> {confirmBroadcastPlot.title}</div>
                  <div><strong>DTCP Number:</strong> {confirmBroadcastPlot.dtcpNumber}</div>
                  <div><strong>Submitted By:</strong> {confirmBroadcastPlot.sellerName} ({confirmBroadcastPlot.sellerPhone})</div>
                  <div><strong>Total Price:</strong> {formatCurrency(confirmBroadcastPlot.totalPrice, activeCurrency)}{activeCurrency !== 'INR' ? ` (${formatCurrency(confirmBroadcastPlot.totalPrice, 'INR')})` : ''}</div>
                </div>
                <p className="text-gray-600 text-[11px] leading-relaxed">
                  Upon confirmation, this plot will immediately appear on the public investor marketplace with an official DTCP Verified badge.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const id = confirmBroadcastPlot.id;
                    setConfirmBroadcastPlot(null);
                    onVerifyAndBroadcastPlot(id);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#68D800] hover:bg-[#5bc200] text-black text-xs font-black rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 order-1 sm:order-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify & Broadcast Live Now</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmBroadcastPlot(null)}
                  className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 text-xs font-bold hover:bg-gray-100 transition-colors order-2 sm:order-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
