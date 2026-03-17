import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';

const ContentAdmin: React.FC = () => {
  const { settings, updateSettings } = useAdmin();
  const [saved, setSaved] = useState('');

  const showSaved = (msg: string) => { setSaved(msg); setTimeout(() => setSaved(''), 2500); };

  const Field: React.FC<{ label: string; desc?: string; children: React.ReactNode }> = ({ label, desc, children }) => (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-700">{label}</label>
      {desc && <p className="text-xs text-gray-400">{desc}</p>}
      {children}
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Content Editor</h1>
        <p className="text-gray-500 text-sm">Edit website text content — hero, about, story, and footer sections.</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#059669' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          {saved}
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.12)' }}>
            <svg className="w-4 h-4" style={{ color: '#C9A84C' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          </div>
          <h2 className="font-bold text-gray-800">Hero Section</h2>
        </div>
        <Field label="Hero Main Title" desc="Appears on the homepage banner">
          <input value={settings.heroTitle}
            onChange={e => updateSettings({ heroTitle: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400"
            placeholder="Dress Your Windows in Luxury" />
        </Field>
        <div className="pt-2">
          <button onClick={() => showSaved('Hero content saved!')}
            className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #8B6914)' }}>
            Save Hero Content
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)' }}>
            <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="font-bold text-gray-800">About Section</h2>
        </div>
        <Field label="About Intro Text" desc="Short brand description shown in the about snippet on homepage">
          <textarea value={settings.aboutText}
            onChange={e => updateSettings({ aboutText: e.target.value })}
            rows={3} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400 resize-none"
            placeholder="We are Alyans Perde — a premium curtain brand..." />
        </Field>
        <div className="pt-2">
          <button onClick={() => showSaved('About content saved!')}
            className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #8B6914)' }}>
            Save About Content
          </button>
        </div>
      </div>

      {/* Our Story */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)' }}>
            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <h2 className="font-bold text-gray-800">Our Story</h2>
        </div>
        <Field label="Our Story Text" desc="The brand story paragraph shown on the About page">
          <textarea value={settings.ourStoryText}
            onChange={e => updateSettings({ ourStoryText: e.target.value })}
            rows={4} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400 resize-none"
            placeholder="Founded by Ariful Islam, Alyans Perde was born from a passion for beautiful interiors..." />
        </Field>
        <div className="pt-2">
          <button onClick={() => showSaved('Story content saved!')}
            className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #8B6914)' }}>
            Save Story Content
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)' }}>
            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
          </div>
          <h2 className="font-bold text-gray-800">Footer Text</h2>
        </div>
        <Field label="Footer Tagline" desc="Short description shown in footer below logo">
          <textarea value={settings.footerText}
            onChange={e => updateSettings({ footerText: e.target.value })}
            rows={2} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400 resize-none"
            placeholder="Crafting premium curtains for elegant homes since 2009." />
        </Field>
        <div className="pt-2">
          <button onClick={() => showSaved('Footer content saved!')}
            className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #8B6914)' }}>
            Save Footer Content
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentAdmin;
