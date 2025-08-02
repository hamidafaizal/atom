import React from 'react';
import Beranda from '../pages/Beranda.jsx';
import Gaji from '../pages/Gaji.jsx';
import Jadwal from '../pages/Jadwal.jsx';
import Profile from '../pages/Profile.jsx';

// AppRoutes.jsx: Komponen untuk mengatur semua rute halaman PWA
export default function AppRoutes({ activePage }) {
  console.log('AppRoutes PWA dirender. Halaman aktif:', activePage); // log untuk debugging

  // Fungsi untuk merender halaman berdasarkan state activePage
  const renderPage = () => {
    console.log('Merender halaman PWA:', activePage); // log untuk debugging
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
        // Fallback untuk halaman yang tidak ditemukan
        return (
          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-white text-3xl">Halaman {activePage}</h1>
          </div>
        );
    }
  };

  return <>{renderPage()}</>;
}
