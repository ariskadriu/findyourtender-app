'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import Navbar from '@/components/Navbar';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const { t } = useI18n();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    password: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      setSuccess(true);
      setTimeout(() => router.push('/pricing'), 2000);
    } catch (error: unknown) {
      const err = error as { code?: string };
      const code = err?.code || '';
      if (code === 'auth/email-already-in-use') {
        setError('Ky email është tashmë i regjistruar.');
      } else if (code === 'auth/weak-password') {
        setError('Fjalëkalimi duhet të ketë së paku 6 karaktere.');
      } else {
        setError('Ndodhi një gabim. Ju lutem provoni sërish.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4">
        <div className="card p-8 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-[#1A3A6B] mb-2">Llogaria u krijua!</h2>
          <p className="text-gray-500 text-sm">{t('auth.register_success')}</p>
          <p className="text-gray-400 text-xs mt-4">Po ju ridrejtojmë te çmimet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />
      <div className="flex min-h-screen pt-16">
        {/* Left: Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex items-center">
                <span className="text-3xl font-bold text-[#1A3A6B]">FindYour</span>
                <span className="text-3xl font-bold text-[#F0A500]">Tender</span>
              </Link>
              <h1 className="text-2xl font-bold text-[#1A3A6B] mt-4">{t('auth.register_title')}</h1>
              <p className="text-gray-500 text-sm mt-1">Gjej tenderat e Kosovës sot</p>
            </div>

            {error && (
              <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.full_name')} *</label>
                  <input
                    id="register-fullname"
                    type="text"
                    required
                    className="input-field"
                    placeholder="Artan Berisha"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.business_name')} *</label>
                  <input
                    id="register-business"
                    type="text"
                    required
                    className="input-field"
                    placeholder="Berisha Construction"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.email')} *</label>
                <input
                  id="register-email"
                  type="email"
                  required
                  className="input-field"
                  placeholder="artan@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.password')} *</label>
                <div className="relative">
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    className="input-field pr-12"
                    placeholder="min. 6 karaktere"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.phone')}</label>
                <input
                  id="register-phone"
                  type="tel"
                  className="input-field"
                  placeholder="+383 44 XXX XXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <button
                id="register-submit"
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>{t('auth.register_title')}</span>
                )}
              </button>
            </form>

            <p className="text-center text-gray-500 text-sm mt-6">
              {t('auth.have_account')}{' '}
              <Link href="/login" className="text-[#2D6BE4] hover:text-[#1A3A6B] font-semibold">
                {t('nav.login')}
              </Link>
            </p>

            <p className="text-center text-gray-400 text-xs mt-4">
              Duke u regjistruar, pranoni{' '}
              <Link href="/terms" className="underline hover:text-[#1A3A6B]">Kushtet e Shërbimit</Link>
              {' '}dhe{' '}
              <Link href="/privacy" className="underline hover:text-[#1A3A6B]">Politikën e Privatësisë</Link>
            </p>
          </div>
        </div>

        {/* Right: Visual */}
        <div className="hidden lg:flex flex-1 items-center justify-center gradient-navy p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #F0A500 0%, transparent 50%)' }}
          />
          <div className="relative text-center text-white max-w-sm">
            <div className="text-6xl mb-8">📑</div>
            <h2 className="text-2xl font-bold mb-4">
              1,200+ <span className="text-[#F0A500]">tenderë</span> në platformë
            </h2>
            <p className="text-blue-200 leading-relaxed">
              Të gjitha tenderët e prokurimit publik të Kosovës — në një vend, të përditësuara çdo 6 orë automatikisht.
            </p>
            <div className="mt-8 space-y-3">
              {['Ndërtim', 'IT dhe Teknologji', 'Shëndetësi', 'Transport', 'Energji'].map((cat) => (
                <div key={cat} className="flex items-center justify-between glass rounded-lg px-4 py-2">
                  <span className="text-sm">{cat}</span>
                  <span className="text-[#F0A500] text-xs font-semibold">Aktiv</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
