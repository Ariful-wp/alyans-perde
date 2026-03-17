import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';

const ChatbotAdmin: React.FC = () => {
  const { settings, updateSettings } = useAdmin();
  const [saved, setSaved] = useState('');
  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editQ, setEditQ] = useState('');
  const [editA, setEditA] = useState('');

  const showSaved = (msg: string) => { setSaved(msg); setTimeout(() => setSaved(''), 2500); };

  const addFaq = () => {
    if (!newQ.trim() || !newA.trim()) return;
    updateSettings({ chatbotFaq: [...settings.chatbotFaq, { question: newQ.trim(), answer: newA.trim() }] });
    setNewQ(''); setNewA('');
    showSaved('FAQ entry added!');
  };

  const removeFaq = (idx: number) => {
    updateSettings({ chatbotFaq: settings.chatbotFaq.filter((_, i) => i !== idx) });
    showSaved('FAQ entry removed!');
  };

  const openEdit = (idx: number) => {
    setEditIdx(idx); setEditQ(settings.chatbotFaq[idx].question); setEditA(settings.chatbotFaq[idx].answer);
  };

  const saveEdit = () => {
    const updated = settings.chatbotFaq.map((f, i) => i === editIdx ? { question: editQ, answer: editA } : f);
    updateSettings({ chatbotFaq: updated });
    setEditIdx(null);
    showSaved('FAQ entry updated!');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Chatbot Settings</h1>
        <p className="text-gray-500 text-sm">Configure the Alyans AI chatbot — toggle, welcome message, and FAQ responses.</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#059669' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          {saved}
        </div>
      )}

      {/* Toggle */}
      <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-800">Chatbot Status</h2>
            <p className="text-sm text-gray-500 mt-1">Enable or disable the floating chatbot widget on all pages.</p>
          </div>
          <button
            onClick={() => { updateSettings({ chatbotEnabled: !settings.chatbotEnabled }); showSaved(`Chatbot ${!settings.chatbotEnabled ? 'enabled' : 'disabled'}!`); }}
            className="relative inline-flex h-7 w-13 items-center rounded-full transition-colors duration-300 focus:outline-none"
            style={{ width: '52px', background: settings.chatbotEnabled ? 'linear-gradient(135deg, #C9A84C, #8B6914)' : '#e5e7eb' }}>
            <span className={`inline-block w-5 h-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${settings.chatbotEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${settings.chatbotEnabled ? 'bg-green-400' : 'bg-gray-300'}`} />
          <span className="text-sm font-medium" style={{ color: settings.chatbotEnabled ? '#10B981' : '#9CA3AF' }}>
            {settings.chatbotEnabled ? 'Chatbot is Active' : 'Chatbot is Disabled'}
          </span>
        </div>
      </div>

      {/* Welcome message */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
        <h2 className="font-bold text-gray-800">Welcome Message</h2>
        <p className="text-sm text-gray-500">This is the first message visitors see when they open the chatbot.</p>
        {/* Preview */}
        <div className="flex gap-3 p-4 rounded-xl" style={{ background: '#f8f7f5' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #8B6914)' }}>A</div>
          <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm max-w-sm"
            style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(139,105,20,0.08))', color: '#4B3A1A' }}>
            {settings.chatbotWelcome}
          </div>
        </div>
        <textarea value={settings.chatbotWelcome}
          onChange={e => updateSettings({ chatbotWelcome: e.target.value })}
          rows={3} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400 resize-none"
          placeholder="Hi! Need help choosing the perfect curtain? Ask me anything!" />
        <button onClick={() => showSaved('Welcome message saved!')}
          className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #C9A84C, #8B6914)' }}>
          Save Message
        </button>
      </div>

      {/* FAQ entries */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-800">FAQ Responses</h2>
            <p className="text-sm text-gray-500">{settings.chatbotFaq.length} responses configured</p>
          </div>
        </div>

        <div className="space-y-3">
          {settings.chatbotFaq.map((faq, idx) => (
            <div key={idx}>
              {editIdx === idx ? (
                <div className="p-4 rounded-xl space-y-3" style={{ border: '2px solid rgba(201,168,76,0.4)', background: 'rgba(201,168,76,0.04)' }}>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Question</label>
                    <input value={editQ} onChange={e => setEditQ(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Answer</label>
                    <textarea value={editA} onChange={e => setEditA(e.target.value)}
                      rows={2} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400 resize-none" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditIdx(null)} className="px-4 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50">Cancel</button>
                    <button onClick={saveEdit} className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-90" style={{ background: 'linear-gradient(135deg, #C9A84C, #8B6914)' }}>Save</button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-gray-50 flex items-start gap-3" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm">Q: {faq.question}</p>
                    <p className="text-xs text-gray-500 mt-1">A: {faq.answer}</p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => openEdit(idx)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:bg-yellow-50 hover:text-yellow-600">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => removeFaq(idx)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add FAQ */}
        <div className="p-4 rounded-xl space-y-3" style={{ border: '2px dashed rgba(201,168,76,0.3)', background: 'rgba(201,168,76,0.02)' }}>
          <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Add New FAQ Entry</p>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Question</label>
            <input value={newQ} onChange={e => setNewQ(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400"
              placeholder="e.g. Do you offer free shipping?" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Answer</label>
            <textarea value={newA} onChange={e => setNewA(e.target.value)}
              rows={2} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400 resize-none"
              placeholder="Yes, we offer free shipping on orders over $200." />
          </div>
          <button onClick={addFaq} disabled={!newQ.trim() || !newA.trim()}
            className="px-5 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #8B6914)' }}>
            Add FAQ Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotAdmin;
