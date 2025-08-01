import React from 'react';

// Akun.jsx: Halaman pengaturan untuk detail akun.
export default function Akun() {
  console.log('Halaman pengaturan Akun dirender.'); // log untuk debugging
  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-4">Pengaturan Akun</h2>
      <p className="text-gray-400">Ini adalah halaman untuk mengelola detail akun Anda.</p>
    </div>
  );
}
