import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Sidebar from './components/Sidebar.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
import Login from './auth/Login.jsx';
import Register from './auth/Register.jsx';

// App.jsx: Komponen utama yang mengatur state autentikasi dan layout
function App() {
  const [session, setSession] = useState(null);
  const [activePage, setActivePage] = useState('login'); // Halaman default adalah login
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  useEffect(() => {
    // Cek sesi yang ada saat komponen dimuat
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setActivePage('dashboard'); // Jika ada sesi, arahkan ke dashboard
      }
      console.log('Sesi awal:', session); // log untuk debugging
    });

    // Listener untuk perubahan state autentikasi (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setActivePage('dashboard');
      } else {
        setActivePage('login');
      }
      console.log('Perubahan status autentikasi, sesi baru:', session); // log untuk debugging
    });

    // Cleanup listener saat komponen di-unmount
    return () => subscription.unsubscribe();
  }, []);

  // Fungsi untuk merender konten berdasarkan status sesi dan halaman aktif
  const renderContent = () => {
    if (!session) {
      if (activePage === 'register') {
        return <Register setActivePage={setActivePage} />;
      }
      return <Login setActivePage={setActivePage} />;
    }

    // Jika sesi ada, tampilkan layout utama dengan rute privat
    return (
      <div className="pl-[70px] min-h-screen">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <div className="flex-1">
          <AppRoutes
            activePage={activePage}
            setActivePage={setActivePage}
            selectedEmployeeId={selectedEmployeeId}
            setSelectedEmployeeId={setSelectedEmployeeId}
          />
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary>
      {renderContent()}
    </ErrorBoundary>
  );
}

export default App;
