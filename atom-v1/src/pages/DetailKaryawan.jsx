import React from 'react';
import { ChevronLeft, Edit, Plus } from 'lucide-react';

// DetailKaryawan.jsx: Komponen halaman Detail Karyawan
export default function DetailKaryawan({ employeeId, setActivePage }) {
  // Data dummy karyawan, idealnya ini diambil dari API
  const employee = {
    id: employeeId,
    avatar: 'https://placehold.co/100x100/2563eb/white?text=JD',
    name: 'John Doe',
    email: 'john.doe@email.com',
    position: 'Manager',
    joinDate: '01/01/2020',
  };

  // Data dummy absensi yang telah diubah statusnya
  const attendanceRecords = [
    { date: '2024-08-01', checkIn: '08:00', checkOut: '17:00', status: 'Valid' },
    { date: '2024-08-02', checkIn: '08:05', checkOut: '17:05', status: 'Invalid' },
    { date: '2024-08-03', checkIn: '08:00', checkOut: '17:00', status: 'Valid' },
    { date: '2024-08-04', checkIn: '08:00', checkOut: '17:00', status: 'Valid' },
    { date: '2024-08-05', checkIn: '08:30', checkOut: '17:00', status: 'Invalid' },
  ];

  console.log('Halaman Detail Karyawan dirender untuk ID:', employeeId); // log untuk debugging

  // Fungsi dummy untuk tombol edit
  const handleEditTime = (record, type) => {
    console.log(`Mengedit jam ${type} untuk tanggal ${record.date}`);
    // Logika untuk mengedit jam akan ditambahkan di sini
  };

  // Fungsi dummy untuk tombol tambah hari baru
  const handleAddAttendance = () => {
    console.log('Menambahkan hari absensi baru.');
    // Logika untuk menambah hari baru akan ditambahkan di sini
  };

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={() => setActivePage('employees')} className="p-2 rounded-full hover:bg-gray-700 text-gray-400 transition-colors duration-200">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-200">Detail Karyawan</h1>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6 flex items-center space-x-6">
        <img className="h-24 w-24 rounded-full" src={employee.avatar} alt={employee.name} />
        <div>
          <h2 className="text-xl font-bold text-gray-200">{employee.name}</h2>
          <p className="text-gray-400">{employee.email}</p>
          <p className="text-gray-500 text-sm mt-1">ID: {employee.id} | Jabatan: {employee.position}</p>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
          <h3 className="text-lg font-bold text-gray-200">Riwayat Absensi</h3>
          <button onClick={handleAddAttendance} className="flex items-center space-x-2 rounded-lg bg-blue-600 px-3 py-1 text-sm text-white transition-colors duration-200 hover:bg-blue-700">
            <Plus size={16} />
            <span>Tambah Absen</span>
          </button>
        </div>
        
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Jam Masuk</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Jam Keluar</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-800">
              {attendanceRecords.map((record, index) => (
                <tr key={index} className="hover:bg-gray-700 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{record.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <div className="flex items-center space-x-2">
                      <span>{record.checkIn}</span>
                      <button onClick={() => handleEditTime(record, 'masuk')} className="text-blue-500 hover:text-blue-400 focus:outline-none">
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <div className="flex items-center space-x-2">
                      <span>{record.checkOut}</span>
                      <button onClick={() => handleEditTime(record, 'keluar')} className="text-blue-500 hover:text-blue-400 focus:outline-none">
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${record.status === 'Valid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
