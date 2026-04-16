'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

interface ContactFormProps {
  translations: Record<string, Record<string, string>>;
}

export default function ContactForm({ translations: t_raw }: ContactFormProps) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Helper for i18n
  const t = (key: string): string => {
    const parts = key.split('.');
    if (parts.length === 2) {
      return t_raw[parts[0]]?.[parts[1]] || key;
    }
    return key;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ name: '', email: '', message: '' });
      } else {
        setError('Mesazhi nuk u dërgua. Provoni sërish.');
      }
    } catch {
      setError('Gabim lidhjeje. Provoni sërish.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-[#1A3A6B] mb-2">{t('contact.success')}</h3>
        <p className="text-gray-500">Do t&apos;ju kontaktojmë brenda 24 orësh.</p>
        <button onClick={() => setSuccess(false)} className="btn-primary mt-6">
          Dërgo mesazh tjetër
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.name')}</label>
        <input
          id="contact-name"
          type="text"
          required
          className="input-field"
          placeholder="Emri juaj"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.email')}</label>
        <input
          id="contact-email"
          type="email"
          required
          className="input-field"
          placeholder="email@tuaj.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.message')}</label>
        <textarea
          id="contact-message"
          required
          rows={6}
          className="input-field resize-none"
          placeholder="Si mund t'ju ndihmojmë?"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>
      <button
        id="contact-submit"
        type="submit"
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-60"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>{t('contact.send')}</span>
          </>
        )}
      </button>
    </form>
  );
}
