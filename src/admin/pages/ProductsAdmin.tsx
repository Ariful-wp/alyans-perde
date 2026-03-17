import React, { useState } from 'react';
import { useAdmin, AdminProduct } from '../../context/AdminContext';

const EMPTY: Omit<AdminProduct, 'id'> = {
  name: '', price: 0, originalPrice: 0, image: '', category: 'Sheer',
  badge: '', description: '', colors: [], sizes: [],
};

const CATEGORIES = ['Sheer', 'Blackout', 'Velvet', 'Cotton', 'Silk', 'Linen', 'Jacquard'];
const SIZES_OPTIONS = ['54" x 84"', '54" x 96"', '54" x 108"', '63" x 84"', '84" x 96"'];


const Badge: React.FC<{ text?: string }> = ({ text }) => {
  if (!text) return null;
  const colors: Record<string, string> = {
    'Best Seller': '#C9A84C', 'New': '#10B981', 'Premium': '#8B5CF6', 'Sale': '#EF4444',
  };
  const c = colors[text] || '#6B7280';
  return <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `${c}18`, color: c }}>{text}</span>;
};

const ProductsAdmin: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [form, setForm] = useState<Omit<AdminProduct, 'id'>>(EMPTY);
  const [colorsInput, setColorsInput] = useState('');
  const [sizesChecked, setSizesChecked] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const filtered = products.filter(p =>
    (filterCat === 'All' || p.category === filterCat) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd = () => {
    setEditing(null); setForm(EMPTY); setColorsInput(''); setSizesChecked([]); setShowModal(true);
  };

  const openEdit = (p: AdminProduct) => {
    setEditing(p);
    setForm({ name: p.name, price: p.price, originalPrice: p.originalPrice, image: p.image, category: p.category, badge: p.badge || '', description: p.description, colors: p.colors, sizes: p.sizes });
    setColorsInput(p.colors.join(', '));
    setSizesChecked(p.sizes);
    setShowModal(true);
  };

  const handleSave = () => {
    const final = { ...form, colors: colorsInput.split(',').map(s => s.trim()).filter(Boolean), sizes: sizesChecked };
    if (editing) updateProduct({ ...final, id: editing.id });
    else addProduct(final);
    setShowModal(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleSize = (s: string) =>
    setSizesChecked(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const gold = '#C9A84C';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Products</h1>
          <p className="text-gray-500 text-sm">{products.length} total products in store</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:shadow-lg"
          style={{ background: 'linear-gradient(135deg, #C9A84C, #8B6914)' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Product
        </button>
      </div>

      {saved && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#059669' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Product saved successfully!
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400 bg-white" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', ...CATEGORIES].map(c => (
            <button key={c} onClick={() => setFilterCat(c)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={filterCat === c
                ? { background: 'linear-gradient(135deg, #C9A84C, #8B6914)', color: 'white' }
                : { background: 'white', color: '#6B7280', border: '1px solid #e5e7eb' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
            style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
            <div className="relative">
              <img src={p.image} alt={p.name}
                className="w-full h-44 object-cover"
                onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x200/f5f5f5/999?text=No+Image'; }} />
              {p.badge && (
                <div className="absolute top-2 left-2">
                  <Badge text={p.badge} />
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="font-semibold text-gray-800 text-sm truncate">{p.name}</p>
              <p className="text-xs text-gray-400 mb-2">{p.category}</p>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-gray-900">${p.price}</span>
                {p.originalPrice > p.price && (
                  <span className="text-xs text-gray-400 line-through">${p.originalPrice}</span>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                  style={{ background: 'rgba(201,168,76,0.12)', color: gold }}>
                  Edit
                </button>
                <button onClick={() => setDeleteId(p.id)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-red-50"
                  style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444' }}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          <p className="text-sm">No products found</p>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 text-center mb-2">Delete Product?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => { deleteProduct(deleteId!); setDeleteId(null); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6 space-y-4">
              {/* Image preview */}
              {form.image && (
                <img src={form.image} alt="preview" className="w-full h-40 object-cover rounded-xl"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Product Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400" placeholder="e.g. Ivory Linen Sheer" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Price ($) *</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: +e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400" placeholder="129" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Original Price ($)</label>
                  <input type="number" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: +e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400" placeholder="179" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400 bg-white">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Badge</label>
                  <select value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400 bg-white">
                    <option value="">None</option>
                    <option>Best Seller</option><option>New</option><option>Premium</option><option>Sale</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Image URL *</label>
                  <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400" placeholder="https://i.imgur.com/..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={3} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400 resize-none"
                    placeholder="Product description..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Colors (comma separated)</label>
                  <input value={colorsInput} onChange={e => setColorsInput(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400"
                    placeholder="Ivory, White, Cream" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Available Sizes</label>
                  <div className="flex flex-wrap gap-2">
                    {SIZES_OPTIONS.map(s => (
                      <button key={s} type="button" onClick={() => toggleSize(s)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border"
                        style={sizesChecked.includes(s)
                          ? { background: 'linear-gradient(135deg, #C9A84C, #8B6914)', color: 'white', border: 'none' }
                          : { background: 'white', color: '#6B7280', borderColor: '#e5e7eb' }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={!form.name || !form.image}
                className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #C9A84C, #8B6914)' }}>
                {editing ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsAdmin;
