import React, { useState } from 'react';
import { Users, DollarSign, Clock, CheckCircle, CalendarDays, BarChart, List, Clock3, UserRoundCheck, UserRoundX } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Dashboard.jsx: Komponen halaman Dashboard yang menampilkan metrik utama dan data tambahan.
export default function Dashboard() {
  // State untuk melacak tanggal yang dipilih, diinisialisasi dengan tanggal hari ini.
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  // Data dummy untuk metrik
  const stats = [
    { name: 'Jumlah Karyawan', value: '1,250', icon: Users },
    { name: 'Total Gaji Karyawan', value: '$750,000', icon: DollarSign },
    { name: 'Rata-rata Jam Kerja', value: '40 Jam', icon: Clock },
    { name: 'Hadir Hari Ini', value: '1,200', icon: CheckCircle },
  ];

  // Data dummy untuk grafik kehadiran mingguan, diubah agar kompatibel dengan Recharts
  const weeklyAttendanceData = [
    { name: 'Senin', Hadir: 90, Terlambat: 8, 'Tidak Hadir': 2 },
    { name: 'Selasa', Hadir: 85, Terlambat: 12, 'Tidak Hadir': 3 },
    { name: 'Rabu', Hadir: 92, Terlambat: 5, 'Tidak Hadir': 3 },
    { name: 'Kamis', Hadir: 88, Terlambat: 10, 'Tidak Hadir': 2 },
    { name: 'Jumat', Hadir: 95, Terlambat: 4, 'Tidak Hadir': 1 },
    { name: 'Sabtu', Hadir: 50, Terlambat: 3, 'Tidak Hadir': 5 },
    { name: 'Minggu', Hadir: 10, Terlambat: 2, 'Tidak Hadir': 88 },
  ];

  // Data dummy untuk aktivitas absen terbaru
  const latestActivities = [
    { name: 'John Doe', time: '08:00', status: 'Hadir', icon: UserRoundCheck },
    { name: 'Jane Smith', time: '07:55', status: 'Terlambat', icon: Clock3 },
    { name: 'Peter Jones', time: '08:15', status: 'Hadir', icon: UserRoundCheck },
    { name: 'Mary Anne', time: '09:00', status: 'Tidak Hadir', icon: UserRoundX },
    { name: 'Michael Brown', time: '08:05', status: 'Hadir', icon: UserRoundCheck },
    { name: 'Sarah Connor', time: '07:50', status: 'Hadir', icon: UserRoundCheck },
    { name: 'Alex Miller', time: '08:20', status: 'Terlambat', icon: Clock3 },
    { name: 'Jessica White', time: '08:30', status: 'Tidak Hadir', icon: UserRoundX },
  ];

  // Data dummy untuk total gaji karyawan
  const employeeSalaries = [
    { name: 'John Doe', position: 'Manager', salary: '$12,000' },
    { name: 'Jane Smith', position: 'Developer', salary: '$8,500' },
    { name: 'Peter Jones', position: 'Designer', salary: '$7,800' },
    { name: 'Robert Johnson', position: 'HR', salary: '$9,100' },
    { name: 'Emily Davis', position: 'Accountant', salary: '$9,500' },
    { name: 'James Wilson', position: 'Support', salary: '$6,000' },
    { name: 'Linda Miller', position: 'Analyst', salary: '$10,200' },
    { name: 'David Evans', position: 'Engineer', salary: '$11,500' },
  ];

  console.log('Halaman Dashboard dirender. Tanggal saat ini:', selectedDate); // log untuk debugging

  // Fungsi untuk menangani perubahan tanggal
  const handleDateChange = (e) => {
    console.log('Tanggal diubah menjadi:', e.target.value);
    setSelectedDate(e.target.value);
  };

  return (
    <div className="p-6">
      {/* Date Picker */}
      <div className="flex items-center justify-between rounded-lg bg-gray-800 p-4 shadow-lg mb-6">
        <h1 className="text-2xl font-bold text-gray-200">Dashboard</h1>
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

      {/* Metrik Utama */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="flex items-center rounded-lg bg-gray-800 p-4 shadow-lg transition-transform duration-200 hover:scale-105">
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

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Grafik Kehadiran */}
        <div className="rounded-lg bg-gray-800 p-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-700 pb-2">
            <h2 className="text-lg font-semibold text-gray-200">Grafik Kehadiran Mingguan</h2>
            <BarChart size={20} className="text-gray-400" />
          </div>
          <div className="mt-4 w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={weeklyAttendanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#2d3748', border: 'none' }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#9ca3af' }}
                />
                <Legend />
                <Bar dataKey="Hadir" fill="#10b981" />
                <Bar dataKey="Terlambat" fill="#eab308" />
                <Bar dataKey="Tidak Hadir" fill="#ef4444" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Aktivitas Absen Terbaru (Sekarang dapat di-scroll) */}
        <div className="rounded-lg bg-gray-800 p-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-700 pb-2">
            <h2 className="text-lg font-semibold text-gray-200">Aktivitas Absen Terbaru</h2>
            <List size={20} className="text-gray-400" />
          </div>
          {/* Kontainer dengan tinggi tetap dan scrollbar */}
          <div className="mt-4 h-64 overflow-y-auto">
            <ul className="space-y-4">
              {latestActivities.map((activity, index) => (
                <li key={index} className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-white">
                    <activity.icon size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-200">{activity.name}</p>
                    <p className="text-sm text-gray-400">{activity.status} ({activity.time})</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Total Gaji Masing-Masing Karyawan (Sekarang dapat di-scroll) */}
      <div className="mt-6 rounded-lg bg-gray-800 p-4 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">Total Gaji Masing-Masing Karyawan</h2>
        {/* Kontainer dengan tinggi tetap dan scrollbar */}
        <div className="mt-4 max-h-64 overflow-y-auto overflow-x-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700 sticky top-0">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Nama</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Jabatan</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Gaji</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-800">
              {employeeSalaries.map((employee, index) => (
                <tr key={index} className="transition-colors duration-200 hover:bg-gray-700">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">{employee.name}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">{employee.position}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">{employee.salary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
