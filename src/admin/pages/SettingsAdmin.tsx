import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';

const SettingsAdmin: React.FC = () => {
  const { settings, updateSettings, changePassword, currentUser } = useAdmin();
  const [saved, setSaved] = useState('');
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  const showSaved = (msg: string) => { setSaved(msg); setTimeout(() => setSaved(''), 2500); };

  const handleChangePassword = () => {
    setPassError(''); setPassSuccess('');
    if (!oldPass || !newPass || !confirmPass) { setPassError('All fields are required.'); return; }
    if (newPass.length < 6) { setPassError('New password must be at least 6 characters.'); return; }
    if (newPass !== confirmPass) { setPassError('Passwords do not match.'); return; }
    const ok = changePassword(oldPass, newPass);
    if (!ok) { setPassError('Current password is incorrect.'); return; }
    setPassSuccess('Password changed successfully!');
    setOldPass(''); setNewPass(''); setConfirmPass('');
    setTimeout(() => setPassSuccess(''), 3000);
  };

  const Section: React.FC<{ title: string; color: string; icon: React.ReactNode; children: React.ReactNode; onSave: () => void; saveLabel?: string }> =
    ({ title, color, icon, children, onSave, saveLabel }) => (
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
            <span style={{ color }}>{icon}</span>
          </div>
          <h2 className="font-bold text-gray-800">{title}</h2>
        </div>
        <div className="space-y-4">{children}</div>
        <button onClick={onSave}
          className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #C9A84C, #8B6914)' }}>
          {saveLabel || `Save ${title}`}
        </button>
      </div>
    );

  const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      {children}
    </div>
  );

  const Input: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string; type?: string }> =
    ({ value, onChange, placeholder, type = 'text' }) => (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400" />
    );

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Website Settings</h1>
        <p className="text-gray-500 text-sm">Configure brand identity, contact information, and social links.</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#059669' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          {saved}
        </div>
      )}

      {/* Brand Identity */}
      <Section title="Brand Identity" color="#C9A84C"
        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>}
        onSave={() => showSaved('Brand settings saved!')}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Logo Name">
            <Input value={settings.logoName} onChange={v => updateSettings({ logoName: v })} placeholder="Alyans Perde" />
          </Field>
          <Field label="Logo Initial (Single Letter)">
            <Input value={settings.logoInitial} onChange={v => updateSettings({ logoInitial: v.slice(0, 1).toUpperCase() })} placeholder="A" />
          </Field>
          <Field label="Primary Color (Hex)">
            <div className="flex gap-2">
              <input type="color" value={settings.primaryColor} onChange={e => updateSettings({ primaryColor: e.target.value })}
                className="w-12 h-10 rounded-xl border border-gray-200 cursor-pointer p-1" />
              <Input value={settings.primaryColor} onChange={v => updateSettings({ primaryColor: v })} placeholder="#C9A84C" />
            </div>
          </Field>
          <Field label="Accent Color (Hex)">
            <div className="flex gap-2">
              <input type="color" value={settings.accentColor} onChange={e => updateSettings({ accentColor: e.target.value })}
                className="w-12 h-10 rounded-xl border border-gray-200 cursor-pointer p-1" />
              <Input value={settings.accentColor} onChange={v => updateSettings({ accentColor: v })} placeholder="#8B6914" />
            </div>
          </Field>
        </div>
        {/* Live logo preview */}
        <div className="pt-2">
          <p className="text-xs font-semibold text-gray-600 mb-2">Logo Preview</p>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-900 w-fit">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.accentColor})` }}>
              <span className="text-white font-bold text-base">{settings.logoInitial}</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm tracking-wide">{settings.logoName.toUpperCase().split(' ')[0]}</p>
              <p className="text-xs tracking-widest" style={{ color: settings.primaryColor, fontSize: '9px' }}>
                {settings.logoName.toUpperCase().split(' ').slice(1).join(' ')}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Contact Info */}
      <Section title="Contact Information" color="#10B981"
        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
        onSave={() => showSaved('Contact info saved!')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Phone Number">
            <Input value={settings.phone} onChange={v => updateSettings({ phone: v })} placeholder="+90 555 123 4567" />
          </Field>
          <Field label="Email Address">
            <Input type="email" value={settings.email} onChange={v => updateSettings({ email: v })} placeholder="info@alyansperde.com" />
          </Field>
          <Field label="WhatsApp Number">
            <Input value={settings.whatsapp} onChange={v => updateSettings({ whatsapp: v })} placeholder="+905551234567" />
          </Field>
          <Field label="Address">
            <Input value={settings.address} onChange={v => updateSettings({ address: v })} placeholder="Istanbul, Turkey" />
          </Field>
        </div>
      </Section>

      {/* Social Media */}
      <Section title="Social Media Links" color="#8B5CF6"
        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>}
        onSave={() => showSaved('Social links saved!')}>
        <div className="space-y-3">
          <Field label="Instagram URL">
            <Input value={settings.instagram} onChange={v => updateSettings({ instagram: v })} placeholder="https://instagram.com/alyansperde" />
          </Field>
          <Field label="Facebook URL">
            <Input value={settings.facebook} onChange={v => updateSettings({ facebook: v })} placeholder="https://facebook.com/alyansperde" />
          </Field>
          <Field label="Pinterest URL">
            <Input value={settings.pinterest} onChange={v => updateSettings({ pinterest: v })} placeholder="https://pinterest.com/alyansperde" />
          </Field>
        </div>
      </Section>

      {/* Change Password */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <div>
            <h2 className="font-bold text-gray-800">Change Password</h2>
            <p className="text-xs text-gray-400">Logged in as: {currentUser?.email}</p>
          </div>
        </div>

        {passError && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {passError}
          </div>
        )}
        {passSuccess && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#059669' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            {passSuccess}
          </div>
        )}

        <div className="space-y-3">
          <Field label="Current Password">
            <input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400"
              placeholder="Enter current password" />
          </Field>
          <Field label="New Password">
            <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400"
              placeholder="Minimum 6 characters" />
          </Field>
          <Field label="Confirm New Password">
            <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400"
              placeholder="Repeat new password" />
          </Field>
        </div>
        <button onClick={handleChangePassword}
          className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)' }}>
          Update Password
        </button>
      </div>
    </div>
  );
};

export default SettingsAdmin;
