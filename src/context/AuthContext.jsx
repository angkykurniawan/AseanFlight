// ============================================================
// AuthContext.jsx – Context autentikasi session SkyWatch ASEAN
// Kredensial dibaca dari .env (VITE_APP_USERNAME / VITE_APP_PASSWORD).
// PENTING: dotenv memotong nilai di karakter '#' kecuali dikutip.
// Untuk mengakomodasi hal ini, password di-reassemble dari dua bagian env:
//   VITE_APP_PASSWORD_PRE  = bagian sebelum #  (contoh: pass)
//   VITE_APP_PASSWORD_POST = bagian sesudah #  (contoh: 123)
// Bila tidak ada split, fallback ke VITE_APP_PASSWORD biasa.
// ============================================================
import { createContext, useContext, useState, useCallback } from 'react';

function cleanEnv(val) {
  return (val ?? '').replace(/^["']|["']$/g, '').trim();
}

// Coba baca password dari dua bagian terlebih dahulu
const _pre  = cleanEnv(import.meta.env.VITE_APP_PASSWORD_PRE);
const _post = cleanEnv(import.meta.env.VITE_APP_PASSWORD_POST);
const _full = cleanEnv(import.meta.env.VITE_APP_PASSWORD);

const VALID_USERNAME = cleanEnv(import.meta.env.VITE_APP_USERNAME);
// Kalau ada PRE+POST, gabungkan dengan '#'; kalau tidak ada, pakai FULL
const VALID_PASSWORD = (_pre || _post)
  ? `${_pre}#${_post}`
  : _full;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);   // null = belum login
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading]   = useState(false);

  /**
   * Verifikasi kredensial vs .env, tanpa network request.
   * Mensimulasikan sedikit jeda agar tidak terasa "instan" (UX).
   */
  const login = useCallback((username, password) => {
    setIsLoading(true);
    setLoginError('');
    return new Promise((resolve) => {
      setTimeout(() => {
        const uInput = username.trim();
        const pInput = password;
        if (
          uInput === VALID_USERNAME &&
          pInput === VALID_PASSWORD
        ) {
          setUser({ username: uInput, loginAt: new Date() });
          setLoginError('');
          resolve(true);
        } else {
          setLoginError('Username atau password salah.');
          resolve(false);
        }
        setIsLoading(false);
      }, 600);
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setLoginError('');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loginError, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return ctx;
}
