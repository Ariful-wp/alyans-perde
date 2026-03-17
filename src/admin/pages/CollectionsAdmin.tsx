import React, { useState } from 'react';
import { useAdmin, AdminCategory } from '../../context/AdminContext';

const EMPTY: Omit<AdminCategory, 'id'> = { name: '', image: '', count: 0, description: '' };

const CollectionsAdmin: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [form, setForm] = useState<Omit<AdminCategory, 'id'>>(EMPTY);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const gold = '#C9A84C';

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (c: AdminCategory) => { setEditing(c); setForm({ name: c.name, image: c.image, count: c.count, description: c.description }); setShowModal(true); };

  const handleSave = () => {
    if (editing) updateCategory({ ...form, id: editing.id });
    else addCategory(form);
    setShowModal(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Collections</h1>
          <p className="text-gray-500 text-sm">{categories.length} active collections</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 hover:shadow-lg transition-all"
          style={{ background: 'linear-gradient(135deg, #C9A84C, #8B6914)' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Collection
        </button>
      </div>

      {saved && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#059669' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Collection saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map(c => (
          <div key={c.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
            style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
            <div className="relative h-44 bg-gray-100">
              <img src={c.image} alt={c.name} className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x200/f5f5f5/999?text=No+Image'; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <p className="text-white font-semibold text-sm">{c.name}</p>
                <p className="text-white/70 text-xs">{c.count} products</p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{c.description}</p>
              <div className="flex gap-2">
                <button onClick={() => openEdit(c)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{ background: 'rgba(201,168,76,0.12)', color: gold }}>Edit</button>
                <button onClick={() => setDeleteId(c.id)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-semibold"
                  style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444' }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 text-center mb-2">Delete Collection?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => { deleteCategory(deleteId!); setDeleteId(null); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">{editing ? 'Edit Collection' : 'Add Collection'}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {form.image && (
                <img src={form.image} alt="preview" className="w-full h-36 object-cover rounded-xl"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Collection Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400" placeholder="e.g. Sheer Curtains" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Image URL *</label>
                <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400" placeholder="https://i.imgur.com/..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400" placeholder="Light & airy elegance" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Product Count</label>
                <input type="number" value={form.count} onChange={e => setForm(f => ({ ...f, count: +e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400" placeholder="24" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={!form.name || !form.image}
                className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #C9A84C, #8B6914)' }}>
                {editing ? 'Save Changes' : 'Add Collection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionsAdmin;
