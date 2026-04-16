'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/contexts/I18nContext';
import { FileText, Mail, MapPin, ExternalLink } from 'lucide-react';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="gradient-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-6 group">
              <div className="relative w-12 h-12 overflow-hidden rounded-xl bg-white p-1 shadow-gold">
                <Image
                  src="/images/logo.png"
                  alt="FindYourTender Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-xl font-extrabold tracking-tight text-white line-height-1.2">FindYour<span className="text-[#F0A500]">Tender</span></span>
                <span className="text-xs font-bold text-blue-200 uppercase tracking-[3px]">Gjej. Krahaso. Fito.</span>
              </div>
            </Link>
            <p className="text-blue-200 text-sm mb-4 leading-relaxed max-w-sm">
              Platforma nr.1 e prokurimit publik në Kosovë. Inteligjencë biznesi për çdo tender.
            </p>
            <p className="text-blue-300 text-xs leading-relaxed max-w-sm opacity-60">
              Disclaimer: FindYourTender nuk është organ shtetëror. Ne jemi platformë informative që agregon të dhëna publike.
            </p>
            <div className="flex items-center space-x-2 mt-4 text-blue-200 text-sm">
              <MapPin className="w-4 h-4 text-[#F0A500]" />
              <span>{t('contact.address')}</span>
            </div>
            <div className="flex items-center space-x-2 mt-2 text-blue-200 text-sm">
              <Mail className="w-4 h-4 text-[#F0A500]" />
              <a href="mailto:info@findyourtender.com" className="hover:text-white transition-colors">
                info@findyourtender.com
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              {t('footer.links_title')}
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: t('nav.home') },
                { href: '/tenders', label: t('nav.tenders') },
                { href: '/pricing', label: t('nav.pricing') },
                { href: '/about', label: t('nav.about') },
                { href: '/contact', label: t('nav.contact') },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-200 hover:text-[#F0A500] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + Source */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              {t('footer.legal_title')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-blue-200 hover:text-[#F0A500] text-sm transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-blue-200 hover:text-[#F0A500] text-sm transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
            <div className="mt-6 p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="w-4 h-4 text-[#F0A500]" />
                <span className="text-xs font-semibold text-white">Burimi Zyrtar</span>
              </div>
              <a
                href="https://e-prokurimi.rks-gov.net"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-xs text-blue-200 hover:text-[#F0A500] transition-colors"
              >
                <span>e-prokurimi.rks-gov.net</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <hr className="border-white/10 mt-12 mb-8" />
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-blue-300">
          <p>{t('footer.rights')}</p>
          <p className="mt-2 md:mt-0">
            Powered by <span className="text-[#F0A500] font-semibold">FindYourTender</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
