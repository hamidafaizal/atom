import React from 'react';
import { LogOut } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Mengimpor client Supabase

// Header.jsx: Komponen header untuk aplikasi PWA Absensi
export default function Header() {
  console.log('Header PWA dirender.'); // log untuk debugging

  // Fungsi untuk menangani proses logout
  const handleLogout = async () => {
    console.log('Tombol Keluar PWA diklik.'); // log untuk debugging
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error saat logout PWA:', error.message); // log untuk debugging jika ada error
    }
    // Listener di App.jsx akan menangani perubahan state
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
