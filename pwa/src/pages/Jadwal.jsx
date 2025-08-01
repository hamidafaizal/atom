import React, { useState, useEffect } from 'react';
import { CalendarDays, Briefcase } from 'lucide-react';

// Jadwal.jsx: Komponen halaman Jadwal untuk absensi
export default function Jadwal() {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Memperbarui tanggal dan waktu setiap menit
    const timerId = setInterval(() => setCurrentDate(new Date()), 60000);
    console.log('Jadwal: Tanggal realtime dimulai.'); // log untuk debugging
    return () => clearInterval(timerId);
  }, []);

  const formattedDate = currentDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Data dummy untuk jadwal kerja
  const workSchedule = [
    { day: 'Senin', time: '08:00 - 17:00' },
    { day: 'Selasa', time: '08:00 - 17:00' },
    { day: 'Rabu', time: '08:00 - 17:00' },
    { day: 'Kamis', time: '08:00 - 17:00' },
    { day: 'Jumat', time: '08:00 - 17:00' },
    { day: 'Sabtu', time: 'Libur' },
    { day: 'Minggu', time: 'Libur' },
  ];

  console.log('Halaman Jadwal dirender. Tanggal:', formattedDate); // log untuk debugging

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between rounded-lg bg-gray-800 p-4 shadow-lg backdrop-blur-md">
        <h1 className="text-xl font-bold text-gray-200">Jadwal Kerja</h1>
        <div className="flex items-center space-x-2">
          <CalendarDays size={20} className="text-gray-400" />
          <span className="text-sm text-gray-200">{formattedDate}</span>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-gray-800 p-4 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold text-gray-200">Jadwal Masuk Kerja</h2>
        <ul className="space-y-3">
          {workSchedule.map((schedule, index) => (
            <li key={index} className="flex items-center justify-between rounded-md bg-gray-700 p-3">
              <div className="flex items-center space-x-2">
                <Briefcase size={20} className="text-blue-500" />
                <span className="text-sm font-medium text-white">{schedule.day}</span>
              </div>
              <span className="text-sm text-gray-400">{schedule.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
