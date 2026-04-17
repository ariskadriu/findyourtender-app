'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TenderCard from '@/components/TenderCard';
import { Tender, CATEGORIES, REGIONS } from '@/types';
import { Search, SlidersHorizontal, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface TendersClientProps {
  initialTenders: Tender[];
  isSubscribed: boolean;
  translations: Record<string, Record<string, string>>;
}

export default function TendersClient({ 
  initialTenders, 
  isSubscribed, 
  translations: t_raw,
}: TendersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  // Helper for i18n since we passed raw translations
  const t = (key: string): string => {
    const parts = key.split('.');
    if (parts.length === 2) {
      return t_raw[parts[0]]?.[parts[1]] || key;
    }
    return key;
  };

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    // Reset to page 1 on filter change
    if (!updates.page) params.delete('page');
    router.push(`/tenders?${params.toString()}`);
  };

  const currentCategory = searchParams.get('category') || '';
  const currentRegion = searchParams.get('region') || '';
  const currentStatus = searchParams.get('status') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q: searchQuery });
  };

  return (
    <>
      {/* Header with Search & Filters */}
      <div className="gradient-navy py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-6">{t('tenders.title')}</h1>

          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('tenders.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-0 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-[#F0A500] text-gray-900"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all ${
                showFilters ? 'bg-[#F0A500] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              } shadow-md`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Filtrat</span>
            </button>
          </form>

          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-xl shadow-md grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">{t('tenders.filter_category')}</label>
                <select 
                  value={currentCategory} 
                  onChange={(e) => updateFilters({ category: e.target.value })} 
                  className="input-field text-sm !py-2"
                >
                  <option value="">{t('tenders.filter_all')}</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">{t('tenders.filter_region')}</label>
                <select 
                  value={currentRegion} 
                  onChange={(e) => updateFilters({ region: e.target.value })} 
                  className="input-field text-sm !py-2"
                >
                  <option value="">{t('tenders.filter_all')}</option>
                  {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">{t('tenders.filter_status')}</label>
                <select 
                  value={currentStatus} 
                  onChange={(e) => updateFilters({ status: e.target.value })} 
                  className="input-field text-sm !py-2"
                >
                  <option value="">{t('tenders.filter_all')}</option>
                  <option value="active">{t('tenders.status_active')}</option>
                  <option value="closed">{t('tenders.status_closed')}</option>
                  <option value="upcoming">{t('tenders.status_upcoming')}</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Rendit sipas</label>
                <select 
                  value={currentSort} 
                  onChange={(e) => updateFilters({ sort: e.target.value })} 
                  className="input-field text-sm !py-2"
                >
                  <option value="newest">{t('tenders.sort_newest')}</option>
                  <option value="deadline">{t('tenders.sort_deadline')}</option>
                  <option value="value">{t('tenders.sort_value')}</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {initialTenders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-[#1A3A6B] mb-2">{t('tenders.no_tenders')}</h3>
            <p className="text-gray-500">Provoni të ndryshoni filtrat ose kërkimin</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialTenders.map((tender, i) => {
                const isFreePreview = i < 3;
                return (
                  <TenderCard
                    key={tender.id}
                    tender={tender}
                    blurred={!isSubscribed && !isFreePreview}
                    isFreePreview={!isSubscribed && isFreePreview}
                  />
                );
              })}
            </div>

            {/* Pagination UI */}
            {isSubscribed && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button
                  onClick={() => updateFilters({ page: (currentPage - 1).toString() })}
                  disabled={currentPage === 1}
                  className="flex items-center space-x-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Para</span>
                </button>
                <span className="text-sm text-gray-500">Faqja {currentPage}</span>
                <button
                  onClick={() => updateFilters({ page: (currentPage + 1).toString() })}
                  disabled={initialTenders.length < 20}
                  className="flex items-center space-x-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>Tjetër</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Paywall Overlay */}
        {!isSubscribed && (
          <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#F5F7FA] via-[#F5F7FA]/95 to-transparent flex items-end justify-center pb-8">
            <div className="card p-8 max-w-md mx-4 text-center border-2 border-[#F0A500] shadow-2xl">
              <div className="w-14 h-14 gradient-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1A3A6B] mb-2">
                {!isSubscribed ? 'Abonimi kërkohet' : t('tenders.paywall_title')}
              </h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {!isSubscribed 
                  ? 'Ju jeni të regjistruar, por kërkohet një abonim aktiv për të parë detajet e plota të tenderëve. Abonimi kushton vetëm €10/muaj.' 
                  : t('tenders.paywall_desc')}
              </p>
              <Link href="/pricing" id="paywall-cta" className="btn-primary w-full block text-center text-lg shadow-gold">
                {t('tenders.paywall_cta')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
