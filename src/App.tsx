import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { AdminProvider } from './context/AdminContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import LanguagePopup from './components/LanguagePopup';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';

// Admin
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminGuard from './admin/AdminGuard';
import Dashboard from './admin/pages/Dashboard';
import ProductsAdmin from './admin/pages/ProductsAdmin';
import CollectionsAdmin from './admin/pages/CollectionsAdmin';
import MediaAdmin from './admin/pages/MediaAdmin';
import ContentAdmin from './admin/pages/ContentAdmin';
import ChatbotAdmin from './admin/pages/ChatbotAdmin';
import SettingsAdmin from './admin/pages/SettingsAdmin';

const App: React.FC = () => {
  return (
    <AdminProvider>
      <LanguageProvider>
        <Router>
          <CartProvider>
            <Routes>
              {/* ── Public store routes ── */}
              <Route path="/" element={
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <div className="flex-1"><Home /></div>
                  <Footer />
                  <CartDrawer />
                  <LanguagePopup />
                  <Chatbot />
                </div>
              } />
              <Route path="/shop" element={
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <div className="flex-1"><Shop /></div>
                  <Footer />
                  <CartDrawer />
                  <Chatbot />
                </div>
              } />
              <Route path="/product/:id" element={
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <div className="flex-1"><ProductDetail /></div>
                  <Footer />
                  <CartDrawer />
                  <Chatbot />
                </div>
              } />
              <Route path="/about" element={
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <div className="flex-1"><About /></div>
                  <Footer />
                  <CartDrawer />
                  <Chatbot />
                </div>
              } />
              <Route path="/contact" element={
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <div className="flex-1"><Contact /></div>
                  <Footer />
                  <CartDrawer />
                  <Chatbot />
                </div>
              } />
              <Route path="/cart" element={
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <div className="flex-1"><Cart /></div>
                  <Footer />
                  <CartDrawer />
                  <Chatbot />
                </div>
              } />

              {/* ── Admin routes ── */}
              {/* /admin → redirect to /admin/login */}
              <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

              {/* Public admin login page */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* All other /admin/* routes are protected */}
              <Route
                path="/admin/*"
                element={
                  <AdminGuard>
                    <AdminLayout />
                  </AdminGuard>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<ProductsAdmin />} />
                <Route path="collections" element={<CollectionsAdmin />} />
                <Route path="media" element={<MediaAdmin />} />
                <Route path="content" element={<ContentAdmin />} />
                <Route path="chatbot" element={<ChatbotAdmin />} />
                <Route path="settings" element={<SettingsAdmin />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CartProvider>
        </Router>
      </LanguageProvider>
    </AdminProvider>
  );
};

const NotFound: React.FC = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4"
    style={{ background: 'linear-gradient(135deg, #f9f7f4 0%, #f0ece4 100%)' }}>
    <p className="text-8xl font-light gold-text mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>404</p>
    <h1 className="text-3xl font-light text-stone-700 mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Page Not Found</h1>
    <p className="text-stone-500 mb-8 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      The page you're looking for doesn't exist.
    </p>
    <a href="/" className="btn-gold px-8 py-3.5 text-xs tracking-widest uppercase rounded-sm"
      style={{ fontFamily: 'Montserrat, sans-serif' }}>Go Home</a>
  </div>
);

export default App;
