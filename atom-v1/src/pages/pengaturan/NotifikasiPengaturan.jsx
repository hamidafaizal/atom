import React from 'react';

// NotifikasiPengaturan.jsx: Halaman pengaturan untuk preferensi notifikasi.
export default function NotifikasiPengaturan() {
  console.log('Halaman pengaturan Notifikasi dirender.'); // log untuk debugging
  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-4">Pengaturan Notifikasi</h2>
      <p className="text-gray-400">Ini adalah halaman untuk menyesuaikan preferensi notifikasi Anda.</p>
    </div>
  );
}
