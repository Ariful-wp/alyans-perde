import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { products as initialProducts } from '../data/products';
import { categories as initialCategories } from '../data/products';
import { heroSlides as initialHeroSlides } from '../data/products';
import { galleryImages as initialGallery } from '../data/products';

// ─── Types ──────────────────────────────────────────────────────────────────
export interface AdminProduct {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  badge?: string;
  description: string;
  colors: string[];
  sizes: string[];
}

export interface AdminCategory {
  id: string;
  name: string;
  image: string;
  count: number;
  description: string;
}

export interface AdminHeroSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface AdminTeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
}

export interface AdminSettings {
  logoName: string;
  logoInitial: string;
  primaryColor: string;
  accentColor: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  pinterest: string;
  footerText: string;
  heroTitle: string;
  aboutText: string;
  ourStoryText: string;
  chatbotEnabled: boolean;
  chatbotWelcome: string;
  chatbotFaq: { question: string; answer: string }[];
}

export interface AdminUser {
  email: string;
  password: string;
  name: string;
  avatar: string;
}

interface AdminContextType {
  // Auth
  isAuthenticated: boolean;
  currentUser: AdminUser | null;
  login: (email: string, password: string) => { ok: boolean; error?: string; attemptsLeft?: number };
  logout: () => void;
  changePassword: (oldPass: string, newPass: string) => boolean;
  lastLogin: string;

  // Products
  products: AdminProduct[];
  addProduct: (p: Omit<AdminProduct, 'id'>) => void;
  updateProduct: (p: AdminProduct) => void;
  deleteProduct: (id: number) => void;

  // Categories
  categories: AdminCategory[];
  addCategory: (c: Omit<AdminCategory, 'id'>) => void;
  updateCategory: (c: AdminCategory) => void;
  deleteCategory: (id: string) => void;

  // Hero Slides
  heroSlides: AdminHeroSlide[];
  updateHeroSlide: (s: AdminHeroSlide) => void;

  // Gallery
  galleryImages: string[];
  addGalleryImage: (url: string) => void;
  removeGalleryImage: (idx: number) => void;
  updateGalleryImage: (idx: number, url: string) => void;

  // Team
  team: AdminTeamMember[];
  updateTeamMember: (m: AdminTeamMember) => void;

  // Settings
  settings: AdminSettings;
  updateSettings: (s: Partial<AdminSettings>) => void;
}

// ─── Defaults ───────────────────────────────────────────────────────────────
const DEFAULT_USER: AdminUser = {
  email: 'arifulprowp@gmail.com',
  password: 'arifulprowp@',
  name: 'Ariful Islam',
  avatar: 'AI',
};

const DEFAULT_SETTINGS: AdminSettings = {
  logoName: 'Alyans Perde',
  logoInitial: 'A',
  primaryColor: '#C9A84C',
  accentColor: '#8B6914',
  phone: '+90 555 123 4567',
  email: 'info@alyansperde.com',
  address: 'Istanbul, Turkey',
  whatsapp: '+905551234567',
  instagram: '#',
  facebook: '#',
  pinterest: '#',
  footerText: 'Crafting premium curtains for elegant homes since 2009.',
  heroTitle: 'Dress Your Windows in Luxury',
  aboutText: 'We are Alyans Perde — a premium curtain brand dedicated to transforming living spaces.',
  ourStoryText: 'Founded by Ariful Islam, Alyans Perde was born from a passion for beautiful interiors and quality craftsmanship.',
  chatbotEnabled: true,
  chatbotWelcome: "Hi! I'm Alyans 👋 Need help choosing the perfect curtain? Ask me anything!",
  chatbotFaq: [
    { question: 'What is your return policy?', answer: 'We offer a 30-day hassle-free return policy on all products.' },
    { question: 'Do you offer custom sizes?', answer: 'Yes! We provide custom sizing for all curtain styles.' },
    { question: 'How long does shipping take?', answer: 'Standard shipping takes 5–7 business days. Express available.' },
    { question: 'What fabrics do you offer?', answer: 'We offer linen, velvet, silk, cotton, jacquard, and blackout fabrics.' },
    { question: 'How do I measure my windows?', answer: 'Measure width × height in inches. Add 4–6 inches per side for fullness.' },
  ],
};

const DEFAULT_TEAM: AdminTeamMember[] = [
  { id: 1, name: 'Ariful Islam', role: 'Founder & Creative Director', image: 'https://i.imgur.com/NdkYWkY.jpg' },
  { id: 2, name: 'James Shek', role: 'Head of Design', image: 'https://i.imgur.com/4EDbtKl.jpg' },
  { id: 3, name: 'Amelian', role: 'Fabric Curator', image: 'https://i.imgur.com/eSnpKnn.jpg' },
];

// ─── Storage helpers ─────────────────────────────────────────────────────────
const load = <T,>(key: string, fallback: T, storage: Storage = localStorage): T => {
  try {
    const v = storage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};
const save = (key: string, val: unknown, storage: Storage = localStorage) => {
  try { storage.setItem(key, JSON.stringify(val)); } catch {}
};
const remove = (key: string, storage: Storage = localStorage) => {
  try { storage.removeItem(key); } catch {}
};

// ─── Context ─────────────────────────────────────────────────────────────────
const AdminContext = createContext<AdminContextType>({} as AdminContextType);
export const useAdmin = () => useContext(AdminContext);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth uses sessionStorage → cleared on browser/tab close
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    load<boolean>('admin_session', false, sessionStorage)
  );
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() =>
    load<AdminUser | null>('admin_session_user', null, sessionStorage)
  );
  // Credentials (email + hashed-equivalent) live in localStorage for persistence
  const [adminUser, setAdminUser] = useState<AdminUser>(() =>
    load('admin_credentials', DEFAULT_USER)
  );
  // Login attempt tracking (rate limiting)
  const [loginAttempts, setLoginAttempts] = useState(() =>
    load<number>('admin_login_attempts', 0, sessionStorage)
  );
  const [lockUntil, setLockUntil] = useState(() =>
    load<number>('admin_lock_until', 0, sessionStorage)
  );

  const [products, setProducts] = useState<AdminProduct[]>(() =>
    load('admin_products', initialProducts as AdminProduct[]));
  const [categories, setCategories] = useState<AdminCategory[]>(() =>
    load('admin_categories', initialCategories.map(c => ({ ...c, id: String(c.id) })) as AdminCategory[]));
  const [heroSlides, setHeroSlides] = useState<AdminHeroSlide[]>(() =>
    load('admin_hero', initialHeroSlides.map((s, i) => ({ ...s, id: i + 1 })) as AdminHeroSlide[]));
  const [galleryImages, setGalleryImages] = useState<string[]>(() =>
    load('admin_gallery', initialGallery));
  const [team, setTeam] = useState<AdminTeamMember[]>(() =>
    load('admin_team', DEFAULT_TEAM));
  const [settings, setSettings] = useState<AdminSettings>(() =>
    load('admin_settings', DEFAULT_SETTINGS));

  // Persist session (sessionStorage — cleared on browser close)
  useEffect(() => { save('admin_session', isAuthenticated, sessionStorage); }, [isAuthenticated]);
  useEffect(() => { save('admin_session_user', currentUser, sessionStorage); }, [currentUser]);
  // Persist credentials (localStorage — survives browser restarts)
  useEffect(() => { save('admin_credentials', adminUser); }, [adminUser]);
  // Rate limiting state
  useEffect(() => { save('admin_login_attempts', loginAttempts, sessionStorage); }, [loginAttempts]);
  useEffect(() => { save('admin_lock_until', lockUntil, sessionStorage); }, [lockUntil]);
  useEffect(() => { save('admin_products', products); }, [products]);
  useEffect(() => { save('admin_categories', categories); }, [categories]);
  useEffect(() => { save('admin_hero', heroSlides); }, [heroSlides]);
  useEffect(() => { save('admin_gallery', galleryImages); }, [galleryImages]);
  useEffect(() => { save('admin_team', team); }, [team]);
  useEffect(() => { save('admin_settings', settings); }, [settings]);

  // Auth — with rate limiting (max 5 attempts, 30s lockout)
  const MAX_ATTEMPTS = 5;
  const LOCK_DURATION_MS = 30_000;

  const login = (email: string, password: string): { ok: boolean; error?: string; attemptsLeft?: number } => {
    const now = Date.now();

    // Check lockout
    if (lockUntil > now) {
      const secsLeft = Math.ceil((lockUntil - now) / 1000);
      return { ok: false, error: `Too many attempts. Try again in ${secsLeft}s.` };
    }

    if (email.trim().toLowerCase() === adminUser.email.toLowerCase() && password === adminUser.password) {
      // ✅ Success — reset counters, write session
      setLoginAttempts(0);
      setLockUntil(0);
      remove('admin_login_attempts', sessionStorage);
      remove('admin_lock_until', sessionStorage);

      const userWithLogin = { ...adminUser, lastLogin: new Date().toISOString() };
      setIsAuthenticated(true);
      setCurrentUser(userWithLogin);
      save('admin_last_login', new Date().toISOString());
      return { ok: true };
    } else {
      // ❌ Failed
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        const lockTime = now + LOCK_DURATION_MS;
        setLockUntil(lockTime);
        return { ok: false, error: `Too many failed attempts. Locked for 30 seconds.` };
      }

      const left = MAX_ATTEMPTS - newAttempts;
      return { ok: false, error: `Invalid email or password.`, attemptsLeft: left };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    // Clear session storage completely
    remove('admin_session', sessionStorage);
    remove('admin_session_user', sessionStorage);
  };
  const changePassword = (oldPass: string, newPass: string): boolean => {
    if (oldPass !== adminUser.password) return false;
    const updated = { ...adminUser, password: newPass };
    setAdminUser(updated);
    setCurrentUser(updated);
    return true;
  };

  // Products
  const addProduct = (p: Omit<AdminProduct, 'id'>) => {
    const newP = { ...p, id: Date.now() };
    setProducts(prev => [newP, ...prev]);
  };
  const updateProduct = (p: AdminProduct) =>
    setProducts(prev => prev.map(x => x.id === p.id ? p : x));
  const deleteProduct = (id: number) =>
    setProducts(prev => prev.filter(x => x.id !== id));

  // Categories
  const addCategory = (c: Omit<AdminCategory, 'id'>) => {
    const newC = { ...c, id: c.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now() };
    setCategories(prev => [...prev, newC]);
  };
  const updateCategory = (c: AdminCategory) =>
    setCategories(prev => prev.map(x => x.id === c.id ? c : x));
  const deleteCategory = (id: string) =>
    setCategories(prev => prev.filter(x => x.id !== id));

  // Hero
  const updateHeroSlide = (s: AdminHeroSlide) =>
    setHeroSlides(prev => prev.map(x => x.id === s.id ? s : x));

  // Gallery
  const addGalleryImage = (url: string) => setGalleryImages(prev => [...prev, url]);
  const removeGalleryImage = (idx: number) =>
    setGalleryImages(prev => prev.filter((_, i) => i !== idx));
  const updateGalleryImage = (idx: number, url: string) =>
    setGalleryImages(prev => prev.map((x, i) => i === idx ? url : x));

  // Team
  const updateTeamMember = (m: AdminTeamMember) =>
    setTeam(prev => prev.map(x => x.id === m.id ? m : x));

  // Settings
  const updateSettings = (s: Partial<AdminSettings>) =>
    setSettings(prev => ({ ...prev, ...s }));

  return (
    <AdminContext.Provider value={{
      isAuthenticated, currentUser, login, logout, changePassword,
      lastLogin: load<string>('admin_last_login', ''),
      products, addProduct, updateProduct, deleteProduct,
      categories, addCategory, updateCategory, deleteCategory,
      heroSlides, updateHeroSlide,
      galleryImages, addGalleryImage, removeGalleryImage, updateGalleryImage,
      team, updateTeamMember,
      settings, updateSettings,
    }}>
      {children}
    </AdminContext.Provider>
  );
};
