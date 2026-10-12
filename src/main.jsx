// ============================================================
// main.jsx – Entry point aplikasi SkyWatch ASEAN
// ============================================================
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { FlightProvider } from './context/FlightContext.jsx';
import Root from './Root.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <FlightProvider>
        <Root />
      </FlightProvider>
    </AuthProvider>
  </StrictMode>
);
