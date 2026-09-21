import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  Scale, 
  FileCheck2, 
  MapPin, 
  Users, 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Landmark
} from 'lucide-react';
import { CompanySettings } from '../types';

interface AboutSectionProps {
  settings: CompanySettings;
  onContactClick: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  settings,
  onContactClick,
}) => {
  return (
    <section id="about" className="py-16 md:py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-300 px-3.5 py-1 rounded-full text-xs font-bold text-emerald-900 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>WHO WE ARE & OUR MISSION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight">
            About {settings.companyName}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Bridging overseas investors and Non-Resident Indians (NRIs) with premium, 100% DTCP-approved land corridors across India with zero litigation risk and transparent capital predictions.
          </p>
        </div>

        {/* 2-Column Story with High-Res Infrastructure / Land Photo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          {/* Left Column: Image with Stats Overlay */}
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100 aspect-4/3 sm:aspect-16/10 relative group">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80" 
                alt="Institutional Infrastructure and Land Investment" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-lg flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Audit Commitment</div>
                  <div className="text-sm font-bold text-slate-900">30-Year Chain Deed Legal Audit</div>
                </div>
                <div className="px-3 py-1 bg-emerald-500 text-slate-950 rounded-lg text-xs font-black">
                  100% Verified
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Key Tenets */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950">
                Empowering Global Indians to Build Generational Wealth in Land
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                For over a decade, overseas buyers have faced physical distance barriers, opaque broker networks, and boundary encroachments. {settings.companyName} was engineered as a high-trust institutional bridge: every plot is field-surveyed with DGPS boundary stones, sanctioned by DTCP, and verified by High Court panel advocates before public listing.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-800 hover:shadow-lg transition-all duration-300">
                <Scale className="w-5 h-5 text-emerald-600 mb-2" />
                <h4 className="text-xs font-bold text-slate-900 mb-1">Zero Bureaucracy</h4>
                <p className="text-[11px] text-slate-500">
                  Consulate Special POA, Taluk computerized e-Patta name transfer, and registration slots handled entirely by us.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-800 hover:shadow-lg transition-all duration-300">
                <TrendingUp className="w-5 h-5 text-emerald-600 mb-2" />
                <h4 className="text-xs font-bold text-slate-900 mb-1">Proven High Yields</h4>
                <p className="text-[11px] text-slate-500">
                  Targeted infrastructure corridors yielding 12% to 22% annual capital appreciation with mathematical compound forecasting.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onContactClick}
                className="px-6 py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <span>Schedule a Consultation with our NRI Team</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Assurance */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 hover:border-slate-800 hover:shadow-lg transition-all duration-300 text-center">
            <div className="text-2xl sm:text-3xl font-black text-emerald-800 mb-1">100%</div>
            <div className="text-xs font-bold text-slate-900">DTCP Sanctioned</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Government Approved Layouts</div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 hover:border-slate-800 hover:shadow-lg transition-all duration-300 text-center">
            <div className="text-2xl sm:text-3xl font-black text-emerald-800 mb-1">3 Yrs</div>
            <div className="text-xs font-bold text-slate-900">Title Chain Search</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Zero Prior Encumbrance</div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 hover:border-slate-800 hover:shadow-lg transition-all duration-300 text-center">
            <div className="text-2xl sm:text-3xl font-black text-emerald-800 mb-1">USD $1M</div>
            <div className="text-xs font-bold text-slate-900">Annual Repatriation</div>
            <div className="text-[10px] text-slate-500 mt-0.5">RBI FEMA LRS Compliant</div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 hover:border-slate-800 hover:shadow-lg transition-all duration-300 text-center">
            <div className="text-2xl sm:text-3xl font-black text-emerald-800 mb-1">50+</div>
            <div className="text-xs font-bold text-slate-900">NRI Families Settled</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Across USA, UAE, UK & SG</div>
          </div>
        </div>
      </div>
    </section>
  );
};
