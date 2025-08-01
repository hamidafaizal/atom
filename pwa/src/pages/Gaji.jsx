import React, { useState } from 'react';
import { CalendarDays, Briefcase, Clock, DollarSign } from 'lucide-react';

// Gaji.jsx: Halaman untuk melihat informasi gaji dan absensi.
export default function Gaji() {
  // State untuk tanggal yang dipilih
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  // Data dummy untuk metrik
  const stats = [
    { name: 'Total Masuk (Hari)', value: '22 Hari', icon: Briefcase },
    { name: 'Total Masuk (Jam)', value: '176 Jam', icon: Clock },
    { name: 'Total Gaji', value: '$8,500', icon: DollarSign },
  ];

  console.log('Halaman Gaji dirender. Tanggal saat ini:', selectedDate); // log untuk debugging

  const handleDateChange = (e) => {
    console.log('Tanggal diubah menjadi:', e.target.value);
    setSelectedDate(e.target.value);
  };

  return (
    <div className="p-6">
      {/* Date Picker */}
      <div className="flex items-center justify-between rounded-lg bg-gray-800 p-4 shadow-lg backdrop-blur-md mb-6">
        <h1 className="text-xl font-bold text-gray-200">Informasi Gaji</h1>
        <div className="flex items-center space-x-2">
          <CalendarDays size={20} className="text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="rounded-md bg-gray-700 py-1 px-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Metrik Gaji */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.name} className="flex items-center rounded-lg bg-gray-800 p-4 shadow-lg backdrop-blur-md transition-transform duration-200 hover:scale-105">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">{stat.name}</p>
              <p className="text-xl font-semibold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
