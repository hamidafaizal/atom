import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';

// ExportSlipGaji.jsx: Komponen halaman untuk mengekspor slip gaji.
export default function ExportSlipGaji() {
  const [searchTerm, setSearchTerm] = useState('');

  // Data dummy daftar karyawan
  const employees = [
    { id: 'EMP001', name: 'John Doe' },
    { id: 'EMP002', name: 'Jane Smith' },
    { id: 'EMP003', name: 'Peter Jones' },
    { id: 'EMP004', name: 'Mary Anne' },
  ];

  console.log('Halaman Export Slip Gaji dirender.'); // log untuk debugging

  const handleSearchChange = (e) => {
    console.log('Nilai pencarian diubah:', e.target.value);
    setSearchTerm(e.target.value);
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-200">Export Slip Gaji</h1>
        <button className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-blue-700">
          <Download size={16} />
          <span>Download Semua Slip</span>
        </button>
      </div>

      <div className="relative mt-6">
        <input
          type="text"
          placeholder="Cari nama karyawan..."
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
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Aksi</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-800">
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="transition-colors duration-200 hover:bg-gray-700">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">{employee.name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button className="text-blue-500 hover:text-blue-400">
                    <Download size={18} />
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
