import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Contact: React.FC = () => {
  const { t, dir } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1500);
  };

  return (
    <main className="min-h-screen" dir={dir}>
      {/* Page Header */}
      <div
        className="relative py-24 px-4 text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #f9f7f4 0%, #f0ece4 100%)' }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full" style={{ background: '#c9a84c', transform: 'translate(30%, -40%)' }} />
        </div>
        <div className="relative">
          <p className="text-amber-600 tracking-[0.3em] text-xs uppercase mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {t('contact_tag')}
          </p>
          <h1 className="text-5xl md:text-6xl font-light text-stone-800 mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t('contact_page_title')} <span className="italic gold-text">{t('contact_page_brand')}</span>
          </h1>
          <p className="text-stone-500 max-w-md mx-auto" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.875rem' }}>
            {t('contact_page_subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-3xl font-light text-stone-800 mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {t('contact_info_title')}
              </h2>
              <p className="text-stone-500 text-sm leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {t('contact_desc')}
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              {[
                { icon: Phone, label: t('contact_phone'), value: '+880 1743-566895', sub: 'Mon–Fri, 9AM–6PM', href: 'tel:+8801743566895', color: 'bg-blue-50 text-blue-500' },
                { icon: Mail, label: t('contact_email'), value: 'arifulprowp@gmail.com', sub: 'We reply within 24 hours', href: 'mailto:arifulprowp@gmail.com', color: 'bg-amber-50 text-amber-500' },
                { icon: MessageCircle, label: 'WhatsApp', value: '+880 1743-566895', sub: t('contact_whatsapp'), href: 'https://wa.me/8801743566895', color: 'bg-green-50 text-green-500' },
                { icon: MapPin, label: 'Showroom', value: '12 Luxe Avenue, NY', sub: 'Visit our showroom', href: '#', color: 'bg-purple-50 text-purple-500' },
              ].map(({ icon: Icon, label, value, sub, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-start gap-4 p-4 bg-white border border-stone-100 rounded-sm hover:border-amber-200 hover:shadow-sm transition-all group"
                >
                  <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>{label}</p>
                    <p className="text-stone-800 font-medium text-sm mt-0.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>{value}</p>
                    <p className="text-xs text-stone-400 mt-0.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>{sub}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Hours */}
            <div className="p-5 bg-stone-50 rounded-sm border border-stone-100">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-amber-500" />
                <h3 className="text-sm font-semibold text-stone-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Business Hours
                </h3>
              </div>
              {[
                ['Monday – Friday', '9:00 AM – 6:00 PM'],
                ['Saturday', '10:00 AM – 4:00 PM'],
                ['Sunday', 'Closed'],
              ].map(([day, hours]) => (
                <div key={day} className="flex justify-between py-1.5 border-b border-stone-100 last:border-0">
                  <span className="text-xs text-stone-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>{day}</span>
                  <span className="text-xs text-stone-700 font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>{hours}</span>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/8801743566895"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold tracking-wider uppercase rounded-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.8rem' }}
            >
              <MessageCircle size={18} />
              {t('contact_whatsapp')}
            </a>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-stone-100 rounded-sm p-8 shadow-sm">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                    <CheckCircle size={36} className="text-green-500" />
                  </div>
                  <h3 className="text-3xl font-light text-stone-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    Message Sent!
                  </h3>
                  <p className="text-stone-500 max-w-sm text-sm leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                    className="btn-gold px-8 py-3 text-xs tracking-widest uppercase rounded-sm mt-4"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {t('contact_form_send')}
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-light text-stone-800 mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    {t('contact_form_send')}
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs text-stone-500 tracking-wider mb-1.5 uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {t('contact_form_name')} *
                        </label>
                        <input
                          type="text" name="name" required
                          value={formData.name} onChange={handleChange}
                          placeholder={t('contact_form_name')}
                          className="w-full px-4 py-3 border border-stone-200 rounded-sm text-sm outline-none focus:border-amber-400 transition-colors bg-stone-50 focus:bg-white"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-stone-500 tracking-wider mb-1.5 uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {t('contact_form_email')} *
                        </label>
                        <input
                          type="email" name="email" required
                          value={formData.email} onChange={handleChange}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 border border-stone-200 rounded-sm text-sm outline-none focus:border-amber-400 transition-colors bg-stone-50 focus:bg-white"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs text-stone-500 tracking-wider mb-1.5 uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {t('contact_phone')}
                        </label>
                        <input
                          type="tel" name="phone"
                          value={formData.phone} onChange={handleChange}
                          placeholder="+880 1743-566895"
                          className="w-full px-4 py-3 border border-stone-200 rounded-sm text-sm outline-none focus:border-amber-400 transition-colors bg-stone-50 focus:bg-white"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-stone-500 tracking-wider mb-1.5 uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {t('contact_form_subject')} *
                        </label>
                        <select
                          name="subject" required
                          value={formData.subject} onChange={handleChange}
                          className="w-full px-4 py-3 border border-stone-200 rounded-sm text-sm outline-none focus:border-amber-400 transition-colors bg-stone-50 focus:bg-white"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          <option value="">Select a subject</option>
                          <option value="product">Product Inquiry</option>
                          <option value="order">Order Support</option>
                          <option value="custom">Custom Order</option>
                          <option value="design">Design Consultation</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-stone-500 tracking-wider mb-1.5 uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {t('contact_form_message')} *
                      </label>
                      <textarea
                        name="message" required
                        value={formData.message} onChange={handleChange}
                        rows={6}
                        placeholder={t('contact_form_message')}
                        className="w-full px-4 py-3 border border-stone-200 rounded-sm text-sm outline-none focus:border-amber-400 transition-colors bg-stone-50 focus:bg-white resize-none"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      />
                    </div>

                    <button
                      type="submit" disabled={loading}
                      className="btn-gold w-full py-4 text-sm tracking-widest uppercase rounded-sm flex items-center justify-center gap-2 disabled:opacity-70"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.8rem' }}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          {t('contact_form_sending')}
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          {t('contact_form_send')}
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
