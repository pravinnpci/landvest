import React, { useState } from 'react';
import { 
  Globe2, 
  Coins, 
  ShieldCheck, 
  HelpCircle, 
  Plane, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  FileText,
  DollarSign
} from 'lucide-react';
import { CompanySettings, CurrencyCode } from '../types';
import { CURRENCIES, formatCurrency } from '../utils/currency';

interface NRICornerProps {
  settings: CompanySettings;
  activeCurrency: CurrencyCode;
  onCurrencyChange: (curr: CurrencyCode) => void;
  onExplorePlots: () => void;
}

export const NRICorner: React.FC<NRICornerProps> = ({
  settings,
  activeCurrency,
  onCurrencyChange,
  onExplorePlots,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Can NRIs and OCIs legally purchase DTCP plots in India?',
      a: 'Yes, 100%. Under Reserve Bank of India (RBI) and FEMA master directions, Non-Resident Indians (NRIs) and Overseas Citizens of India (OCIs) can freely buy any residential or commercial plots in India. No special RBI prior approval is needed.',
    },
    {
      q: 'How does remote purchase via Power of Attorney (POA) work?',
      a: 'If you reside in the US, UAE, or elsewhere and cannot fly to India for registration, we prepare a legally compliant Special Power of Attorney (POA). You sign it and have it notarized/attested at the Indian Embassy or Consulate in your city. Your authorized attorney (a family member or appointed legal nominee) executes the registration on your behalf.',
    },
    {
      q: 'Can sales proceeds and capital appreciation be repatriated overseas?',
      a: 'Yes. Up to USD $1 Million (or equivalent foreign currency) per financial year can be freely repatriated under the RBI Liberalised Remittance Scheme (LRS) through standard NRE/NRO bank accounts with Form 15CA/15CB.',
    },
    {
      q: 'Why invest in Tamil Nadu & South India land corridors now?',
      a: 'The aggressive infrastructure pipeline—including the Chennai-Bangalore Expressway, Coimbatore Metro & Aerospace SEZ, Hosur Tech Belt, and Parandur Greenfield Airport—is creating a 15% to 22% annual capital appreciation rate that consistently outpaces Wall Street S&P 500 index yields when measured in stable land value.',
    },
  ];

  return (
    <section id="nri" className="py-16 bg-[#FAFCF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 bg-[#EBFBD5] border border-[#68D800]/50 px-3.5 py-1 rounded-full text-xs font-bold text-black mb-3">
            <Globe2 className="w-3.5 h-3.5 text-[#4FAF00]" />
            <span>GLOBAL INVESTOR & NRI DESK</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black tracking-tight">
            Invest in India’s High-Yield Land from the US & Worldwide
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            Tailored remote investment protocols for Indians in North America, the Middle East, Europe, and Asia-Pacific.
          </p>
        </div>

        {/* Currency Power Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          <div className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-black">
                  Currency Advantage & Purchasing Power
                </h3>
                <p className="text-xs text-gray-500">
                  Select your home currency to review automatic real-time valuations
                </p>
              </div>

              {/* Currency Selector Chips */}
              <div className="flex gap-1.5 flex-wrap">
                {(['USD', 'AED', 'GBP', 'EUR', 'SGD', 'CAD', 'INR'] as CurrencyCode[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => onCurrencyChange(c)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeCurrency === c
                        ? 'bg-[#68D800] text-black shadow-xs font-black'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {CURRENCIES[c].flag} {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Currency Comparative Table */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#F8FCF5] border border-[#D5F2B5] p-4 rounded-xl">
                <div className="text-[10px] font-bold text-gray-400 uppercase">Entry Investment</div>
                <div className="text-base font-black text-black mt-1">
                  {formatCurrency(2500000, activeCurrency)}
                </div>
                <div className="text-[11px] text-gray-600 mt-0.5">Approx ₹25 Lakhs</div>
                <div className="text-[10px] text-[#4FAF00] font-bold mt-2">
                  Suitable for 1-2 Cents Villa Plot
                </div>
              </div>

              <div className="bg-[#F8FCF5] border border-[#D5F2B5] p-4 rounded-xl">
                <div className="text-[10px] font-bold text-gray-400 uppercase">Prime Corridor Plot</div>
                <div className="text-base font-black text-black mt-1">
                  {formatCurrency(4500000, activeCurrency)}
                </div>
                <div className="text-[11px] text-gray-600 mt-0.5">Approx ₹45 Lakhs</div>
                <div className="text-[10px] text-[#4FAF00] font-bold mt-2">
                  5 Cents DTCP Approved
                </div>
              </div>

              <div className="bg-[#F8FCF5] border border-[#D5F2B5] p-4 rounded-xl">
                <div className="text-[10px] font-bold text-gray-400 uppercase">Commercial / Double Plot</div>
                <div className="text-base font-black text-black mt-1">
                  {formatCurrency(8500000, activeCurrency)}
                </div>
                <div className="text-[11px] text-gray-600 mt-0.5">Approx ₹85 Lakhs</div>
                <div className="text-[10px] text-[#4FAF00] font-bold mt-2">
                  Corner Commercial Facing
                </div>
              </div>
            </div>

            {/* NRI Trust Checklist */}
            <div className="space-y-2.5 pt-2">
              <div className="text-xs font-bold text-black uppercase tracking-wider">
                Full Remote Purchase Guarantee for Overseas Investors:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4FAF00] shrink-0" />
                  <span>Live HD Drone & 360° Video Walkthroughs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4FAF00] shrink-0" />
                  <span>NRE / NRO Bank Account Compliance Assistance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4FAF00] shrink-0" />
                  <span>Consulate-Attested Special POA Drafting</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4FAF00] shrink-0" />
                  <span>Registered Deed Courier to your Overseas Address</span>
                </div>
              </div>
            </div>

            <button
              onClick={onExplorePlots}
              className="w-full py-3 bg-black hover:bg-gray-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span>Browse Broadcasted DTCP Plots in {activeCurrency}</span>
              <ArrowRight className="w-4 h-4 text-[#68D800]" />
            </button>
          </div>

          {/* Right Column: NRI FAQs Accordion */}
          <div className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-black text-lg flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#4FAF00]" />
              <span>NRI Legal & Investment FAQs</span>
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                    openFaq === idx 
                      ? 'border-emerald-500 shadow-md bg-white' 
                      : 'border-slate-200 hover:border-emerald-400 hover:shadow-sm bg-slate-50/70 hover:bg-emerald-50/40'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left p-3.5 sm:p-4 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-900 group"
                  >
                    <span className="group-hover:text-emerald-800 transition-colors">{faq.q}</span>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono transition-transform duration-300 ${
                      openFaq === idx ? 'bg-emerald-500 text-slate-950 rotate-180' : 'bg-slate-200 text-slate-700 group-hover:bg-emerald-200'
                    }`}>
                      {openFaq === idx ? '−' : '+'}
                    </span>
                  </button>
                  {openFaq === idx && (
                    <div className="p-3.5 sm:p-4 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-emerald-100 animate-in fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-3 bg-[#EBFBD5] rounded-xl border border-[#68D800]/40 text-xs">
              <span className="font-bold text-black block mb-0.5">Direct Overseas Hotline:</span>
              <div className="text-gray-700">
                Email: <strong>{settings.nriDeskEmail}</strong>
              </div>
              <div className="text-gray-700">
                WhatsApp: <strong>{settings.whatsappNumber}</strong> (EST / PST / GST responsive)
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
