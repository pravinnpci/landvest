import React from 'react';
import { 
  ShieldCheck, 
  FileCheck2, 
  ScrollText, 
  Landmark, 
  MapPinCheck, 
  Stamp, 
  Plane, 
  CheckCircle2, 
  ArrowRight,
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import { CompanySettings } from '../types';

interface ProcedureSectionProps {
  settings: CompanySettings;
  onContactClick: () => void;
}

export const ProcedureSection: React.FC<ProcedureSectionProps> = ({
  settings,
  onContactClick,
}) => {
  const procedures = [
    {
      step: '01',
      title: 'DTCP & RERA Layout Sanction Audit',
      description: 'We authenticate the original layout approval order from the Directorate of Town and Country Planning (DTCP) or Local Planning Authority (LPA). Every plot has certified public road access and open space reservations.',
      badge: '100% Sanctioned',
      icon: ShieldCheck,
    },
    {
      step: '02',
      title: '3-Year Encumbrance Certificate & Parent Deed Legal Opinion',
      description: 'Our senior High Court panel advocates conduct a rigorous 3-year title chain search at the Sub-Registrar Office (SRO). We certify zero prior mortgages, family disputes, or encumbrances.',
      badge: 'Certified Clean Title',
      icon: ScrollText,
    },
    {
      step: '03',
      title: 'Revenue Patta, Chitta & Adangal Name Transfer',
      description: 'Post-registration, we execute the formal e-Patta and computerized revenue record transfer into the new buyer’s name through the Taluk office, ensuring 100% legal revenue ownership.',
      badge: 'Direct Name Transfer',
      icon: FileCheck2,
    },
    {
      step: '04',
      title: 'Physical Boundary Demarcation & Marker Stones',
      description: 'Before registration, licensed taluk surveyors conduct on-site DGPS measuring. Individual granite plot stones and boundary markings are placed according to the sanctioned DTCP plan.',
      badge: 'On-Ground Verified',
      icon: MapPinCheck,
    },
    {
      step: '05',
      title: 'Sub-Registrar Registration & Stamp Duty Assistance',
      description: 'We draft the bilingual Sale Deed, calculate exact government stamp duty and registration fees, and schedule biometric token slots at the respective Sub-Registrar jurisdiction.',
      badge: 'Hassle-Free Closing',
      icon: Stamp,
    },
    {
      step: '06',
      title: 'Dedicated NRI & Remote Investor Concierge',
      description: 'Living in the US, UAE, UK or Singapore? You do not need to fly to India. We assist with legally compliant Power of Attorney (POA) registration at your local Indian Embassy/Consulate and NRE/NRO banking.',
      badge: 'Worldwide Remote Execution',
      icon: Plane,
    },
  ];

  return (
    <section id="procedure" className="py-16 bg-white border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 bg-[#EBFBD5] border border-[#68D800]/50 px-3.5 py-1 rounded-full text-xs font-bold text-black mb-3">
            <FileCheck2 className="w-3.5 h-3.5 text-[#4FAF00]" />
            <span>END-TO-END LEGAL & PHYSICAL DUE DILIGENCE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black tracking-tight">
            Procedure We Are Taking Care
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            Buying land should be peaceful and rewarding. We eliminate 100% of the bureaucratic hassle, paperwork confusion, and legal ambiguities so you invest with absolute certainty.
          </p>
        </div>

        {/* Procedures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {procedures.map((proc) => {
            const IconComponent = proc.icon;
            return (
              <div 
                key={proc.step}
                className="bg-[#FAFCF9] border-2 border-gray-200 hover:border-slate-900 rounded-2xl p-6 transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-xl bg-[#68D800] text-black font-black text-sm flex items-center justify-center shadow-xs">
                      {proc.step}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800 bg-[#EBFBD5] px-2.5 py-0.5 rounded-full border border-[#D5F2B5]">
                      {proc.badge}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-black text-lg mb-2 group-hover:text-[#4FAF00] transition-colors">
                    {proc.title}
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {proc.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-black">
                  <CheckCircle2 className="w-4 h-4 text-[#4FAF00]" />
                  <span>Fully Managed by {settings.companyName.split(' ')[0]} Legal Team</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner Call to Action */}
        <div className="mt-12 bg-black text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-[#68D800]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 relative z-10 max-w-xl">
            <span className="text-xs font-extrabold text-[#68D800] uppercase tracking-wider">
              Zero Litigation Assurance
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Have a plot you want our legal team to audit?
            </h3>
            <p className="text-xs text-gray-300">
              Speak directly with our Chief Legal Officer or request a sample DTCP clearance docket before paying any advance token.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10 shrink-0">
            <button
              onClick={onContactClick}
              className="px-6 py-3 bg-[#68D800] hover:bg-[#5bc200] text-black font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <span>Speak with Legal Desk</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={`tel:${settings.primaryPhone}`}
              className="px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs sm:text-sm rounded-xl border border-gray-700 transition-colors flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#68D800]" />
              <span>{settings.primaryPhone}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
