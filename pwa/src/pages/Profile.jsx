import React from 'react';
import { UserCircle2, Mail, Phone, Briefcase } from 'lucide-react';

// Profile.jsx: Halaman untuk menampilkan profil karyawan.
export default function Profile() {
  // Data dummy profil karyawan
  const profileData = {
    avatar: 'https://placehold.co/120x120/3b82f6/ffffff?text=U',
    id: 'EMP001',
    name: 'User Dummy',
    position: 'Developer',
    email: 'user.dummy@email.com',
    phone: '0812-3456-7890',
  };

  console.log('Halaman Profil dirender.'); // log untuk debugging

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-gray-200 mb-6">Profil Saya</h1>

      <div className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg shadow-lg backdrop-blur-md">
        <img src={profileData.avatar} alt="Foto Profil" className="h-24 w-24 rounded-full border-2 border-blue-500" />
        <p className="mt-2 text-sm text-gray-400">ID Karyawan: {profileData.id}</p>

        <div className="mt-4 text-center">
          <h2 className="text-2xl font-bold text-white">{profileData.name}</h2>
          <p className="text-gray-400">{profileData.position}</p>
        </div>

        <div className="mt-6 w-full space-y-4">
          <div className="flex items-center space-x-3 text-gray-400">
            <Mail size={20} />
            <p className="text-sm">{profileData.email}</p>
          </div>
          <div className="flex items-center space-x-3 text-gray-400">
            <Phone size={20} />
            <p className="text-sm">{profileData.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
