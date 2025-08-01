import React from 'react';
import { Mail, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

// Notifikasi.jsx: Komponen halaman Notifikasi.
export default function Notifikasi() {
  // Data dummy notifikasi
  const notifications = [
    {
      id: 1,
      title: 'Pembaruan Sistem',
      message: 'Sistem telah berhasil diperbarui ke versi terbaru.',
      timestamp: 'Baru saja',
      type: 'info',
      read: false,
    },
    {
      id: 2,
      title: 'Absensi Diterima',
      message: 'Absensi harian Anda telah disetujui.',
      timestamp: '1 jam yang lalu',
      type: 'success',
      read: false,
    },
    {
      id: 3,
      title: 'Peringatan Cuti Karyawan',
      message: 'John Doe mengajukan cuti 3 hari mulai besok.',
      timestamp: '3 jam yang lalu',
      type: 'warning',
      read: true,
    },
    {
      id: 4,
      title: 'Jadwal Rapat Baru',
      message: 'Rapat mingguan dijadwalkan ulang pada pukul 14.00.',
      timestamp: 'Kemarin',
      type: 'default',
      read: true,
    },
    {
      id: 5,
      title: 'Error Absensi',
      message: 'Terjadi kesalahan pada data absensi 22 Agustus.',
      timestamp: '2 hari yang lalu',
      type: 'error',
      read: true,
    },
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'info':
        return <Info size={20} />;
      case 'success':
        return <CheckCircle2 size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      default:
        return <Mail size={20} />;
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'info':
        return 'text-blue-500';
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  console.log('Halaman Notifikasi dirender.');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-200">Notifikasi</h1>
      <div className="mt-6 space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-center rounded-lg p-4 shadow-lg transition-colors duration-200 ${notif.read ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              <div className={`flex-shrink-0 mr-4 ${getIconColor(notif.type)}`}>
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${notif.read ? 'text-gray-300' : 'text-white'}`}>{notif.title}</p>
                <p className={`text-sm ${notif.read ? 'text-gray-500' : 'text-gray-400'}`}>{notif.message}</p>
              </div>
              <div className="flex-shrink-0 ml-4 text-xs text-gray-500">
                {notif.timestamp}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 p-10">Tidak ada notifikasi baru.</div>
        )}
      </div>
    </div>
  );
}
