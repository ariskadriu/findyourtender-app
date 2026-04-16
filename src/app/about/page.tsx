/* eslint-disable */
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getTranslations } from '@/lib/i18n';
import { Target, Heart, Users, Globe } from 'lucide-react';

export default async function AboutPage() {
  const t = await getTranslations('sq');

  const values = [
    { 
      id: 1, 
      icon: Globe, 
      title: t('about.values_transparency_title'), 
      desc: t('about.values_transparency_desc'), 
      color: '#1A3A6B' 
    },
    { 
      id: 2, 
      icon: Users, 
      title: t('about.values_community_title'), 
      desc: t('about.values_community_desc'), 
      color: '#F0A500' 
    },
    { 
      id: 3, 
      icon: Target, 
      title: t('about.values_accuracy_title'), 
      desc: t('about.values_accuracy_desc'), 
      color: '#2D6BE4' 
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />
      <div className="pt-20">
        {/* Hero */}
        <div className="gradient-navy py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-1 mb-6">
              <span className="text-4xl font-bold text-white">FindYour</span>
              <span className="text-4xl font-bold text-[#F0A500]">Tender</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">{t('about.title')}</h1>
            <p className="text-blue-200 text-xl max-w-2xl mx-auto leading-relaxed">
              Gjej. Krahaso. Shko.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
          {/* Mission */}
          <div className="card p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 gradient-gold rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#1A3A6B]">{t('about.mission_title')}</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg">{t('about.mission_text')}</p>
          </div>

          {/* Why */}
          <div className="card p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-[#2D6BE4]/10 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-[#2D6BE4]" />
              </div>
              <h2 className="text-2xl font-bold text-[#1A3A6B]">{t('about.why_title')}</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg">{t('about.why_text')}</p>
          </div>

          {/* Values grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, desc, color, id }) => (
              <div key={id} className="card p-6 text-center hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${color}15` }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <h3 className="font-bold text-[#1A3A6B] mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Disclaimer box */}
          <div className="p-6 gradient-navy rounded-2xl text-white">
            <h3 className="font-bold text-lg mb-3">⚠️ {t('about.disclaimer_title')}</h3>
            <div className="text-blue-200 leading-relaxed space-y-2">
              <p>{t('about.disclaimer_p1')}</p>
              <p>{t('about.disclaimer_p2')}</p>
              <p>
                {t('about.disclaimer_p3')}{' '}
                <a href="https://e-prokurimi.rks-gov.net" target="_blank" rel="noopener noreferrer"
                  className="text-[#F0A500] hover:underline">
                  e-prokurimi.rks-gov.net
                </a>.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
