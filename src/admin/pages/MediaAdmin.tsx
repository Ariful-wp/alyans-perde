import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';

type Tab = 'hero' | 'gallery' | 'team';

const MediaAdmin: React.FC = () => {
  const { heroSlides, updateHeroSlide, galleryImages, addGalleryImage, removeGalleryImage, updateGalleryImage, team, updateTeamMember } = useAdmin();
  const [tab, setTab] = useState<Tab>('hero');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editUrl, setEditUrl] = useState('');
  const [saved, setSaved] = useState('');

  const showSaved = (msg: string) => { setSaved(msg); setTimeout(() => setSaved(''), 2500); };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'hero', label: 'Hero Slides' },
    { key: 'gallery', label: 'Gallery Images' },
    { key: 'team', label: 'Team Photos' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Media Manager</h1>
        <p className="text-gray-500 text-sm">Manage hero slides, gallery images, and team photos</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#059669' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          {saved}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-gray-100 w-fit">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
            style={tab === t.key
              ? { background: 'linear-gradient(135deg, #C9A84C, #8B6914)', color: 'white' }
              : { color: '#6B7280' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Hero Slides ── */}
      {tab === 'hero' && (
        <div className="space-y-5">
          <p className="text-sm text-gray-500">Edit the hero slider images and text. Changes are reflected on the homepage immediately.</p>
          {heroSlides.map((slide, i) => (
            <div key={slide.id} className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #C9A84C, #8B6914)' }}>{i + 1}</span>
                <span className="font-semibold text-gray-700 text-sm">Slide {i + 1}</span>
              </div>
              <div className="p-5 flex flex-col md:flex-row gap-5">
                <div className="flex-shrink-0">
                  <img src={slide.image} alt={`Slide ${i + 1}`}
                    className="w-full md:w-48 h-36 object-cover rounded-xl"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/200x150/f5f5f5/999?text=No+Image'; }} />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Image URL</label>
                    <input value={slide.image}
                      onChange={e => updateHeroSlide({ ...slide, image: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400"
                      placeholder="https://i.imgur.com/..." />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Title</label>
                      <input value={slide.title}
                        onChange={e => updateHeroSlide({ ...slide, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Subtitle</label>
                      <input value={slide.subtitle}
                        onChange={e => updateHeroSlide({ ...slide, subtitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                    <input value={slide.description}
                      onChange={e => updateHeroSlide({ ...slide, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400" />
                  </div>
                  <button onClick={() => showSaved(`Slide ${i + 1} saved!`)}
                    className="px-4 py-2 rounded-xl text-white text-xs font-semibold hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #C9A84C, #8B6914)' }}>
                    Save Slide
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Gallery ── */}
      {tab === 'gallery' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">Add New Gallery Image</h3>
            <div className="flex gap-3">
              <input value={newGalleryUrl} onChange={e => setNewGalleryUrl(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400"
                placeholder="https://i.imgur.com/..." />
              <button
                onClick={() => { if (newGalleryUrl.trim()) { addGalleryImage(newGalleryUrl.trim()); setNewGalleryUrl(''); showSaved('Image added to gallery!'); } }}
                className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #C9A84C, #8B6914)' }}>
                Add
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((url, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm group relative"
                style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                <div className="relative h-36">
                  <img src={url} alt={`Gallery ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/200x150/f5f5f5/999?text=No+Image'; }} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={() => { setEditingIdx(idx); setEditUrl(url); }}
                      className="w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center text-gray-700 hover:bg-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => { removeGalleryImage(idx); showSaved('Image removed!'); }}
                      className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center text-white hover:bg-red-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
                <p className="px-3 py-2 text-xs text-gray-400 truncate">Image {idx + 1}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Team Photos ── */}
      {tab === 'team' && (
        <div className="space-y-5">
          <p className="text-sm text-gray-500">Update team member names, roles, and profile photos shown on the About page.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {team.map(member => (
              <div key={member.id} className="bg-white rounded-2xl overflow-hidden shadow-sm"
                style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                <div className="p-5 flex flex-col items-center text-center">
                  <img src={member.image} alt={member.name}
                    className="w-24 h-24 rounded-full object-cover mb-3 ring-4 ring-yellow-100"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/96x96/f5f5f5/999?text=Photo'; }} />
                  <p className="font-semibold text-gray-800">{member.name}</p>
                  <p className="text-xs text-gray-400">{member.role}</p>
                </div>
                <div className="px-5 pb-5 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Name</label>
                    <input value={member.name}
                      onChange={e => updateTeamMember({ ...member, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Role</label>
                    <input value={member.role}
                      onChange={e => updateTeamMember({ ...member, role: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Photo URL</label>
                    <input value={member.image}
                      onChange={e => updateTeamMember({ ...member, image: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400"
                      placeholder="https://i.imgur.com/..." />
                  </div>
                  <button onClick={() => showSaved(`${member.name}'s profile saved!`)}
                    className="w-full py-2 rounded-xl text-white text-xs font-semibold hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #C9A84C, #8B6914)' }}>
                    Save Changes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit gallery image modal */}
      {editingIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
            <h3 className="font-bold text-gray-800 mb-4">Edit Gallery Image</h3>
            {editUrl && (
              <img src={editUrl} alt="preview" className="w-full h-40 object-cover rounded-xl mb-4"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            )}
            <input value={editUrl} onChange={e => setEditUrl(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400 mb-4"
              placeholder="https://i.imgur.com/..." />
            <div className="flex gap-3">
              <button onClick={() => setEditingIdx(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => { updateGalleryImage(editingIdx, editUrl); setEditingIdx(null); showSaved('Image updated!'); }}
                className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #C9A84C, #8B6914)' }}>
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaAdmin;
