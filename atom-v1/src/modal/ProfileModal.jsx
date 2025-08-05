import React, { useState, useEffect } from 'react';
import { LogOut, User, Edit, Save, X } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Mengimpor client Supabase

// ProfileModal: Komponen modal/popup untuk menampilkan informasi profil.
export default function ProfileModal({ isOpen, onClose }) {
  const [userProfile, setUserProfile] = useState({ name: 'Loading...', email: '...' });
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fungsi untuk mengambil data pengguna saat modal terbuka
    const fetchUser = async () => {
      if (isOpen) {
        console.log('ProfileModal terbuka, mengambil data pengguna.'); // log untuk debugging
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const currentName = user.user_metadata?.display_name || 'Nama Tidak Ditemukan';
          console.log('Data pengguna berhasil diambil:', user); // log untuk debugging
          setUserProfile({
            name: currentName,
            email: user.email,
          });
          setNewName(currentName);
        }
        // Reset state saat modal dibuka
        setIsEditing(false);
        setMessage('');
      }
    };

    fetchUser();
  }, [isOpen]); // Jalankan efek ini setiap kali nilai isOpen berubah

  // Fungsi untuk menangani logout
  const handleLogout = async () => {
    console.log('Tombol keluar diklik.'); // log untuk debugging
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error saat logout:', error.message);
    }
    onClose();
  };

  // Fungsi untuk menangani update profil
  const handleUpdateProfile = async () => {
    setLoading(true);
    setMessage('');
    console.log('Menyimpan nama baru:', newName);

    const { data, error } = await supabase.auth.updateUser({
      data: { display_name: newName }
    });

    if (error) {
      console.error('Error mengupdate profil:', error.message);
      setMessage('Gagal menyimpan.');
    } else {
      console.log('Profil berhasil diupdate:', data.user);
      setUserProfile(prev => ({ ...prev, name: data.user.user_metadata.display_name }));
      setMessage('Berhasil disimpan!');
      setIsEditing(false); // Keluar dari mode edit
      setTimeout(() => setMessage(''), 3000);
    }
    setLoading(false);
  };

  // Mengontrol visibilitas dan animasi modal
  const modalClass = isOpen
    ? 'scale-100 opacity-100'
    : 'scale-95 opacity-0 pointer-events-none';

  return (
    <div
      className={`absolute left-[80px] bottom-[20px] z-50 w-64 rounded-lg bg-gray-800 p-4 text-white shadow-xl transition-all duration-300 transform origin-bottom-left ${modalClass}`}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center space-x-3 border-b border-gray-700 pb-3">
        {/* [FIX] Menambahkan flex-shrink-0 agar ikon tidak mengecil */}
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
          <User size={24} />
        </div>
        {/* [FIX] Menambahkan flex-1 dan min-w-0 agar teks bisa wrap dan container melebar */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full rounded-md bg-gray-700 px-2 py-1 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          ) : (
            <p className="font-semibold break-words">{userProfile.name}</p>
          )}
          <p className="text-sm text-gray-400 truncate">{userProfile.email}</p>
        </div>
      </div>
      {message && <p className="text-xs text-green-400 mt-2 text-center">{message}</p>}
      <div className="mt-4 space-y-2">
        {isEditing ? (
          <>
            <button
              onClick={handleUpdateProfile}
              disabled={loading}
              className="flex w-full items-center justify-between rounded-md p-2 text-sm font-medium text-green-400 transition-colors duration-200 hover:bg-gray-700 hover:text-white disabled:opacity-50"
            >
              <span>{loading ? 'Menyimpan...' : 'Simpan'}</span>
              <Save size={16} />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex w-full items-center justify-between rounded-md p-2 text-sm font-medium text-red-400 transition-colors duration-200 hover:bg-gray-700 hover:text-white"
            >
              <span>Batal</span>
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="flex w-full items-center justify-between rounded-md p-2 text-sm font-medium text-gray-300 transition-colors duration-200 hover:bg-gray-700 hover:text-white"
            >
              <span>Edit Profil</span>
              <Edit size={16} />
            </button>
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-between rounded-md p-2 text-sm font-medium text-gray-300 transition-colors duration-200 hover:bg-gray-700 hover:text-white"
            >
              <span>Keluar</span>
              <LogOut size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
