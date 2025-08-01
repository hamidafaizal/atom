import React from 'react';
import { Home, DollarSign, CalendarDays, User } from 'lucide-react';

// BottomMenu.jsx: Komponen menu navigasi bawah dengan efek glass
export default function BottomMenu({ activePage, setActivePage }) {
  const menuItems = [
    { name: 'Beranda', key: 'beranda', icon: Home },
    { name: 'Gaji', key: 'gaji', icon: DollarSign },
    { name: 'Jadwal', key: 'jadwal', icon: CalendarDays },
    { name: 'Profil', key: 'profil', icon: User },
  ];

  console.log('BottomMenu dirender. Item aktif:', activePage); // log untuk debugging

  return (
    <nav className="fixed bottom-0 left-0 z-10 w-full h-16 bg-transparent flex items-center justify-around">
      {menuItems.map((item) => (
        <button
          key={item.key}
          onClick={() => {
            console.log(`Tombol ${item.name} diklik.`);
            setActivePage(item.key);
          }}
          className={`flex flex-col items-center justify-center w-20 h-16 rounded-lg backdrop-blur-md bg-gray-800/50 text-gray-400 hover:text-white transition-colors duration-200
            ${activePage === item.key ? 'text-blue-500' : ''}`}
        >
          <item.icon size={24} />
          <span className="mt-1 text-xs">{item.name}</span>
        </button>
      ))}
    </nav>
  );
}
