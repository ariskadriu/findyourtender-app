'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { doc, getDoc, updateDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Tender } from '@/types';
import { CheckCircle, XCircle, Clock, Settings, Bell, Bookmark, CreditCard, X } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { Suspense } from 'react';

type Tab = 'subscription' | 'saved' | 'notifications' | 'settings';

function DashboardContent() {
  const { user, userData, logout, refreshUserData } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<Tab>('subscription');
  const [savedTenders, setSavedTenders] = useState<Tender[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [settingsData, setSettingsData] = useState({ fullName: '', email: '' });
  const [notifCategories, setNotifCategories] = useState<string[]>([]);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  const subStatus = userData?.subscriptionStatus || 'inactive';

  const subscribed = searchParams?.get('subscribed') === 'true';

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (userData) {
      setSettingsData({ fullName: userData.fullName || '', email: userData.email || '' });
      setNotifCategories(userData.notificationCategories || []);
    }
  }, [user, userData]);

  useEffect(() => {
    if (activeTab === 'saved' && user && userData?.savedTenders?.length) {
      fetchSavedTenders();
    }
  }, [activeTab, user, userData]);

  const fetchSavedTenders = async () => {
    if (!userData?.savedTenders?.length) return;
    setLoadingSaved(true);
    try {
      const results: Tender[] = [];
      for (const id of userData.savedTenders.slice(0, 10)) {
        const snap = await getDoc(doc(db, 'tenders', id));
        if (snap.exists()) {
          results.push({ id: snap.id, ...snap.data() } as Tender);
        }
      }
      setSavedTenders(results);
    } catch (err) {
      console.error('Error fetching saved tenders:', err);
    } finally {
      setLoadingSaved(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user || !userData?.stripeSubscriptionId) return;
    if (!confirm('Jeni i sigurt që dëshironi të anuloni abonimin?')) return;
    setCancelLoading(true);
    try {
      const token = await user.getIdToken();
      await fetch('/api/stripe/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ subscriptionId: userData.stripeSubscriptionId }),
      });
      await refreshUserData();
    } catch (err) {
      console.error('Cancel subscription error:', err);
    } finally {
      setCancelLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    setSavingSettings(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        fullName: settingsData.fullName,
        notificationCategories: notifCategories,
      });
      await refreshUserData();
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch (err) {
      console.error('Settings save error:', err);
    } finally {
      setSavingSettings(false);
    }
  };

  const CATEGORIES = ['Ndërtim', 'IT dhe Teknologji', 'Shëndetësi', 'Arsim', 'Transport', 'Energji'];

  const tabs: { id: Tab; icon: any; label: string }[] = [
    { id: 'subscription', icon: CreditCard, label: t('dashboard.subscription') },
    { id: 'saved', icon: Bookmark, label: t('dashboard.saved_tenders') },
    { id: 'notifications', icon: Bell, label: t('dashboard.notifications') },
    { id: 'settings', icon: Settings, label: t('dashboard.settings') },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {subscribed && (
            <div className="flex items-center space-x-3 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-2xl mb-6">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="font-semibold">Mirë se vini! Abonimi juaj është aktiv. 🎉</p>
            </div>
          )}

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#1A3A6B]">{t('dashboard.title')}</h1>
              <p className="text-gray-500 text-sm mt-1">
                Mirë se vini, <strong>{userData?.fullName || user?.email}</strong>
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar tabs - horizontal scroll on mobile, vertical on desktop */}
            <div className="lg:col-span-1">
              <div className="card p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible">
                {tabs.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                      activeTab === id
                        ? 'bg-[#1A3A6B] text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main content */}
            <div className="lg:col-span-3">
              {/* Subscription tab */}
              {activeTab === 'subscription' && (
                <div className="card p-6 space-y-6">
                  <h2 className="font-bold text-[#1A3A6B] text-lg">{t('dashboard.subscription')}</h2>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        subStatus === 'active' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {subStatus === 'active'
                          ? <CheckCircle className="w-5 h-5 text-green-600" />
                          : <XCircle className="w-5 h-5 text-red-500" />}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{t('dashboard.subscription')}</div>
                        <div className={`text-sm ${subStatus === 'active' ? 'text-green-600' : 'text-red-500'}`}>
                          {subStatus === 'active' ? t('dashboard.subscription_active') :
                           subStatus === 'cancelled' ? t('dashboard.subscription_cancelled') :
                           t('dashboard.subscription_inactive')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#1A3A6B]">€10/muaj</div>
                      {userData?.subscriptionEndDate && (
                        <div className="text-xs text-gray-400 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {t('dashboard.renews')}: {new Date(userData.subscriptionEndDate).toLocaleDateString('sq-AL')}
                        </div>
                      )}
                    </div>
                  </div>

                  {subStatus === 'active' ? (
                    <>
                      <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                        <p className="text-green-800 text-sm font-medium">✅ Keni qasje të plotë në të gjithë tenderët</p>
                      </div>
                      <button
                        onClick={handleCancelSubscription}
                        disabled={cancelLoading}
                        className="flex items-center space-x-2 text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        <X className="w-4 h-4" />
                        <span>{cancelLoading ? 'Duke anuluar...' : t('dashboard.cancel_subscription')}</span>
                      </button>
                    </>
                  ) : (
                    <Link href="/pricing" className="btn-primary block text-center">
                      Aktivizo Abonimin — €10/muaj
                    </Link>
                  )}
                </div>
              )}

              {/* Saved tenders tab */}
              {activeTab === 'saved' && (
                <div className="card p-6">
                  <h2 className="font-bold text-[#1A3A6B] text-lg mb-4">{t('dashboard.saved_tenders')}</h2>
                  {loadingSaved ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => <div key={i} className="skeleton h-16 w-full" />)}
                    </div>
                  ) : savedTenders.length === 0 ? (
                    <div className="text-center py-12">
                      <Bookmark className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                      <p className="text-gray-500">{t('dashboard.no_saved')}</p>
                      <Link href="/tenders" className="btn-primary mt-4 inline-block">
                        Shiko Tenderët
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {savedTenders.map((tender) => (
                        <Link key={tender.id} href={`/tenders/${tender.id}`}
                          className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[#2D6BE4]/30 hover:bg-blue-50 transition-all group">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-800 text-sm line-clamp-1 group-hover:text-[#1A3A6B]">{tender.title}</p>
                            <p className="text-xs text-gray-400 mt-1">{tender.institution} · {tender.region}</p>
                          </div>
                          <span className={`ml-3 badge ${tender.status === 'active' ? 'badge-active' : 'badge-closed'} flex-shrink-0`}>
                            {t(`tenders.status_${tender.status}`)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Notifications tab */}
              {activeTab === 'notifications' && (
                <div className="card p-6">
                  <h2 className="font-bold text-[#1A3A6B] text-lg mb-2">{t('dashboard.notifications')}</h2>
                  <p className="text-sm text-gray-500 mb-6">{t('dashboard.categories_alert')}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setNotifCategories(prev =>
                            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
                          );
                        }}
                        className={`px-3 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                          notifCategories.includes(cat)
                            ? 'border-[#1A3A6B] bg-[#1A3A6B] text-white'
                            : 'border-gray-200 text-gray-600 hover:border-[#1A3A6B]/40'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleSaveSettings}
                    disabled={savingSettings}
                    className="btn-primary"
                  >
                    {savingSettings ? 'Duke ruajtur...' : 'Ruaj Preferencat'}
                  </button>
                  {settingsSuccess && (
                    <p className="text-green-600 text-sm mt-2">✅ Preferencat u ruajtën!</p>
                  )}
                </div>
              )}

              {/* Settings tab */}
              {activeTab === 'settings' && (
                <div className="card p-6 space-y-4">
                  <h2 className="font-bold text-[#1A3A6B] text-lg">{t('dashboard.settings')}</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('dashboard.save_name')}</label>
                    <input
                      type="text"
                      className="input-field"
                      value={settingsData.fullName}
                      onChange={(e) => setSettingsData({ ...settingsData, fullName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('dashboard.save_email')}</label>
                    <input
                      type="email"
                      className="input-field bg-gray-50 cursor-not-allowed"
                      value={settingsData.email}
                      disabled
                    />
                    <p className="text-xs text-gray-400 mt-1">Email-i nuk mund të ndryshohet.</p>
                  </div>
                  <button
                    onClick={handleSaveSettings}
                    disabled={savingSettings}
                    className="btn-primary"
                  >
                    {savingSettings ? 'Duke ruajtur...' : t('dashboard.update')}
                  </button>
                  {settingsSuccess && <p className="text-green-600 text-sm">✅ Ndryshimet u ruajtën!</p>}

                  <hr className="border-gray-100" />
                  <button
                    onClick={() => { logout(); router.push('/'); }}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Duke u ngarkuar...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
