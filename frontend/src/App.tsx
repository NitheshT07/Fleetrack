import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from './components/ui/sonner';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { Vehicles } from './pages/Vehicles';
import { VehicleDetail } from './pages/VehicleDetail';
import { Expenses } from './pages/Expenses';
import { Revenue } from './pages/Revenue';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

type Page = 'login' | 'register' | 'forgot-password' | 'dashboard' | 'vehicles' | 'vehicle-detail' | 'expenses' | 'revenue' | 'reports' | 'settings';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');

  useEffect(() => {
    if (isAuthenticated && currentPage === 'login') {
      setCurrentPage('dashboard');
    }
  }, [isAuthenticated]);

  const handleNavigation = (page: string, vehicleId?: string) => {
    setCurrentPage(page as Page);
    if (vehicleId) {
      setSelectedVehicleId(vehicleId);
    }
  };

  if (!isAuthenticated) {
    if (currentPage === 'register') {
      return <Register onNavigate={handleNavigation} />;
    }
    if (currentPage === 'forgot-password') {
      return <ForgotPassword onNavigate={handleNavigation} />;
    }
    return <Login onNavigate={handleNavigation} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b14]">
      <Sidebar activePage={currentPage} onNavigate={handleNavigation} />
      
      <div className="ml-70">
        <Header />
        
        <main className="min-h-[calc(100vh-4rem)]">
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'vehicles' && <Vehicles onNavigate={handleNavigation} />}
          {currentPage === 'vehicle-detail' && <VehicleDetail vehicleId={selectedVehicleId} onNavigate={handleNavigation} />}
          {currentPage === 'expenses' && <Expenses />}
          {currentPage === 'revenue' && <Revenue />}
          {currentPage === 'reports' && <Reports />}
          {currentPage === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </ThemeProvider>
  );
}
