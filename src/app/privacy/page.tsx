'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="card p-8 md:p-12">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 gradient-blue rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-[#1A3A6B]">Politika e Privatësisë</h1>
            </div>

            <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
              <p className="text-sm text-gray-400 italic">E përditësuar së fundmi: 13 Prill 2026</p>

               <section>
                <h2 className="text-xl font-bold text-[#1A3A6B] mb-3 flex items-center">
                   <FileText className="w-5 h-5 mr-2 text-[#F0A500]" /> 1. Hyrje dhe Baza Ligjore
                </h2>
                <p>
                  FindYourTender është e përkushtuar të mbrojë privatësinë tuaj. Ne mbledhim dhe përpunojmë të dhënat tuaja në përputhje me <strong>Ligjin Nr. 06/L-082 për Mbrojtjen e të Dhënave Personale</strong> në Kosovë dhe standardet e GDPR. Baza jonë ligjore për mbledhjen e të dhënave është përmbushja e kontratës (shërbimit) dhe pëlqimi juaj i shprehur.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#1A3A6B] mb-3 flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-[#F0A500]" /> 2. Çfarë të dhënash mbledhim?
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Identiteti:</strong> Emri, mbiemri, emri i biznesit dhe numri i telefonit.</li>
                  <li><strong>Kontaktet:</strong> Adresa e email-it për dërgimin e njoftimeve dhe faturave.</li>
                  <li><strong>Teknike:</strong> Adresa IP, lloji i shfletuesit, dhe cookies (përfshirë ato për sesionin dhe gjuhën e preferuar).</li>
                  <li><strong>Financiare:</strong> Ne nuk ruajmë të dhëna bankare. Të gjitha pagesat procesohen nga <strong>Paddle</strong>, i cili grumbullon të dhënat tuaja të faturimit sipas politikave të tyre të sigurisë.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#1A3A6B] mb-3 flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-[#F0A500]" /> 3. Si i përdorim të dhënat tuaja?
                </h2>
                <p className="mb-4">Të dhënat tuaja përdoren ekskluzivisht për:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Krijimin dhe identifikimin e llogarisë tuaj.</li>
                  <li>Përditësimin e statusit të abonimit përmes sistemeve tona dhe Paddle.</li>
                  <li>Dërgimin e "Tenderëve të Ditës" bazuar në kategoritë që ju keni zgjedhur.</li>
                  <li>Analizë të Brendshme: Për të kuptuar cilat rajone ose kategori janë më të kërkuara në Kosovë.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#1A3A6B] mb-3 border-l-4 border-[#F0A500] pl-4">4. Ndarja e të dhënave me palët e treta</h2>
                <p className="mb-4">Ne nuk i shesim të dhënat tuaja. Ne i ndajmë ato vetëm me partnerë të besuar për funksionimin e shërbimit:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Paddle:</strong> Për procesim të pagesave dhe taksave.</li>
                  <li><strong>Resend:</strong> Për dërgimin e email-eve automatike.</li>
                  <li><strong>Firebase (Google):</strong> Për ruajtjen e sigurt të bazës së të dhënave dhe autentifikim.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#1A3A6B] mb-3">5. Siguria dhe Cookies</h2>
                <p>
                  Ne përdorim teknologjinë moderne SSL për të enkriptuar çdo transferim të dhënash. Platforma përdor "Cookies" për të mbajtur mend preferencat tuaja (si gjuha Shqip/English) dhe për të qëndruar të identifikuar në sistem. Ju mund t'i bllokoni ato në shfletues, por kjo mund të limitojë funksionalitetin e faqes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#1A3A6B] mb-3">6. Të drejtat tuaja ligjore</h2>
                <p>Ju gëzoni të drejtën për të kërkuar qasje, korrigjim ose fshirje totale të të dhënave tuaja nga sistemet tona në çdo kohë. Për këtë, ju lutem na shkruani në email-in zyrtar të privatësisë.</p>
              </section>

              <section className="bg-[#1A3A6B]/5 p-6 rounded-2xl border border-[#1A3A6B]/10">
                <h2 className="text-lg font-bold text-[#1A3A6B] mb-2">Zyra e Privatësisë</h2>
                <p className="text-sm">
                  Për çdo kërkesë ligjore ose ankesë:<br />
                  <strong>Email:</strong> support@findyourtender.com<br />
                  <strong>Juridiksioni:</strong> Prishtinë, Republika e Kosovës
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
