'use client';

import { Tender } from '@/types';
import { useI18n } from '@/contexts/I18nContext';
import Link from 'next/link';
import { Calendar, MapPin, Building2, Euro, Clock, ExternalLink } from 'lucide-react';
import { differenceInDays } from 'date-fns';

interface TenderCardProps {
  tender: Tender;
  blurred?: boolean;
}

export default function TenderCard({ tender, blurred = false }: TenderCardProps) {
  const { t } = useI18n();

  const daysLeft = tender.deadline ? differenceInDays(new Date(tender.deadline), new Date()) : null;
  const isUrgent = daysLeft !== null && daysLeft <= 7 && daysLeft >= 0;
  const isExpired = daysLeft !== null && daysLeft < 0;

  const statusConfig = {
    active: { label: t('tenders.status_active'), className: 'badge-active' },
    closed: { label: t('tenders.status_closed'), className: 'badge-closed' },
    upcoming: { label: t('tenders.status_upcoming'), className: 'badge-upcoming' },
  };
  const statusInfo = statusConfig[tender.status] || statusConfig.active;

  return (
    <div className={`card p-6 flex flex-col h-full group hover:-translate-y-1 transition-all duration-300 ${blurred ? 'relative overflow-hidden' : ''}`}>
      {blurred && (
        <div className="absolute inset-0 backdrop-blur-sm bg-white/60 z-10 rounded-2xl flex items-center justify-center">
          <div className="text-center p-4">
            <div className="text-3xl mb-2">🔒</div>
            <p className="text-sm text-gray-600 font-medium">Abonohu për të parë</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={statusInfo.className}>{statusInfo.label}</span>
            {isUrgent && (
              <span className="badge badge-urgent">{t('tenders.urgent')}</span>
            )}
            <span className="badge bg-[#1A3A6B]/10 text-[#1A3A6B] text-xs">{tender.category}</span>
          </div>
          <h3 className="font-semibold text-[#1A3A6B] text-sm leading-snug line-clamp-2 group-hover:text-[#2D6BE4] transition-colors">
            {tender.title}
          </h3>
        </div>
      </div>

      {/* Info grid */}
      <div className="space-y-2 flex-1">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Building2 className="w-3.5 h-3.5 text-[#F0A500] flex-shrink-0" />
          <span className="truncate">{tender.institution}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-3.5 h-3.5 text-[#2D6BE4] flex-shrink-0" />
          <span>{tender.region}</span>
        </div>
        {tender.estimatedValue && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Euro className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
            <span className="font-semibold text-gray-800">
              €{tender.estimatedValue.toLocaleString()}
            </span>
          </div>
        )}
        {tender.publishedDate && (
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{t('tenders.published')}: {new Date(tender.publishedDate).toLocaleDateString('sq-AL')}</span>
          </div>
        )}
      </div>

      {/* Deadline */}
      {tender.deadline && (
        <div className={`flex items-center justify-between mt-4 pt-4 border-t ${isUrgent ? 'border-red-100' : 'border-gray-100'}`}>
          <div className="flex items-center space-x-1.5">
            <Clock className={`w-3.5 h-3.5 ${isUrgent ? 'text-red-500' : 'text-gray-400'}`} />
            <span className={`text-xs font-medium ${isUrgent ? 'text-red-600' : isExpired ? 'text-gray-400' : 'text-gray-600'}`}>
              {isExpired
                ? 'Afati ka kaluar'
                : `${daysLeft} ${t('tenders.days_left')}`}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            {new Date(tender.deadline).toLocaleDateString('sq-AL')}
          </span>
        </div>
      )}

      {/* CTA Button */}
      <Link
        href={`/tenders/${tender.id}`}
        id={`tender-card-${tender.id}`}
        className="btn-secondary w-full text-center text-sm mt-4 !py-2 flex items-center justify-center space-x-1 group-hover:bg-[#F0A500] transition-colors"
      >
        <span>{t('tenders.view_details')}</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
