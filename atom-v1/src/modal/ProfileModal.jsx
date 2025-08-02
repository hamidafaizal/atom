import React from 'react';
import { LogOut, User, Edit } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Mengimpor client Supabase

// ProfileModal: Komponen modal/popup untuk menampilkan informasi profil.
export default function ProfileModal({ isOpen, onClose }) {
  console.log('ProfileModal dirender. isOpen:', isOpen); // log untuk debugging

  // Fungsi untuk menangani logout
  const handleLogout = async () => {
    console.log('Tombol keluar diklik.'); // log untuk debugging
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error saat logout:', error.message); // log untuk debugging jika ada error
    }
    onClose(); // Menutup modal setelah logout
  };

  // Mengontrol visibilitas dan animasi modal
  const modalClass = isOpen
    ? 'scale-100 opacity-100'
    : 'scale-95 opacity-0 pointer-events-none';

  return (
    // Container modal dengan posisi absolut di samping sidebar
    <div
      className={`absolute left-[80px] bottom-[20px] z-50 w-64 rounded-lg bg-gray-800 p-4 text-white shadow-xl transition-all duration-300 transform origin-bottom-left ${modalClass}`}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center space-x-3 border-b border-gray-700 pb-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
          <User size={24} />
        </div>
        <div>
          <p className="font-semibold">Nama Akun Dummy</p>
          <p className="text-sm text-gray-400">dummy@email.com</p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <button className="flex w-full items-center justify-between rounded-md p-2 text-sm font-medium text-gray-300 transition-colors duration-200 hover:bg-gray-700 hover:text-white">
          <span>Edit Profil</span>
          <Edit size={16} />
        </button>
        <button
          onClick={handleLogout} // Menambahkan event handler onClick
          className="flex w-full items-center justify-between rounded-md p-2 text-sm font-medium text-gray-300 transition-colors duration-200 hover:bg-gray-700 hover:text-white"
        >
          <span>Keluar</span>
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
}
