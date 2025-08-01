import React, { useState, useEffect } from 'react';
import { LogIn, MapPin } from 'lucide-react';

// Beranda.jsx: Halaman utama yang menampilkan jam digital, lokasi, dan tombol absen
export default function Beranda() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Memperbarui waktu setiap detik
    const timerId = setInterval(() => setTime(new Date()), 1000);
    console.log('Jam digital dimulai.'); // log untuk debugging
    return () => {
      clearInterval(timerId);
      console.log('Jam digital dihentikan.'); // log untuk debugging
    };
  }, []);

  // Format waktu menjadi string digital HH:mm:ss
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  // Status lokasi dummy
  const locationStatus = {
    valid: true,
    text: 'Anda berada di lokasi yang valid.',
  };

  const handleAbsenMasuk = () => {
    console.log('Tombol Absen Masuk diklik.');
    alert('Absen Masuk berhasil!');
    // Logika absen akan ditambahkan di sini
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      {/* Container Jam Digital */}
      <div className="mb-8 rounded-xl bg-gray-800 p-8 shadow-xl backdrop-blur-md">
        <p className="text-6xl font-bold text-white">{`${hours}:${minutes}:${seconds}`}</p>
      </div>

      {/* Validasi Lokasi */}
      <div className={`mb-6 flex items-center space-x-2 rounded-full px-4 py-2 ${locationStatus.valid ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
        <MapPin size={20} className={`${locationStatus.valid ? 'text-green-400' : 'text-red-400'}`} />
        <p className={`text-sm ${locationStatus.valid ? 'text-green-200' : 'text-red-200'}`}>{locationStatus.text}</p>
      </div>

      {/* Tombol Absen */}
      <button
        onClick={handleAbsenMasuk}
        className="flex items-center space-x-2 rounded-lg bg-blue-600 px-8 py-4 text-white shadow-lg transition-colors duration-200 hover:bg-blue-700"
      >
        <LogIn size={24} />
        <span className="font-semibold text-lg">Absen Masuk</span>
      </button>
    </div>
  );
}
