/* eslint-disable */
import fs from 'fs';
import path from 'path';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { getTranslations } from '@/lib/i18n';
import { Mail, MapPin } from 'lucide-react';

export default async function ContactPage() {
  const t = await getTranslations('sq');
  
  // Load raw translations for the client component
  const translations = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), 'locales', 'sq.json'), 
      'utf8'
    )
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />
      <div className="pt-20">
        <div className="gradient-navy py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-3">{t('contact.title')}</h1>
            <p className="text-blue-200 text-lg">Jemi këtu për t&apos;ju ndihmuar</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-10">
          {/* Contact info */}
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 gradient-gold rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-[#1A3A6B]">Adresa</div>
                  <div className="text-gray-500 text-sm">{t('contact.address')}</div>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#2D6BE4]/10 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#2D6BE4]" />
                </div>
                <div>
                  <div className="font-semibold text-[#1A3A6B]">Email</div>
                  <a href="mailto:info@findyourtender.com"
                    className="text-[#2D6BE4] text-sm hover:underline">
                    {t('contact.email_address')}
                  </a>
                </div>
              </div>
            </div>

            {/* FAQ section */}
            <div className="card p-6">
              <h3 className="font-bold text-[#1A3A6B] mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-[#F0A500] rounded-full mr-3" />
                Pyetje të Shpeshta
              </h3>
              <div className="space-y-4">
                {[
                  {
                    q: 'Si mund të anuloj abonimin tim?',
                    a: 'Abonimin mund ta anuloni në çdo kohë përmes Dashboard-it tuaj në seksionin "Abonimi". Qasja juaj do të mbetet aktive deri në fund të periudhës që keni paguar.'
                  },
                  {
                    q: 'A ofron FindYourTender shërbime aplikimi?',
                    a: 'Jo, ne jemi platformë informative. Platforma ju dërgon direkt te burimi zyrtar (E-Prokurimi) ku duhet të kryeni procesin e aplikimit sipas rregullave ligjore.'
                  },
                  {
                    q: 'Sa shpesh përditësohen tenderët?',
                    a: 'Sistemi ynë automatik skanon burimet zyrtare çdo 6 orë për t\'u siguruar që ju të shihni çdo shpallje të re pothuajse në kohë reale.'
                  },
                  {
                    q: 'Çfarë ndodh nëse kam probleme me pagesën?',
                    a: 'Ne përdorim Paddle si procesor pagesash. Nëse hasni ndonjë vështirësi, na shkruani dhe ekipi ynë do t\'ju ndihmojë brenda pak orëve.'
                  }
                ].map((item, idx) => (
                  <details key={idx} className="group border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-sm text-[#1A3A6B] hover:text-[#2D6BE4] transition-colors">
                      <span>{item.q}</span>
                      <span className="text-[#F0A500] transition-transform group-open:rotate-180">↓</span>
                    </summary>
                    <p className="mt-2 text-xs text-gray-500 leading-relaxed bg-gray-50 p-3 rounded-lg">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="card p-8">
            <ContactForm translations={translations} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
