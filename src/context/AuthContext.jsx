// ============================================================
// AuthContext.jsx – Context autentikasi session SkyWatch ASEAN
// Kredensial dibaca dari .env (VITE_APP_USERNAME / VITE_APP_PASSWORD).
// Tidak ada registrasi; hanya satu akun yang didefinisikan di .env.
// Session disimpan di memori saja (tidak ada localStorage/sessionStorage).
// ============================================================
import { createContext, useContext, useState, useCallback } from 'react';

// Hapus tanda petik yang mungkin ikut terbaca oleh dotenv
// (terjadi bila nilai .env dikutip untuk menghindari karakter khusus seperti #)
const VALID_USERNAME = (import.meta.env.VITE_APP_USERNAME ?? '').replace(/^["']|["']$/g, '');
const VALID_PASSWORD = (import.meta.env.VITE_APP_PASSWORD ?? '').replace(/^["']|["']$/g, '');

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
        if (
          username.trim() === VALID_USERNAME &&
          password === VALID_PASSWORD
        ) {
          setUser({ username: username.trim(), loginAt: new Date() });
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
