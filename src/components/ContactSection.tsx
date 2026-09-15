import React, { useState } from 'react';
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  ShieldCheck, 
  Globe2, 
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { CompanySettings } from '../types';

interface ContactSectionProps {
  settings: CompanySettings;
  onSubmitGeneralInquiry: (data: {
    name: string;
    phone: string;
    email: string;
    subject: string;
    message: string;
  }) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  settings,
  onSubmitGeneralInquiry,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Land Investment Consultation');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitGeneralInquiry({
      name,
      phone,
      email,
      subject,
      message,
    });
    setSubmitted(true);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="contact" className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Dynamic Company Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#EBFBD5] border border-[#68D800]/50 px-3 py-1 rounded-full text-xs font-bold text-black mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4FAF00]" />
                <span>DIRECT ADVISOR CONNECT</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
                Consult With Our Land & Legal Specialists
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-2">
                Whether you're an NRI based in North America looking to invest safely or a local buyer seeking verified DTCP layouts, our advisory team is at your service.
              </p>
            </div>

            {/* Dynamic Contact Cards */}
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#FAFCF9] border border-gray-200 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#68D800] text-black flex items-center justify-center shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-black text-sm">Direct Phone Numbers</div>
                  <div className="text-gray-700 mt-0.5">
                    Primary: <a href={`tel:${settings.primaryPhone}`} className="font-bold hover:underline">{settings.primaryPhone}</a>
                  </div>
                  {settings.secondaryPhone && (
                    <div className="text-gray-500">
                      Secondary: <a href={`tel:${settings.secondaryPhone}`} className="hover:underline">{settings.secondaryPhone}</a>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAFCF9] border border-gray-200 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                  <Globe2 className="w-4 h-4 text-[#68D800]" />
                </div>
                <div>
                  <div className="font-bold text-black text-sm">Dedicated NRI Desk</div>
                  <div className="text-gray-700 mt-0.5">
                    Email: <a href={`mailto:${settings.nriDeskEmail}`} className="font-bold text-emerald-800 hover:underline">{settings.nriDeskEmail}</a>
                  </div>
                  <div className="text-[11px] text-gray-500">
                    WhatsApp: <strong>{settings.whatsappNumber}</strong> (EST / GST responsive)
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAFCF9] border border-gray-200 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-200 text-black flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <div className="font-bold text-black text-sm">Corporate Office</div>
                  <div className="text-gray-600 mt-0.5 leading-relaxed">
                    {settings.officeAddress}
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Direct Action */}
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(settings.companyName)},%20I%20am%20interested%20in%20DTCP%20plots%20investment.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Connect on WhatsApp ({settings.whatsappNumber})</span>
            </a>
          </div>

          {/* Right Column: Inquiry Message Form */}
          <div className="lg:col-span-7 bg-[#FAFCF9] border-2 border-black rounded-3xl p-6 sm:p-8 shadow-lg">
            <h3 className="text-lg font-extrabold text-black mb-1">
              Send an Investment Consultation Request
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Fill in your details below and our Chief Property Auditor will respond with certified DTCP documents.
            </p>

            {submitted ? (
              <div className="p-6 bg-[#EBFBD5] border border-[#68D800] rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#4FAF00] mx-auto" />
                <h4 className="font-extrabold text-black text-base">Request Received!</h4>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Thank you for reaching out to <strong>{settings.companyName}</strong>. A dedicated land consultant has been assigned to your query.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Balakrishnan Raman"
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98401 23456 or +1 408 555 0192"
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Investment Horizon / Purpose</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                    >
                      <option value="Land Investment Consultation">High-Yield Land Investment (1-5 Yrs)</option>
                      <option value="NRI Remote Purchase Inquiry">NRI Remote Purchase with POA</option>
                      <option value="DTCP Legal Verification Request">DTCP & EC Document Verification</option>
                      <option value="Schedule Physical / Video Site Visit">Schedule Physical / Video Site Visit</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Your Requirements / Question</label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about preferred districts (e.g. Coimbatore, Chennai, Hosur) and your target budget..."
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-black focus:ring-2 focus:ring-[#68D800] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#68D800] hover:bg-[#5bc200] text-black font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Submit Consultation Request</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
