import React, { useState } from 'react';
import { Search, Plus, Trash, Edit, UserCircle2 } from 'lucide-react';

// DataKaryawan.jsx: Komponen halaman Data Karyawan.
export default function DataKaryawan({ setActivePage, setSelectedEmployeeId }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Data dummy untuk daftar karyawan
  const employees = [
    {
      id: 'EMP001',
      avatar: 'https://placehold.co/40x40/2563eb/white?text=JD',
      name: 'John Doe',
      email: 'john.doe@email.com',
      position: 'Manager',
      joinDate: '01/01/2020',
    },
    {
      id: 'EMP002',
      avatar: 'https://placehold.co/40x40/eab308/white?text=JS',
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      position: 'Developer',
      joinDate: '15/03/2021',
    },
    {
      id: 'EMP003',
      avatar: 'https://placehold.co/40x40/ef4444/white?text=PJ',
      name: 'Peter Jones',
      email: 'peter.jones@email.com',
      position: 'Designer',
      joinDate: '22/07/2022',
    },
    {
      id: 'EMP004',
      avatar: 'https://placehold.co/40x40/10b981/white?text=MA',
      name: 'Mary Anne',
      email: 'mary.anne@email.com',
      position: 'HR',
      joinDate: '10/05/2023',
    },
    // Tambahkan data karyawan dummy lainnya jika diperlukan
  ];

  console.log('Halaman Data Karyawan dirender.'); // log untuk debugging

  // Fungsi untuk menangani input pencarian
  const handleSearchChange = (e) => {
    console.log('Nilai pencarian diubah:', e.target.value);
    setSearchTerm(e.target.value);
  };

  // Fungsi untuk menangani klik nama karyawan
  const handleEmployeeClick = (employeeId) => {
    console.log('Nama karyawan diklik. Navigasi ke detail halaman untuk ID:', employeeId);
    setSelectedEmployeeId(employeeId);
    setActivePage('detailKaryawan');
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-200">Data Karyawan</h1>
        <button className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-blue-700">
          <Plus size={16} />
          <span>Tambah Karyawan</span>
        </button>
      </div>

      <div className="relative mt-6">
        <input
          type="text"
          placeholder="Cari karyawan..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full rounded-md bg-gray-800 py-2 pl-10 pr-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      <div className="mt-6 overflow-hidden rounded-lg bg-gray-800 shadow-lg">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Nama</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">ID Karyawan</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Jabatan</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Tanggal Bergabung</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Aksi</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-800">
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="transition-colors duration-200 hover:bg-gray-700">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img className="h-10 w-10 rounded-full" src={employee.avatar} alt="" />
                    </div>
                    <div className="ml-4">
                      <button onClick={() => handleEmployeeClick(employee.id)} className="text-sm font-medium text-white hover:underline focus:outline-none">{employee.name}</button>
                      <div className="text-sm text-gray-400">{employee.email}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">{employee.id}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">{employee.position}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">{employee.joinDate}</td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button className="text-blue-500 hover:text-blue-400">
                    <Edit size={18} />
                  </button>
                  <button className="ml-2 text-red-500 hover:text-red-400">
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
