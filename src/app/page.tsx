import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedCounter from '@/components/AnimatedCounter';
import { getTranslations } from '@/lib/i18n';
import {
  Search, CheckCircle, ArrowRight, Star, Zap, Shield,
  Bell, Globe, Database, ChevronRight, TrendingUp
} from 'lucide-react';

export default async function HomePage() {
  const t = await getTranslations('sq');

  const features = [
    { icon: Database, key: 'f1', color: '#2D6BE4' },
    { icon: Search, key: 'f2', color: '#F0A500' },
    { icon: Bell, key: 'f3', color: '#10B981' },
    { icon: Zap, key: 'f4', color: '#8B5CF6' },
    { icon: Shield, key: 'f5', color: '#EF4444' },
    { icon: Globe, key: 'f6', color: '#F0A500' },
  ];

  const testimonials = [
    {
      name: 'Artan Berisha',
      company: 'Berisha Construction Sh.p.k',
      text: 'FindYourTender na ka kursyer orë të tëra kërkimi çdo javë. Tani gjejmë tenderët e ndërtimit menjëherë!',
      rating: 5,
    },
    {
      name: 'Vjosa Krasniqi',
      company: 'TechSolutions Kosovo',
      text: 'Platforma e vetme që i mbledh të gjithë tenderët IT në një vend. Njoftime me email janë shumë të dobishme.',
      rating: 5,
    },
    {
      name: 'Driton Morina',
      company: 'Morina & Partners Consulting',
      text: 'Çmimi €10/muaj është shumë i arsyeshëm për vlerën që marrim. E rekomandoj çdo biznes kosovar.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Real Background Image - Optimized with next/image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-real.jpg"
            alt="Prishtina National Library"
            fill
            priority
            quality={90}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#0F2347]/75 backdrop-blur-[2px]" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#F5F7FA] to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 rounded-full px-5 py-2.5 mb-10 backdrop-blur-md animate-fade-in-up">
              <span className="w-2.5 h-2.5 bg-[#F0A500] rounded-full shadow-[0_0_12px_#F0A500]" />
              <span className="text-white text-sm font-bold tracking-wide uppercase">Dritarja juaj drejt prokurimit publik në Kosovë 🇽🇰</span>
            </div>

            {/* Headline with Glassmorphism Overlay for high readability */}
            <div className="glass p-8 md:p-12 rounded-[2.5rem] mb-12 shadow-2xl animate-fade-in-up animation-delay-200">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white leading-[1.1] mb-8 tracking-tight">
                {t('hero.headline').split(' ').map((word: string, i: number) =>
                  i >= 3 ? (
                    <span key={i} className="text-[#F0A500]"> {word}</span>
                  ) : (
                    <span key={i}> {word}</span>
                  )
                )}
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-medium">
                {t('hero.subtext')}
              </p>
            </div>

            {/* Main CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up animation-delay-400">
              <Link
                href="/register"
                id="hero-register-btn"
                className="group w-full sm:w-auto flex items-center justify-center space-x-3 bg-[#F0A500] hover:bg-[#C87800] text-white font-black px-12 py-5 rounded-2xl transition-all duration-300 shadow-[0_20px_40px_-15px_rgba(240,165,0,0.5)] hover:shadow-[0_25px_50px_-12px_rgba(240,165,0,0.6)] hover:-translate-y-1.5 text-xl uppercase tracking-wider"
              >
                <span>{t('hero.cta_primary')}</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                href="/tenders"
                id="hero-tenders-btn"
                className="group w-full sm:w-auto flex items-center justify-center space-x-3 bg-white/10 hover:bg-white/20 text-white font-bold px-12 py-5 rounded-2xl transition-all duration-300 backdrop-blur-md border border-white/30 text-xl"
              >
                <span>{t('hero.cta_secondary')}</span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto animate-fade-in-up animation-delay-600">
              {[
                { icon: CheckCircle, text: 'Burime Zyrtare Qeveritare', color: '#F0A500' },
                { icon: Shield, text: 'Pagesa e Sigurt me Paddle', color: '#10B981' },
                { icon: Zap, text: 'Përditësuar çdo 6 orë', color: '#2D6BE4' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center justify-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/10">
                  <badge.icon className="w-5 h-5" style={{ color: badge.color }} />
                  <span className="text-white text-xs font-bold uppercase tracking-wide">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white shadow-md py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { target: 1200, suffix: '+', label: t('stats.tenders'), icon: '📄' },
              { target: 50, suffix: '+', label: t('stats.institutions'), icon: '🏛️' },
              { target: 500, suffix: '+', label: t('stats.businesses'), icon: '🏢' },
            ].map((stat) => (
              <div key={stat.label} className="group">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-4xl font-bold text-[#1A3A6B] group-hover:text-[#F0A500] transition-colors">
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                </div>
                <div className="text-gray-500 text-sm font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">{t('how_it_works.title')}</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Tre hapa të thjeshtë për të gjetur tenderin e duhur</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-[#1A3A6B] via-[#F0A500] to-[#1A3A6B] opacity-20" />

          {[
            {
              step: '01',
              title: t('how_it_works.step1_title'),
              desc: t('how_it_works.step1_desc'),
              icon: '👤',
              color: '#1A3A6B',
            },
            {
              step: '02',
              title: t('how_it_works.step2_title'),
              desc: t('how_it_works.step2_desc'),
              icon: '🔍',
              color: '#2D6BE4',
            },
            {
              step: '03',
              title: t('how_it_works.step3_title'),
              desc: t('how_it_works.step3_desc'),
              icon: '🚀',
              color: '#F0A500',
            },
          ].map((item) => (
            <div key={item.step} className="card p-8 text-center hover:-translate-y-2 transition-transform duration-300 group">
              <div className="text-4xl mb-4">{item.icon}</div>
              <div
                className="text-xs font-bold uppercase tracking-widest mb-3 inline-block px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: item.color }}
              >
                Hapi {item.step}
              </div>
              <h3 className="text-lg font-bold text-[#1A3A6B] mb-3">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">{t('features.title')}</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Gjithçka që ju nevojitet për të gjetur tenderin e duhur</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, key, color }) => (
              <div key={key} className="card p-6 group hover:-translate-y-1 transition-all duration-300">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <h3 className="font-bold text-[#1A3A6B] mb-2">{t(`features.${key}_title`)}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{t(`features.${key}_desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">{t('pricing.title')}</h2>
        </div>
        <div className="max-w-sm mx-auto">
          <div className="card p-8 text-center border-2 border-[#F0A500] relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#F0A500] text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
              POPULAR
            </div>
            <div className="w-16 h-16 gradient-gold rounded-2xl flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#1A3A6B] mb-2">{t('pricing.plan_name')}</h3>
            <div className="flex items-end justify-center gap-1 my-6">
              <span className="text-5xl font-bold text-[#1A3A6B]">{t('pricing.price')}</span>
              <span className="text-gray-400 mb-2">{t('pricing.period')}</span>
            </div>
            <ul className="space-y-3 mb-8 text-left">
              {['feature1', 'feature2', 'feature3', 'feature4', 'feature5', 'feature6'].map((f) => (
                <li key={f} className="flex items-center space-x-3 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{t(`pricing.${f}`)}</span>
                </li>
              ))}
            </ul>
            <Link href="/register" id="pricing-cta-btn" className="btn-primary w-full block text-center">
              {t('pricing.cta')}
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">{t('testimonials.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t_item) => (
              <div key={t_item.name} className="card p-6 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex space-x-1 mb-4">
                  {Array.from({ length: t_item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F0A500] text-[#F0A500]" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">&quot;{t_item.text}&quot;</p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-[#1A3A6B] text-sm">{t_item.name}</div>
                  <div className="text-gray-400 text-xs">{t_item.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="gradient-navy rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #F0A500 0%, transparent 50%)' }}
            />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative">
              Gati të filloni? 🚀
            </h2>
            <p className="text-blue-200 mb-8 relative">
              Regjistrohu sot dhe gjej tenderin e parë brenda 5 minutave
            </p>
            <Link
              href="/register"
              className="inline-flex items-center space-x-2 bg-[#F0A500] hover:bg-[#C87800] text-white font-bold px-10 py-4 rounded-xl transition-all duration-200 shadow-xl hover:-translate-y-1 text-lg relative"
            >
              <span>Fillo Falas</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
