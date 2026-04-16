import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Scale, AlertTriangle, CreditCard, UserCheck } from 'lucide-react';

export default function TermsPage() {

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="card p-8 md:p-12">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 gradient-gold rounded-2xl flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-[#1A3A6B]">Kushtet e Shërbimit</h1>
            </div>

            <div className="prose prose-blue max-w-none text-gray-600 space-y-6 text-sm md:text-base">
              <p className="text-sm text-gray-400 italic">E përditësuar së fundmi: 13 Prill 2026</p>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex items-center space-x-2 text-red-800 font-bold mb-1">
                  <AlertTriangle className="w-5 h-5" />
                  <span>MOHIM PËRGJEGJËSIE (DISCLAIMER)</span>
                </div>
                <p className="text-red-700 text-sm">
                  FindYourTender nuk është organ i administratës shtetërore, nuk është e lidhur me asnjë institucion qeveritar dhe nuk përfaqëson portale zyrtare të prokurimit. Ne jemi një platformë private informative që grumbullon dhe analizon të dhënat publike nga burimet zyrtare (e-prokurimi.rks-gov.net).
                </p>
              </div>

              <section>
                <h2 className="text-xl font-bold text-[#1A3A6B] mb-3 flex items-center">
                   <UserCheck className="w-5 h-5 mr-2 text-[#F0A500]" /> 1. Pranimi i Kushteve
                </h2>
                <p>
                  Duke krijuar një llogari në FindYourTender, ju pajtoheni plotësisht me këto Kushte të Shërbimit. Në qoftë se nuk pajtoheni me ndonjë pjesë të këtyre kushteve, duhet të ndërprisni përdorimin e platformës menjëherë.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#1A3A6B] mb-3 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-[#F0A500]" /> 2. Abonimet dhe Pagesat
                </h2>
                <p>
                  Aksesi në listat e detajuara të tenderëve kërkon një abonim aktiv prej €10/muaj. Abonimi bëhet përmes sistemit Paddle dhe rinovohet automatikisht çdo muaj, deri në momentin që ju e anuloni atë nga dashboard-i juaj.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#1A3A6B] mb-3">3. Përdorimi i Shërbimit</h2>
                <p>
                  Ju pajtoheni që shërbimi do të përdoret vetëm për qëllime të ligjshme biznesi. Ndalohet kategorikisht:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Përdorimi i skripteve automatike (scraping) mbi platformën tonë.</li>
                  <li>Shpërndarja e aksesit të llogarisë tuaj me persona të tjerë.</li>
                  <li>Rishitja e informacioneve të marra nga platforma pa pëlqimin tonë me shkrim.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#1A3A6B] mb-3">4. Kufizimi i Përgjegjësisë</h2>
                <p>
                  Edhe pse ne bëjmë çdo përpjekje për të siguruar saktësinë e të dhënave, FindYourTender nuk mban përgjegjësi për:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Gabime ose lëshime në dokumentacionin e tenderëve (gjithmonë referojuni burimit zyrtar).</li>
                  <li>Humbjet financiare si rezultat i vendimeve të marra bazuar në të dhënat tona.</li>
                  <li>Ndërprerjet e mundshme teknike të shërbimit.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#1A3A6B] mb-3">5. Ligji i Zbatuar</h2>
                <p>
                  Këto Kushte rregullohen dhe interpretohen në pajtim me ligjet e Republikës së Kosovës. Çdo kontest do të zgjidhet nga gjykata kompetente në Prishtinë.
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
