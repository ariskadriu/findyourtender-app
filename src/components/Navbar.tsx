'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { Language } from '@/types';
import Image from 'next/image';
import { Menu, X, Globe, ChevronDown, LogOut, LayoutDashboard, FileText } from 'lucide-react';

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'sq', label: 'Shqip', flag: '🇽🇰' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'sr', label: 'Srpski', flag: '🇷🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

export default function Navbar() {
  const { user, userData, logout } = useAuth();
  const { locale, setLocale, t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/tenders', label: t('nav.tenders') },
    { href: '/pricing', label: t('nav.pricing') },
    { href: '/about', label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const currentLang = LANGUAGES.find(l => l.code === locale);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-lg bg-white p-0.5 shadow-sm group-hover:shadow-md transition-all">
              <Image
                src="/images/logo.png"
                alt="FindYourTender Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-lg font-extrabold tracking-tight text-[#1A3A6B]">FindYour<span className="text-[#F0A500]">Tender</span></span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px]">Gjej. Krahaso. Fito.</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  pathname === link.href
                    ? 'bg-[#1A3A6B]/10 text-[#1A3A6B]'
                    : 'text-gray-600 hover:text-[#1A3A6B] hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: Lang + Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => { setLangOpen(!langOpen); setUserOpen(false); }}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-[#1A3A6B] hover:bg-gray-50 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{currentLang?.flag} {currentLang?.label}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setLocale(lang.code); setLangOpen(false); }}
                      className={`w-full flex items-center space-x-2 px-4 py-2 text-sm transition-colors ${
                        locale === lang.code
                          ? 'bg-[#1A3A6B]/10 text-[#1A3A6B] font-semibold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => { setUserOpen(!userOpen); setLangOpen(false); }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-[#1A3A6B]/5 hover:bg-[#1A3A6B]/10 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1A3A6B] to-[#2D6BE4] flex items-center justify-center text-white text-sm font-bold">
                    {userData?.fullName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium text-[#1A3A6B] max-w-[100px] truncate">
                    {userData?.fullName || user.email}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${userOpen ? 'rotate-180' : ''}`} />
                </button>
                {userOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <Link href="/dashboard" onClick={() => setUserOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>{t('nav.dashboard')}</span>
                    </Link>
                    {userData?.role === 'admin' && (
                      <Link href="/admin" onClick={() => setUserOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50">
                        <Shield className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <Link href="/tenders" onClick={() => setUserOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <FileText className="w-4 h-4" />
                      <span>{t('nav.tenders')}</span>
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <LogOut className="w-4 h-4" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="btn-outline text-sm !px-4 !py-2">
                  {t('nav.login')}
                </Link>
                <Link href="/register" className="btn-primary text-sm !px-4 !py-2">
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                  pathname === link.href
                    ? 'bg-[#1A3A6B]/10 text-[#1A3A6B]'
                    : 'text-gray-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-gray-100 my-2" />
            {/* Lang switcher mobile */}
            <div className="flex flex-wrap gap-2 py-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { setLocale(lang.code); setMobileOpen(false); }}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    locale === lang.code
                      ? 'bg-[#1A3A6B] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {lang.flag} {lang.label}
                </button>
              ))}
            </div>
            <hr className="border-gray-100 my-2" />
            {user ? (
              <div className="space-y-2">
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 rounded-lg text-sm text-[#1A3A6B] bg-gray-50">
                  {t('nav.dashboard')}
                </Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="w-full text-left px-4 py-2 rounded-lg text-sm text-red-600 bg-red-50">
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/login" onClick={() => setMobileOpen(false)}
                  className="flex-1 btn-outline text-sm text-center !px-3 !py-2">
                  {t('nav.login')}
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}
                  className="flex-1 btn-primary text-sm text-center !px-3 !py-2">
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay to close menus */}
      {(langOpen || userOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setLangOpen(false); setUserOpen(false); }} />
      )}
    </nav>
  );
}
