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
                  Duke krijuar një llogari në FindYourTender, ju pajtoheni plotësisht me këto Kushte të Shërbimit. Në qoftë se nuk pajtoheni me ndonjë pjesë të këtyre kushteve, duhet të ndërprisni përdorimin e platformës menjëherë. Ne rezervojmë të drejtën për të ndryshuar këto kushte në çdo kohë pa njoftim paraprak.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#1A3A6B] mb-3 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-[#F0A500]" /> 2. Abonimet, Pagesat dhe Partnerët
                </h2>
                <p className="mb-4">
                  Aksesi në listat e detajuara të tenderëve kërkon një abonim aktiv prej €10/muaj. Ne përdorim <strong>Paddle</strong> si tregtar zyrtar të regjistruar (Merchant of Record). Të gjitha transaksionet, faturimet dhe rimbursimet procesohen përmes tyre.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Rinovimi:</strong> Abonimi rinovohet automatikisht çdo muaj.</li>
                  <li><strong>Anulimi:</strong> Ju mund ta anuloni abonimin në çdo kohë nga dashboard-i juaj. Anulimi do të jetë efektiv në fund të ciklit aktual të faturimit.</li>
                  <li><strong>Rimbursimet:</strong> Për shkak të natyrës digjitale të shërbimit, ne nuk ofrojmë rimbursime pasi të dhënat janë aksesuar.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#1A3A6B] mb-3">3. Përdorimi i Shërbimit dhe Integriteti i të Dhënave</h2>
                <p className="mb-4">
                  FindYourTender grumbullon të dhëna nga portali "e-prokurimi" i Republikës së Kosovës. Ju pajtoheni që shërbimi do të përdoret vetëm për qëllime të ligjshme biznesi.
                </p>
                <h4 className="font-bold text-[#1A3A6B] text-sm mb-2">Ndalohet kategorikisht:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Përdorimi i skripteve automatike, bot-eve ose scraping-ut mbi platformën tonë.</li>
                  <li>Shpërndarja e kredencialeve të llogarisë me persona të tretë (një llogari për një biznes).</li>
                  <li>Publikimi ose rishitja e informacioneve tona në platforma të tjera konkurruese.</li>
                  <li>Manipulimi i të dhënave ose tentimi për të ndërhyrë në infrastrukturën teknike.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#1A3A6B] mb-3">4. Kufizimi i Përgjegjësisë (Disclaimer)</h2>
                <p className="mb-4 text-red-700 font-medium">
                  FindYourTender OLFSHON SHËRBIMIN "SIÇ ËSHTË" PA ASNJË GARANCI TË SHPREHUR.
                </p>
                <p>
                  Edhe pse ne bëjmë çdo përpjekje për të siguruar saktësinë e të dhënave përmes sistemit tonë të skanimit, ne nuk mbajmë përgjegjësi nëse të dhënat në portalin zyrtar ndryshojnë pas skanimit tonë të fundit. Përgjegjësia finale për dorëzimin e ofertës dhe saktësinë e dokumentacionit mbetet te ju.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#1A3A6B] mb-3">5. Pronësia Intelektuale</h2>
                <p>
                  Logot, dizajni, kodi burimor dhe marka "FindYourTender" janë pronë ekskluzive e platformës tonë. Përmbajtja e tenderëve i përket autoriteteve kontraktuese përkatëse dhe rregullohet sipas ligjeve të Kosovës mbi të dhënat publike dhe prokurimin.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#1A3A6B] mb-3">6. Ligji i Zbatuar dhe Juridiksioni</h2>
                <p>
                  Këto Kushte rregullohen dhe interpretohen në pajtim me ligjet e Republikës së Kosovës. Për çdo mosmarrëveshje që nuk mund të zgjidhet në mënyrë miqësore, kompetente është Gjykata Themelore në Prishtinë.
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
