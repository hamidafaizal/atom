import React, { useState } from 'react';
import { User, Bell, Shield, Settings as SettingsIcon, DollarSign } from 'lucide-react';
import Akun from './pengaturan/Akun.jsx';
import NotifikasiPengaturan from './pengaturan/NotifikasiPengaturan.jsx';
import ModelPenggajian from './pengaturan/ModelPenggajian.jsx';

// Pengaturan.jsx: Halaman utama pengaturan yang mengelola sub-menu.
export default function Pengaturan() {
  // State untuk melacak menu pengaturan yang sedang aktif
  const [activeMenu, setActiveMenu] = useState('akun');

  // Daftar menu pengaturan
  const settingsMenu = [
    { name: 'Akun', key: 'akun', icon: User },
    { name: 'Model Penggajian', key: 'modelGaji', icon: DollarSign },
    { name: 'Notifikasi', key: 'notifikasi', icon: Bell },
    { name: 'Keamanan', key: 'keamanan', icon: Shield },
    { name: 'Umum', key: 'umum', icon: SettingsIcon },
  ];

  console.log('Halaman Pengaturan dirender. Menu aktif:', activeMenu); // log untuk debugging

  const renderContent = () => {
    console.log('Merender konten untuk menu:', activeMenu);
    switch (activeMenu) {
      case 'akun':
        return <Akun />;
      case 'modelGaji':
        return <ModelPenggajian />;
      case 'notifikasi':
        return <NotifikasiPengaturan />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <h2 className="text-xl font-bold text-gray-400">Pilih menu dari sisi kiri.</h2>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Container Menu Pengaturan */}
      <div className="w-64 bg-gray-800 p-4 border-r border-gray-700">
        <h1 className="text-lg font-bold text-gray-200 mb-6">Pengaturan</h1>
        <nav className="space-y-2">
          {settingsMenu.map((menu) => (
            <button
              key={menu.key}
              onClick={() => setActiveMenu(menu.key)}
              className={`flex items-center w-full space-x-3 p-2 rounded-lg transition-colors duration-200
                ${activeMenu === menu.key ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
            >
              <menu.icon size={20} />
              <span>{menu.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Konten Halaman Pengaturan */}
      <div className="flex-1 p-6 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
}
