// ============================================================
// Root.jsx – Gate auth: tampilkan LoginPage atau App
// ============================================================
import { useAuth } from './context/AuthContext.jsx';
import LoginPage from './components/auth/LoginPage.jsx';
import App from './App.jsx';

export default function Root() {
  const { user } = useAuth();
  return user ? <App /> : <LoginPage />;
}
