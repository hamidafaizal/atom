import React from 'react';
import { LogOut } from 'lucide-react';

// Header.jsx: Komponen header untuk aplikasi PWA Absensi
export default function Header() {
  console.log('Header dirender.'); // log untuk debugging

  const handleLogout = () => {
    console.log('Tombol Keluar diklik.');
    alert('Anda telah keluar!');
    // Logika logout akan ditambahkan di sini
  };

  return (
    <header className="flex items-center justify-between p-4 bg-gray-900 shadow-md w-full">
      {/* Logo di sisi kiri */}
      <div className="flex items-center space-x-2">
        <img src="/logo.png" alt="Logo Atom" className="h-8 w-8" />
      </div>

      {/* Teks "Atom Absensi" di tengah */}
      <h2 className="text-xl font-semibold text-white">Atom Absensi</h2>

      {/* Tombol keluar di sisi kanan */}
      <button onClick={handleLogout} className="text-white hover:text-blue-500 transition-colors duration-200">
        <LogOut size={24} />
      </button>
    </header>
  );
}
