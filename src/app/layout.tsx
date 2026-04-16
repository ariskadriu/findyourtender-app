import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { I18nProvider } from '@/contexts/I18nContext';
import { Toaster } from '@/components/ui/Toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FindYourTender — Platforma nr.1 për Prokurim Publik në Kosovë',
  description: 'Gjej, krahaso dhe shko te tenderët publikë të Kosovës. FindYourTender — bazë të dhënash e plotë e tenderëve qeveritarë.',
  keywords: 'tender, prokurimi publik, kosovë, e-prokurimi, tenderë, business',
  openGraph: {
    title: 'FindYourTender',
    description: 'Platforma nr.1 për prokurimin publik në Kosovë',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sq">
      <head />
      <body className={inter.className}>
        <I18nProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
