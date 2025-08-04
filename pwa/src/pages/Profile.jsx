import React, { useState, useEffect } from 'react';
import { Mail, Phone, Briefcase, User } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Import Supabase client

// Profile.jsx: Halaman untuk menampilkan profil karyawan.
export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      console.log('Mulai mengambil data profil dari Supabase.'); // log untuk debugging
      
      // Mengambil data pengguna yang sedang login
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Mengambil data dari tabel 'employees' berdasarkan user id
        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .eq('id', user.id)
          .single(); // Mengharapkan satu baris data

        if (error) {
          console.error('Error mengambil profil:', error.message);
        } else {
          console.log('Data profil berhasil diambil:', data);
          setProfileData(data);
        }
      } else {
        console.log('Pengguna tidak login, tidak dapat mengambil profil.');
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  // Fungsi untuk membuat inisial dari nama
  const getInitials = (name) => {
    if (!name) return <User size={48} />;
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-400">Memuat profil...</div>;
  }

  if (!profileData) {
    return <div className="p-6 text-center text-gray-400">Gagal memuat profil.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-gray-200 mb-6">Profil Saya</h1>

      <div className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg shadow-lg backdrop-blur-md">
        <div className="h-24 w-24 rounded-full border-2 border-blue-500 bg-blue-600 flex items-center justify-center text-white text-4xl font-bold">
          {getInitials(profileData.full_name)}
        </div>
        <p className="mt-2 text-sm text-gray-400">ID Karyawan: {profileData.employee_id_text || 'N/A'}</p>

        <div className="mt-4 text-center">
          <h2 className="text-2xl font-bold text-white">{profileData.full_name}</h2>
          <p className="text-gray-400">{profileData.position || 'Jabatan belum diatur'}</p>
        </div>

        <div className="mt-6 w-full space-y-4">
          <div className="flex items-center space-x-3 text-gray-400">
            <Mail size={20} />
            <p className="text-sm">{profileData.email}</p>
          </div>
          <div className="flex items-center space-x-3 text-gray-400">
            <Phone size={20} />
            <p className="text-sm">{profileData.phone_number || 'Nomor HP belum diatur'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
