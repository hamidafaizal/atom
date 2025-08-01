import React, { useState } from 'react';
import Header from './components/Header.jsx';
import BottomMenu from './components/BottomMenu.jsx';
import Beranda from './pages/Beranda.jsx';
import Gaji from './pages/Gaji.jsx';
import Jadwal from './pages/Jadwal.jsx';
import Profile from './pages/Profile.jsx'; // Mengimpor halaman Profile

// App.jsx: Komponen utama PWA Absensi
export default function App() {
  const [activePage, setActivePage] = useState('beranda');
  console.log('App dirender. Halaman aktif:', activePage); // log untuk debugging

  const renderPage = () => {
    console.log('Merender halaman:', activePage); // log untuk debugging
    switch (activePage) {
      case 'beranda':
        return <Beranda />;
      case 'gaji':
        return <Gaji />;
      case 'jadwal':
        return <Jadwal />;
      case 'profil':
        return <Profile />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-white text-3xl">Halaman {activePage}</h1>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <Header />
      {/* Konten utama aplikasi yang ditampilkan berdasarkan halaman yang aktif */}
      <div className="flex-1 overflow-y-auto">
        {renderPage()}
      </div>
      <BottomMenu activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
}
