import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Header from './components/Header.jsx';
import BottomMenu from './components/BottomMenu.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
import Login from './auth/Login.jsx';
import Register from './auth/Register.jsx';

// App.jsx: Komponen utama PWA Absensi yang mengatur state autentikasi
export default function App() {
  const [session, setSession] = useState(null);
  const [activePage, setActivePage] = useState('login'); // Default page
  const [loading, setLoading] = useState(true); // State untuk loading awal

  useEffect(() => {
    // Cek sesi yang ada saat komponen dimuat
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setActivePage(session ? 'beranda' : 'login');
      setLoading(false);
      console.log('Sesi awal PWA:', session); // log untuk debugging
    });

    // Listener untuk perubahan state autentikasi (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setActivePage('beranda');
      } else {
        setActivePage('login');
      }
      console.log('Perubahan status autentikasi PWA, sesi baru:', session); // log untuk debugging
    });

    // Cleanup listener saat komponen di-unmount
    return () => subscription.unsubscribe();
  }, []);

  // Tampilkan loading screen jika sesi masih diperiksa
  if (loading) {
    return <div className="flex items-center justify-center h-screen w-screen bg-gray-900 text-white">Loading...</div>;
  }

  // Render konten berdasarkan status sesi
  if (!session) {
    switch (activePage) {
      case 'register':
        return <Register setActivePage={setActivePage} />;
      default:
        return <Login setActivePage={setActivePage} />;
    }
  }

  // Tampilkan aplikasi utama jika sudah login
  return (
    <div className="flex flex-col h-screen w-screen">
      <Header />
      <div className="flex-1 overflow-y-auto">
        <AppRoutes activePage={activePage} />
      </div>
      <BottomMenu activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
}
