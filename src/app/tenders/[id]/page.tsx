'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { doc, getDoc, collection, query, where, limit, getDocs, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Tender } from '@/types';
import {
  ExternalLink, Bookmark, BookmarkCheck, Calendar, MapPin,
  Building2, Tag, Euro, Clock, FileText, Phone, ChevronRight,
  ArrowLeft, AlertCircle
} from 'lucide-react';
import { differenceInDays } from 'date-fns';

export default function TenderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, userData, refreshUserData } = useAuth();
  const { t } = useI18n();

  const [tender, setTender] = useState<Tender | null>(null);
  const [related, setRelated] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isSubscribed = userData?.subscriptionStatus === 'active';
  const isSaved = userData?.savedTenders?.includes(params?.id as string);

  const fetchTender = useCallback(async () => {
    try {
      const docSnap = await getDoc(doc(db, 'tenders', params?.id as string));
      if (docSnap.exists()) {
        const data = docSnap.data();
        const t_data: Tender = {
          id: docSnap.id,
          ...data,
          publishedDate: data.publishedDate?.toDate(),
          deadline: data.deadline?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as Tender;
        setTender(t_data);

        // Fetch related
        if (t_data.category) {
          const relatedQ = query(
            collection(db, 'tenders'),
            where('category', '==', t_data.category),
            where('status', '==', 'active'),
            limit(4)
          );
          const relatedSnap = await getDocs(relatedQ);
          setRelated(
            relatedSnap.docs
              .filter((d) => d.id !== docSnap.id)
              .map((d) => ({ id: d.id, ...d.data(), publishedDate: d.data().publishedDate?.toDate(), deadline: d.data().deadline?.toDate() } as Tender))
              .slice(0, 3)
          );
        }
      } else {
        // Demo tender
        setTender(getDemoTender(params?.id as string));
      }
    } catch (error) {
      console.error('Error fetching tender details:', error);
      setTender(getDemoTender(params?.id as string));
    } finally {
      setLoading(false);
    }
  }, [params?.id]);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (!isSubscribed && !loading) { router.push('/pricing'); return; }
    fetchTender();
  }, [params?.id, user, isSubscribed, loading, router, fetchTender]);

  const getDemoTender = (id: string): Tender => ({
    id,
    title: 'Furnizim me materiale ndërtimi për rrugën e re të Prishtinës — Faza II',
    institution: 'Komuna e Prishtinës',
    category: 'Ndërtim',
    region: 'Prishtinë',
    status: 'active',
    publishedDate: new Date(Date.now() - 5 * 86400000),
    deadline: new Date(Date.now() + 12 * 86400000),
    estimatedValue: 125000,
    currency: 'EUR',
    description: 'Ky tender ka për qëllim furnizimin me materiale ndërtimi për realizimin e fazës së dytë të rrugës së re qendrore të Prishtinës. Materiali duhet të jetë i certifikuar dhe të plotësojë standardet teknike të specifikuara në dokumentacionin teknik. Kompania fituese do të jetë përgjegjëse për dorëzimin në kohe dhe me cilësinë e kërkuar.',
    cpvCodes: ['44000000', '45000000', '44100000'],
    contactInfo: 'Komuna e Prishtinës, Sheshi Nëna Terezë, Tel: +383 38 200 1234, Email: prokurimi@rks-gov.net',
    sourceUrl: 'https://e-prokurimi.rks-gov.net',
    documents: [
      { name: 'Specifikimet Teknike.pdf', url: 'https://e-prokurimi.rks-gov.net/doc/specs.pdf' },
      { name: 'Formulari i Ofertës.docx', url: 'https://e-prokurimi.rks-gov.net/doc/form.docx' },
      { name: 'Kushtet Kontraktuese.pdf', url: 'https://e-prokurimi.rks-gov.net/doc/terms.pdf' },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      if (isSaved) {
        await updateDoc(userDocRef, { savedTenders: arrayRemove(params?.id) });
      } else {
        await updateDoc(userDocRef, { savedTenders: arrayUnion(params?.id) });
      }
      await refreshUserData();
    } catch (error) {
      console.error('Error saving tender:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <Navbar />
        <div className="pt-24 max-w-4xl mx-auto px-4 py-8">
          <div className="card p-8 space-y-4">
            <div className="skeleton h-8 w-3/4" />
            <div className="skeleton h-4 w-1/2" />
            <div className="skeleton h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!tender) return null;

  const daysLeft = tender.deadline ? differenceInDays(new Date(tender.deadline), new Date()) : null;
  const isUrgent = daysLeft !== null && daysLeft <= 7 && daysLeft >= 0;

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />
      <div className="pt-20 pb-16">
        {/* Back + breadcrumb */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button onClick={() => router.back()}
            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-[#1A3A6B] transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Kthehu te lista</span>
          </button>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header card */}
            <div className="card p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex flex-wrap gap-2">
                  <span className={`badge ${tender.status === 'active' ? 'badge-active' : tender.status === 'closed' ? 'badge-closed' : 'badge-upcoming'}`}>
                    {t(`tenders.status_${tender.status}`)}
                  </span>
                  {isUrgent && <span className="badge badge-urgent">{t('tenders.urgent')}</span>}
                  <span className="badge bg-[#1A3A6B]/10 text-[#1A3A6B]">{tender.category}</span>
                </div>
                <button
                  id="save-tender-btn"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-1 text-sm text-gray-500 hover:text-[#F0A500] transition-colors flex-shrink-0"
                >
                  {isSaved
                    ? <BookmarkCheck className="w-5 h-5 text-[#F0A500]" />
                    : <Bookmark className="w-5 h-5" />
                  }
                  <span>{isSaved ? t('tender_detail.saved') : t('tender_detail.save')}</span>
                </button>
              </div>

              <h1 className="text-2xl font-bold text-[#1A3A6B] leading-snug mb-6">{tender.title}</h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Building2, label: t('tender_detail.institution'), value: tender.institution, color: '#F0A500' },
                  { icon: MapPin, label: t('tender_detail.region'), value: tender.region, color: '#2D6BE4' },
                  { icon: Tag, label: t('tender_detail.category'), value: tender.category, color: '#10B981' },
                  {
                    icon: Euro,
                    label: t('tender_detail.estimated_value'),
                    value: tender.estimatedValue ? `€${tender.estimatedValue.toLocaleString()}` : 'N/A',
                    color: '#8B5CF6'
                  },
                  {
                    icon: Calendar,
                    label: t('tender_detail.published_date'),
                    value: tender.publishedDate ? new Date(tender.publishedDate).toLocaleDateString('sq-AL') : 'N/A',
                    color: '#1A3A6B'
                  },
                  {
                    icon: Clock,
                    label: t('tender_detail.deadline'),
                    value: tender.deadline ? new Date(tender.deadline).toLocaleDateString('sq-AL') : 'N/A',
                    color: isUrgent ? '#EF4444' : '#1A3A6B'
                  },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="flex items-start space-x-3">
                    <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color }} />
                    <div>
                      <div className="text-xs text-gray-400 font-medium">{label}</div>
                      <div className="text-sm font-semibold text-gray-800">{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {isUrgent && daysLeft !== null && (
                <div className="mt-4 flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">
                    ⚠️ Afati mbyllet pas <strong>{daysLeft} ditësh</strong> — veproni shpejt!
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="card p-8">
              <h2 className="font-bold text-[#1A3A6B] text-lg mb-4">{t('tender_detail.description')}</h2>
              <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">{tender.description}</p>
            </div>

            {/* CPV Codes */}
            {tender.cpvCodes?.length > 0 && (
              <div className="card p-6">
                <h2 className="font-bold text-[#1A3A6B] mb-3">{t('tender_detail.cpv_codes')}</h2>
                <div className="flex flex-wrap gap-2">
                  {tender.cpvCodes.map((code) => (
                    <span key={code} className="px-3 py-1 bg-[#1A3A6B]/10 text-[#1A3A6B] rounded-lg text-sm font-mono">
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact */}
            {tender.contactInfo && (
              <div className="card p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Phone className="w-4 h-4 text-[#F0A500]" />
                  <h2 className="font-bold text-[#1A3A6B]">{t('tender_detail.contact_info')}</h2>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{tender.contactInfo}</p>
              </div>
            )}

            {/* Documents */}
            {tender.documents?.length > 0 && (
              <div className="card p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="w-4 h-4 text-[#2D6BE4]" />
                  <h2 className="font-bold text-[#1A3A6B]">{t('tender_detail.documents')}</h2>
                </div>
                <div className="space-y-2">
                  {tender.documents.map((doc, i) => (
                    <a
                      key={i}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#2D6BE4]/30 hover:bg-blue-50 transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#2D6BE4]/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-[#2D6BE4]" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-[#2D6BE4]">{doc.name}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#2D6BE4]" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Official CTA — most prominent */}
            <div className="card p-6 border-2 border-[#F0A500] sticky top-24">
              <div className="text-center mb-4">
                <div className="text-3xl mb-2">🏛️</div>
                <h3 className="font-bold text-[#1A3A6B] text-sm">Tender Zyrtar Qeveritar</h3>
                <p className="text-xs text-gray-500 mt-1">Shkoni direkt te burimi zyrtar — nuk mund të aplikoni këtu</p>
              </div>
              <a
                id="official-tender-btn"
                href={tender.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 bg-[#F0A500] hover:bg-[#C87800] text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base"
              >
                <span>{t('tender_detail.official_cta')}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-xs text-gray-400 text-center mt-3">
                Do hapet: e-prokurimi.rks-gov.net
              </p>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="card p-6">
                <h3 className="font-bold text-[#1A3A6B] mb-4">{t('tender_detail.related')}</h3>
                <div className="space-y-3">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      href={`/tenders/${r.id}`}
                      className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 group transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-[#F0A500] mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-700 group-hover:text-[#1A3A6B] line-clamp-2">
                          {r.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{r.institution}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="p-4 bg-[#1A3A6B]/5 rounded-xl border border-[#1A3A6B]/10">
              <p className="text-xs text-gray-500 leading-relaxed">
                <strong>ℹ️ Shënim:</strong> FindYourTender është platformë drejtorie. Nuk trajtojmë aplikime.
                Për të aplikuar, shkoni te burimi zyrtar qeveritar.
              </p>
            </div>
          </div>
        </div>

        {/* Related section on mobile */}
        {related.length > 0 && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 lg:hidden">
            <h3 className="font-bold text-[#1A3A6B] mb-4">{t('tender_detail.related')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.slice(0, 2).map((r) => (
                <Link key={r.id} href={`/tenders/${r.id}`}
                  className="card p-4 hover:-translate-y-1 transition-transform">
                  <p className="text-sm font-medium text-[#1A3A6B] line-clamp-2">{r.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{r.institution}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
