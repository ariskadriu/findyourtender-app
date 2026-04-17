'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { collection, getDocs, query, orderBy, limit, updateDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Users, FileText, DollarSign, RefreshCw, Eye, EyeOff, Star } from 'lucide-react';
import { User, Tender } from '@/types';

export default function AdminPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ totalUsers: 0, activeSubscribers: 0, totalTenders: 0, mrr: 0 });
  const [users, setUsers] = useState<User[]>([]);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [scraperLoading, setScraperLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'tenders' | 'add'>('users');
  const [newTender, setNewTender] = useState<Partial<Tender>>({
    title: '',
    institution: '',
    category: 'Ndërtim',
    region: 'Prishtinë',
    status: 'active',
    publishedDate: new Date(),
    deadline: new Date(),
    estimatedValue: 0,
    currency: 'EUR',
    description: '',
    sourceUrl: '',
    cpvCodes: [],
    documents: [],
  });

  useEffect(() => {
    if (user && userData?.role === 'admin') {
      fetchAdminData();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, userData, authLoading]);

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

  const handleAddTender = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTender.title || !newTender.institution || !newTender.sourceUrl) {
      alert('Ju lutem plotësoni fushat kryesore (Titulli, Institucioni, Linku).');
      return;
    }

    try {
      setScraperLoading(true);
      await addDoc(collection(db, 'tenders'), {
        ...newTender,
        publishedDate: serverTimestamp(),
        deadline: new Date(newTender.deadline || new Date()),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      alert('Tenderi u shtua me sukses!');
      setActiveTab('tenders');
      fetchAdminData();
      // Reset form
      setNewTender({
        title: '',
        institution: '',
        category: 'Ndërtim',
        region: 'Prishtinë',
        status: 'active',
        publishedDate: new Date(),
        deadline: new Date(),
        estimatedValue: 0,
        currency: 'EUR',
        description: '',
        sourceUrl: '',
        cpvCodes: [],
        documents: [],
      });
    } catch {
      alert('Gabim gjatë shtimit të tenderit.');
    } finally {
      setScraperLoading(false);
    }
  };

  if (authLoading || (loading && user)) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#1A3A6B] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[#1A3A6B] font-medium">Duke kontrolluar autorizimin...</p>
        </div>
      </div>
    );
  }

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
          <div>
            <h1 className="text-2xl font-bold text-[#1A3A6B]">🔒 Admin Panel</h1>
            <p className="text-gray-500 text-sm">Mirësevini përsëri në qendrën e kontrollit.</p>
          </div>
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
            { icon: Users, label: 'Përdorues', value: stats.totalUsers, color: '#1A3A6B' },
            { icon: Star, label: 'Abonentë', value: stats.activeSubscribers, color: '#10B981' },
            { icon: FileText, label: 'Tenderë', value: stats.totalTenders, color: '#2D6BE4' },
            { icon: DollarSign, label: 'MRR', value: `€${stats.mrr}`, color: '#F0A500' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="card p-6 border-b-2 border-transparent hover:border-b-[#1A3A6B] transition-all">
              <Icon className="w-6 h-6 mb-2" style={{ color }} />
              <div className="text-2xl font-bold text-[#1A3A6B]">{value}</div>
              <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-gray-100/50 p-1 rounded-xl w-fit">
          <button onClick={() => setActiveTab('users')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-white text-[#1A3A6B] shadow-sm' : 'text-gray-500 hover:text-[#1A3A6B]'}`}>
            Përdoruesit
          </button>
          <button onClick={() => setActiveTab('tenders')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'tenders' ? 'bg-white text-[#1A3A6B] shadow-sm' : 'text-gray-500 hover:text-[#1A3A6B]'}`}>
            Tenderët
          </button>
          <button onClick={() => setActiveTab('add')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'add' ? 'bg-[#F0A500] text-white shadow-md' : 'text-gray-500 hover:text-[#F0A500]'}`}>
            + Shto Tender
          </button>
        </div>

        {/* Add Tender Form */}
        {activeTab === 'add' && (
          <div className="card p-8 animate-fade-in">
            <h2 className="text-xl font-bold text-[#1A3A6B] mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-[#F0A500] rounded-full mr-3" />
              Shto një Tender të Ri
            </h2>
            <form onSubmit={handleAddTender} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Titulli i Tenderit *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1A3A6B] focus:ring-1 focus:ring-[#1A3A6B] outline-none transition-all"
                    placeholder="Psh: Ndërtimi i shkollës në Prizren"
                    value={newTender.title}
                    onChange={(e) => setNewTender({ ...newTender, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Autoriteti Kontraktues (Institucioni) *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1A3A6B] focus:ring-1 focus:ring-[#1A3A6B] outline-none transition-all"
                    placeholder="Psh: Komuna e Prishtinës"
                    value={newTender.institution}
                    onChange={(e) => setNewTender({ ...newTender, institution: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Kategoria</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1A3A6B] outline-none"
                    value={newTender.category}
                    onChange={(e) => setNewTender({ ...newTender, category: e.target.value })}
                  >
                    {['Ndërtim', 'IT dhe Teknologji', 'Shëndetësi', 'Arsim', 'Transport', 'Energji', 'Bujqësi', 'Shërbime Konsulence', 'Furnizime', 'Punë Publike', 'Tjetër'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Rajoni</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1A3A6B] outline-none"
                    value={newTender.region}
                    onChange={(e) => setNewTender({ ...newTender, region: e.target.value })}
                  >
                    {['Prishtinë', 'Prizren', 'Pejë', 'Mitrovicë', 'Gjilan', 'Ferizaj', 'Gjakovë', 'Tjetër'].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Linku Eksakt i Tenderit *</label>
                  <input
                    type="url"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1A3A6B] outline-none bg-blue-50/30"
                    placeholder="https://e-prokurimi.rks-gov.net/..."
                    value={newTender.sourceUrl}
                    onChange={(e) => setNewTender({ ...newTender, sourceUrl: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Vlera e Parashikuar (€)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1A3A6B] outline-none"
                    value={newTender.estimatedValue}
                    onChange={(e) => setNewTender({ ...newTender, estimatedValue: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Afati i fundit për aplikim</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1A3A6B] outline-none"
                    onChange={(e) => setNewTender({ ...newTender, deadline: new Date(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Statusi</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1A3A6B] outline-none"
                    value={newTender.status}
                    onChange={(e) => setNewTender({ ...newTender, status: e.target.value as any })}
                  >
                    <option value="active">Aktiv</option>
                    <option value="upcoming">Së shpejti</option>
                    <option value="closed">I mbyllur</option>
                    <option value="draft">Draft (i fshehur)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Përshkrimi i Shkurtër</label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1A3A6B] outline-none min-h-[100px]"
                  placeholder="Shënoni detaje shtesë nëse ka..."
                  value={newTender.description}
                  onChange={(e) => setNewTender({ ...newTender, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={scraperLoading}
                  className="bg-[#F0A500] hover:bg-[#C87800] text-white font-bold px-12 py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  {scraperLoading ? 'Duke ruajtur...' : 'Ruaj Tenderin'}
                </button>
              </div>
            </form>
          </div>
        )}

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
                      <span className={`badge ${
                        t.status === 'active' ? 'badge-active' : 
                        t.status === 'draft' ? 'bg-orange-100 text-orange-600 border-orange-200' : 
                        'badge-closed'
                      }`}>
                        {t.status === 'draft' ? 'DRAFT' : t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{t.category}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {t.status === 'draft' && (
                          <button 
                            onClick={async () => {
                              await updateDoc(doc(db, 'tenders', t.id), { status: 'active', updatedAt: serverTimestamp() });
                              fetchAdminData();
                            }}
                            className="px-3 py-1 bg-green-600 text-white text-[10px] font-bold rounded-lg hover:bg-green-700 transition-colors uppercase"
                          >
                            Aprovo
                          </button>
                        )}
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
