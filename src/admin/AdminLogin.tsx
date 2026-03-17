import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const { login, isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess] = useState(false);

  // If already authenticated, redirect to dashboard immediately
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: string })?.from || '/admin/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');
    setAttemptsLeft(null);

    // Simulate network delay for realism
    await new Promise(r => setTimeout(r, 900));

    const result = login(email.trim(), password);

    if (result.ok) {
      setSuccess(true);
      await new Promise(r => setTimeout(r, 600));
      const from = (location.state as { from?: string })?.from || '/admin/dashboard';
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Invalid credentials.');
      if (result.attemptsLeft !== undefined) {
        setAttemptsLeft(result.attemptsLeft);
      }
      setLoading(false);
    }
  };

  const gold = '#C9A84C';
  const goldDark = '#8B6914';

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1408 40%, #0f0c04 100%)' }}
    >
      {/* Animated background rings */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border"
            style={{
              width: `${180 + i * 120}px`,
              height: `${180 + i * 120}px`,
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              borderColor: `rgba(201,168,76,${0.06 - i * 0.008})`,
              animation: `pulse ${3 + i * 0.5}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Gold glow orbs */}
      <div className="absolute top-1/4 -left-16 w-72 h-72 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.12), transparent 70%)' }} />
      <div className="absolute bottom-1/4 -right-16 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.08), transparent 70%)' }} />

      {/* Back to site link */}
      <a
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs transition-all duration-200 z-20"
        style={{ color: 'rgba(201,168,76,0.6)', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.08em' }}
        onMouseEnter={e => (e.currentTarget.style.color = gold)}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(201,168,76,0.6)')}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Website
      </a>

      {/* Version badge */}
      <div className="absolute top-6 right-6 z-20">
        <span className="text-xs px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', color: 'rgba(201,168,76,0.7)', fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.1em' }}>
          ADMIN v2.0
        </span>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[420px] mx-4">
        <div
          className="rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: 'rgba(15,12,4,0.85)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(201,168,76,0.18)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.05)',
          }}
        >
          {/* Card Header */}
          <div
            className="px-8 pt-8 pb-6 text-center relative"
            style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}
          >
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: `linear-gradient(135deg, ${gold}, ${goldDark})` }}
              >
                <span className="text-3xl font-bold text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>A</span>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-white mb-0.5" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Alyans Perde
            </h1>
            <p className="text-xs tracking-widest uppercase" style={{ color: gold, fontFamily: 'Montserrat, sans-serif' }}>
              Admin Portal
            </p>
          </div>

          {/* Form Body */}
          <div className="px-8 py-7">
            <h2 className="text-base font-semibold text-white mb-5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Sign in to your account
            </h2>

            {/* Error Alert */}
            {error && (
              <div
                className="mb-5 p-3.5 rounded-xl flex items-start gap-3 text-sm"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}
              >
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-red-300 font-medium">{error}</p>
                  {attemptsLeft !== null && attemptsLeft > 0 && (
                    <p className="text-red-400 text-xs mt-0.5">{attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining before lockout.</p>
                  )}
                </div>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div
                className="mb-5 p-3.5 rounded-xl flex items-center gap-3 text-sm"
                style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}
              >
                <svg className="w-4 h-4 flex-shrink-0 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-green-300 font-medium">Login successful! Redirecting...</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-xs font-medium mb-1.5 tracking-wide" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Montserrat, sans-serif' }}>
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: 'rgba(201,168,76,0.5)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="arifulprowp@gmail.com"
                    required
                    autoComplete="email"
                    disabled={loading || success}
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-white text-sm outline-none transition-all duration-200"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(201,168,76,0.15)',
                      fontFamily: 'Montserrat, sans-serif',
                      color: 'rgba(255,255,255,0.9)',
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = 'rgba(201,168,76,0.5)';
                      e.target.style.background = 'rgba(255,255,255,0.07)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.08)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = 'rgba(201,168,76,0.15)';
                      e.target.style.background = 'rgba(255,255,255,0.04)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-medium mb-1.5 tracking-wide" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Montserrat, sans-serif' }}>
                  PASSWORD
                </label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: 'rgba(201,168,76,0.5)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    autoComplete="current-password"
                    disabled={loading || success}
                    className="w-full pl-11 pr-11 py-3 rounded-xl text-white text-sm outline-none transition-all duration-200"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(201,168,76,0.15)',
                      fontFamily: 'Montserrat, sans-serif',
                      color: 'rgba(255,255,255,0.9)',
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = 'rgba(201,168,76,0.5)';
                      e.target.style.background = 'rgba(255,255,255,0.07)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.08)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = 'rgba(201,168,76,0.15)';
                      e.target.style.background = 'rgba(255,255,255,0.04)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    disabled={loading || success}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-150"
                    style={{ color: 'rgba(201,168,76,0.5)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = gold)}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(201,168,76,0.5)')}
                  >
                    {showPass ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2.5 mt-2"
                style={{
                  background: success
                    ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                    : loading
                      ? `rgba(201,168,76,0.4)`
                      : `linear-gradient(135deg, ${gold}, ${goldDark})`,
                  color: 'white',
                  cursor: loading || success ? 'not-allowed' : 'pointer',
                  boxShadow: loading || success ? 'none' : '0 4px 20px rgba(201,168,76,0.3)',
                  fontFamily: 'Montserrat, sans-serif',
                  letterSpacing: '0.06em',
                }}
                onMouseEnter={e => {
                  if (!loading && !success) {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 25px rgba(201,168,76,0.4)';
                  }
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = loading || success ? 'none' : '0 4px 20px rgba(201,168,76,0.3)';
                }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Authenticating...
                  </>
                ) : success ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Access Granted!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign In to Dashboard
                  </>
                )}
              </button>
            </form>

            {/* Security Info */}
            <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center justify-center gap-4 text-xs" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'Montserrat, sans-serif' }}>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Secure Access
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Session Protected
                </span>
                <span>·</span>
                <span>© 2025</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hint below card */}
        <p className="text-center text-xs mt-4" style={{ color: 'rgba(255,255,255,0.15)', fontFamily: 'Montserrat, sans-serif' }}>
          Unauthorized access is strictly prohibited.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
