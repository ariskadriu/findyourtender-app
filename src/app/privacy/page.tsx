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
                   <FileText className="w-5 h-5 mr-2 text-[#F0A500]" /> 1. Hyrje
                </h2>
                <p>
                  FindYourTender (&quot;ne&quot;, &quot;na&quot;, ose &quot;ynë&quot;) është e përkushtuar të mbrojë privatësinë tuaj. Kjo Politikë e Privatësisë shpjegon se si mbledhim, përdorim dhe mbrojmë të dhënat tuaja personale në përputhje me <strong>Ligjin Nr. 06/L-082 për Mbrojtjen e të Dhënave Personale</strong> në Republikën e Kosovës.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#1A3A6B] mb-3 flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-[#F0A500]" /> 2. Të dhënat që mbledhim
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Të dhënat e llogarisë:</strong> Emri, mbiemri, adresa e email-it, emri i biznesit dhe numri i telefonit kur regjistroheni.</li>
                  <li><strong>Të dhënat e pagesës:</strong> Procesimi i pagesave bëhet përmes Paddle. Ne nuk ruajmë numrat e kartelave tuaja kreditore në serverët tanë.</li>
                  <li><strong>Të dhënat e përdorimit:</strong> Informacione rreth mënyrës se si ndërveproni me platformën tonë (tenderët e kërkuar, kategoritë e preferuara).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#1A3A6B] mb-3 flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-[#F0A500]" /> 3. Si i përdorim të dhënat tuaja
                </h2>
                <p>Ne i përdorim të dhënat tuaja për:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Ofrimin e shërbimeve të agregimit të tenderëve.</li>
                  <li>Menaxhimin e abonimit tuaj dhe procesimin e pagesave.</li>
                  <li>Dërgimin e njoftimeve për tenderë të rinj sipas preferencave tuaja.</li>
                  <li>Përmirësimin e sigurisë dhe performancës së platformës.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#1A3A6B] mb-3">4. Mbrojtja e të dhënave</h2>
                <p>
                  Ne zbatojmë masa teknike dhe organizative të sigurisë për të mbrojtur të dhënat tuaja kundër qasjes së paautorizuar, ndryshimit ose shkatërrimit. Të gjitha komunikimet janë të enkriptuara përmes teknologjisë SSL.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#1A3A6B] mb-3">5. Të drejtat tuaja</h2>
                <p>Sipas ligjit në fuqi në Kosovë, ju keni të drejtë:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Të keni qasje në të dhënat tuaja personale.</li>
                  <li>Të kërkoni korrigjimin e të dhënave të pasakta.</li>
                  <li>Të kërkoni fshirjen e të dhënave tuaja (&quot;të drejtën për t&apos;u harruar&quot;).</li>
                  <li>Të tërhiqni pëlqimin për njoftime marketingu në çdo kohë.</li>
                </ul>
              </section>

              <section className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h2 className="text-lg font-bold text-[#1A3A6B] mb-2">Na Kontaktoni</h2>
                <p className="text-sm">
                  Për çdo pyetje rreth privatësisë suaj, mund të na kontaktoni në:<br />
                  <strong>Email:</strong> privacy@findyourtender.com<br />
                  <strong>Adresa:</strong> Prishtinë, Kosovë
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
