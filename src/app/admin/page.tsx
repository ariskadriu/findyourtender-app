'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { collection, getDocs, query, orderBy, limit, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Users, FileText, DollarSign, RefreshCw, Eye, EyeOff, Star } from 'lucide-react';
import { User, Tender } from '@/types';

export default function AdminPage() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ totalUsers: 0, activeSubscribers: 0, totalTenders: 0, mrr: 0 });
  const [users, setUsers] = useState<User[]>([]);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [, setLoading] = useState(true);
  const [scraperLoading, setScraperLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'tenders'>('users');

  useEffect(() => {
    if (!user || userData?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchAdminData();
  }, [user, userData, router]);

  const fetchAdminData = async () => {
    try {
      const [usersSnap, tendersSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(query(collection(db, 'tenders'), orderBy('createdAt', 'desc'), limit(50))),
      ]);

      const usersList = usersSnap.docs.map(d => ({ 
        ...d.data(), 
        id: d.id,
        createdAt: d.data().createdAt?.toDate()
      } as User));
      const tendersList = tendersSnap.docs.map(d => ({
        ...d.data(),
        id: d.id,
        publishedDate: d.data().publishedDate?.toDate(),
        deadline: d.data().deadline?.toDate(),
      } as Tender));

      const activeSubscribers = usersList.filter((u) => u.subscriptionStatus === 'active').length;

      setUsers(usersList);
      setTenders(tendersList);
      setStats({
        totalUsers: usersList.length,
        activeSubscribers,
        totalTenders: tendersList.length,
        mrr: activeSubscribers * 10,
      });
    } catch {
      console.error('Admin data error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHide = async (tenderId: string, hidden: boolean) => {
    await updateDoc(doc(db, 'tenders', tenderId), { hidden: !hidden });
    setTenders(prev => prev.map(t => t.id === tenderId ? { ...t, hidden: !hidden } : t));
  };

  const handleToggleFeatured = async (tenderId: string, featured: boolean) => {
    await updateDoc(doc(db, 'tenders', tenderId), { featured: !featured });
    setTenders(prev => prev.map(t => t.id === tenderId ? { ...t, featured: !featured } : t));
  };

  const handleTriggerScraper = async () => {
    setScraperLoading(true);
    try {
      const token = await user!.getIdToken();
      await fetch('/api/admin/scraper-trigger', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Scraper u aktivizua!');
    } catch {
      alert('Gabim duke aktivizuar scraper-in.');
    } finally {
      setScraperLoading(false);
    }
  };

  if (!user || userData?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="card p-8 max-w-md w-full text-center shadow-xl border-t-4 border-red-500">
          <div className="text-4xl mb-4">🔓</div>
          <h2 className="text-2xl font-bold text-[#1A3A6B] mb-2">Qasje e Kufizuar</h2>
          <p className="text-gray-600 mb-6">
            Kjo faqe është e rezervuar vetëm për administratorët. Nëse jeni pronari i faqes, ju lutem shtoni 
            <code className="bg-gray-100 px-1 rounded mx-1 text-red-600">role: "admin"</code> 
            në dokumentin tuaj në Firebase Console.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left text-xs font-mono space-y-2 border border-gray-100">
            <div className="text-gray-400 uppercase text-[10px] font-bold mb-1">Informacionet e Debug:</div>
            <div className="flex justify-between">
              <span className="text-gray-500">UID:</span>
              <span className="text-[#1A3A6B]">{user?.uid || 'Nuk u gjet'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email:</span>
              <span className="text-[#1A3A6B]">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Roli aktual:</span>
              <span className={userData?.role === 'admin' ? 'text-green-600' : 'text-red-600 font-bold'}>
                &quot;{userData?.role || 'null'}&quot;
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => router.push('/')}
              className="btn-primary w-full"
            >
              Kthehu në Fillim
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="text-xs text-gray-400 hover:text-[#1A3A6B] transition-colors"
            >
              Rifresko Faqen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-[#1A3A6B]">🔒 Admin Panel</h1>
          <button
            onClick={handleTriggerScraper}
            disabled={scraperLoading}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${scraperLoading ? 'animate-spin' : ''}`} />
            <span>Aktivizo Scraper</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: 'Përdorues Totale', value: stats.totalUsers, color: '#1A3A6B' },
            { icon: Users, label: 'Abonentë Aktiv', value: stats.activeSubscribers, color: '#10B981' },
            { icon: FileText, label: 'Tenderë Totale', value: stats.totalTenders, color: '#2D6BE4' },
            { icon: DollarSign, label: 'MRR', value: `€${stats.mrr}`, color: '#F0A500' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="card p-6">
              <Icon className="w-6 h-6 mb-2" style={{ color }} />
              <div className="text-2xl font-bold text-[#1A3A6B]">{value}</div>
              <div className="text-gray-500 text-sm">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'users' ? 'bg-[#1A3A6B] text-white' : 'bg-white text-gray-600'}`}>
            Përdoruesit
          </button>
          <button onClick={() => setActiveTab('tenders')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'tenders' ? 'bg-[#1A3A6B] text-white' : 'bg-white text-gray-600'}`}>
            Tenderët
          </button>
        </div>

        {/* Users table */}
        {activeTab === 'users' && (
          <div className="card overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-gray-50 text-left">
                <tr>
                  {['Emri', 'Email', 'Biznesi', 'Statusi', 'Krijuar'].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.slice(0, 20).map((u: User) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{u.fullName || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3 text-gray-600">{u.businessName || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${u.subscriptionStatus === 'active' ? 'badge-active' : 'badge-closed'}`}>
                        {u.subscriptionStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {u.createdAt ? u.createdAt.toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tenders table */}
        {activeTab === 'tenders' && (
          <div className="card overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-gray-50">
                <tr>
                  {['Titulli', 'Institucioni', 'Statusi', 'Kategoria', 'Veprime'].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tenders.map((t: Tender) => (
                  <tr key={t.id} className={`hover:bg-gray-50 ${t.hidden ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3 font-medium text-gray-800 max-w-xs">
                      <div className="line-clamp-1">{t.title}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{t.institution}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${t.status === 'active' ? 'badge-active' : 'badge-closed'}`}>{t.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{t.category}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleToggleHide(t.id, !!t.hidden)}
                          className={`p-1.5 rounded-lg transition-colors ${t.hidden ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-blue-600'}`}>
                          {t.hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => handleToggleFeatured(t.id, !!t.featured)}
                          className={`p-1.5 rounded-lg transition-colors ${t.featured ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-50 text-gray-400'}`}>
                          <Star className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
