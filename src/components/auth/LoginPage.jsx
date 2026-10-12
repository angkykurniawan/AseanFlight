// ============================================================
// LoginPage.jsx – Halaman login SkyWatch ASEAN
// ============================================================
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function LoginPage() {
  const { login, loginError, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [shake, setShake]       = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await login(username, password);
    if (!ok) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  }

  return (
    <div className="login-bg">
      {/* Animated background blobs */}
      <div className="login-blob login-blob--1" aria-hidden="true" />
      <div className="login-blob login-blob--2" aria-hidden="true" />
      <div className="login-blob login-blob--3" aria-hidden="true" />

      <div className={`login-card${shake ? ' login-card--shake' : ''}`}>
        {/* Logo */}
        <div className="login-card__logo" aria-hidden="true">
          <span className="login-card__logo-icon">✈</span>
        </div>

        {/* Heading */}
        <div className="login-card__heading">
          <h1 className="login-card__title">SkyWatch ASEAN</h1>
          <p className="login-card__subtitle">
            IBM Global AI Builders Challenge · Aviation Track
          </p>
        </div>

        {/* Divider */}
        <div className="login-card__divider" aria-hidden="true" />

        <p className="login-card__prompt">Masuk untuk melanjutkan</p>

        {/* Form */}
        <form
          className="login-form"
          onSubmit={handleSubmit}
          noValidate
          aria-label="Form login"
        >
          {/* Username */}
          <div className="login-form__group">
            <label className="login-form__label" htmlFor="login-username">
              Username
            </label>
            <div className="login-form__input-wrap">
              <span className="login-form__icon" aria-hidden="true">👤</span>
              <input
                id="login-username"
                type="text"
                className="login-form__input"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
                required
                aria-required="true"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-form__group">
            <label className="login-form__label" htmlFor="login-password">
              Password
            </label>
            <div className="login-form__input-wrap">
              <span className="login-form__icon" aria-hidden="true">🔒</span>
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                className="login-form__input"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                aria-required="true"
                disabled={isLoading}
              />
              <button
                type="button"
                className="login-form__toggle-pass"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? 'Sembunyikan password' : 'Tampilkan password'}
                tabIndex={0}
                disabled={isLoading}
              >
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {/* Error */}
          {loginError && (
            <div
              className="login-form__error"
              role="alert"
              aria-live="assertive"
            >
              <span aria-hidden="true">⚠️</span> {loginError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="login-form__submit"
            disabled={isLoading || !username || !password}
            aria-label="Masuk ke dashboard"
          >
            {isLoading ? (
              <span className="login-form__spinner" aria-hidden="true" />
            ) : null}
            {isLoading ? 'Memverifikasi…' : 'Masuk ke Dashboard'}
          </button>
        </form>

        {/* Footer note */}
        <p className="login-card__note">
          🔐 Akses terbatas · Tidak ada registrasi publik
        </p>
      </div>
    </div>
  );
}
