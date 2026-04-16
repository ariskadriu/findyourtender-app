'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle, TrendingUp, Loader2 } from 'lucide-react';
import { Suspense } from 'react';

function PricingContent() {
  const { user } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const subscribed = searchParams?.get('subscribed') === 'true';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!user) {
      router.push('/register');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: user.uid }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Stripe checkout dështoi. Provoni sërish.');
      }
    } catch {
      setError('Ndodhi një gabim. Provoni sërish.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { key: 'feature1', icon: '📄' },
    { key: 'feature2', icon: '🔍' },
    { key: 'feature3', icon: '🔔' },
    { key: 'feature4', icon: '⭐' },
    { key: 'feature5', icon: '🌐' },
    { key: 'feature6', icon: '⚡' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {subscribed && (
            <div className="flex items-center space-x-3 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-2xl mb-8">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold">Pagesa u konfirmua!</p>
                <p className="text-sm text-green-600">Mirë se vini! Tani keni qasje të plotë në të gjithë tenderët.</p>
              </div>
            </div>
          )}

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#1A3A6B] mb-4">{t('pricing.title')}</h1>
            <p className="text-gray-500 max-w-md mx-auto">
              Qasje e plotë në të gjithë tenderët e Kosovës me vetëm €10 në muaj
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Pricing Card */}
            <div className="card p-8 border-2 border-[#F0A500] relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#F0A500] text-white text-xs font-bold px-4 py-2 rounded-bl-xl">
                PLAN MUJOR
              </div>
              <div className="w-14 h-14 gradient-gold rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-bold text-[#1A3A6B] mb-1">{t('pricing.plan_name')}</h2>
              <p className="text-gray-500 text-sm mb-6">Anulo kur doni</p>

              <div className="flex items-end gap-1 mb-8">
                <span className="text-5xl font-bold text-[#1A3A6B]">{t('pricing.price')}</span>
                <span className="text-gray-400 mb-2 text-lg">{t('pricing.period')}</span>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
                  {error}
                </div>
              )}

              <button
                id="checkout-btn"
                onClick={handleCheckout}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center space-x-2 text-lg disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Duke procesuar...</span>
                  </>
                ) : (
                  <span>{user ? t('pricing.cta') : 'Regjistrohu & Fillo'}</span>
                )}
              </button>

              {!user && (
                <p className="text-center text-xs text-gray-400 mt-3">
                  Do të krijohet llogaria automatikisht
                </p>
              )}

              <p className="text-center text-xs text-gray-400 mt-3">
                🔒 Pagesa e sigurt me Stripe · Anulo çdo kohë
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="font-bold text-[#1A3A6B] text-lg mb-4">Çfarë përfshihet:</h3>
              {features.map(({ key, icon }) => (
                <div key={key} className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-gray-100">
                  <span className="text-xl">{icon}</span>
                  <p className="text-gray-700 text-sm leading-relaxed">{t(`pricing.${key}`)}</p>
                </div>
              ))}

              <div className="mt-6 p-4 gradient-navy rounded-xl text-white text-sm">
                <p className="font-semibold mb-1">🏛️ Burimi Zyrtar</p>
                <p className="text-blue-200 text-xs">Të gjithë tenderët vijnë direkt nga{' '}
                  <a href="https://e-prokurimi.rks-gov.net" target="_blank" rel="noopener noreferrer"
                    className="text-[#F0A500] hover:underline">e-prokurimi.rks-gov.net</a>
                </p>
              </div>

              <div className="text-center text-sm text-gray-500 mt-4">
                Keni llogari?{' '}
                <Link href="/login" className="text-[#2D6BE4] font-semibold hover:underline">
                  Hyr këtu
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Duke u ngarkuar...</div>}>
      <PricingContent />
    </Suspense>
  );
}
