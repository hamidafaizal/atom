import React, { useState } from 'react';
import { Search, Plus, Trash, Edit } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Import supabase client
import VerificationCodeModal from '../modal/VerificationCodeModal.jsx'; // Import modal baru

// DataKaryawan.jsx: Komponen halaman Data Karyawan.
export default function DataKaryawan({ setActivePage, setSelectedEmployeeId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  // Data dummy employees (akan kita ganti dengan data dari database nanti)
  const employees = [
    {
      id: 'EMP001',
      avatar: 'https://placehold.co/40x40/2563eb/white?text=JD',
      name: 'John Doe',
      email: 'john.doe@email.com',
      position: 'Manager',
      joinDate: '01/01/2020',
    },
  ];

  console.log('Halaman Data Karyawan dirender.'); // log untuk debugging

  // Fungsi untuk generate dan menyimpan kode verifikasi
  const handleAddEmployeeClick = async () => {
    console.log('Tombol Tambah Karyawan diklik.'); // log untuk debugging
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('Admin tidak login.'); // log error jika admin tidak ditemukan
      setModalMessage('Gagal mendapatkan data admin. Silakan login ulang.');
      setVerificationCode('ERROR');
      setIsModalOpen(true);
      return;
    }

    // Generate kode 4 digit secara acak
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    console.log('Kode yang digenerate:', code, 'untuk admin ID:', user.id); // log untuk debugging

    // Memasukkan kode baru ke tabel 'verification_codes'
    const { error } = await supabase
      .from('verification_codes')
      .insert([{ code: code, admin_id: user.id }]);

    if (error) {
      console.error('Gagal menyimpan kode verifikasi:', error.message); // log jika ada error dari supabase
      setModalMessage('Gagal membuat kode. Coba lagi.');
      setVerificationCode('ERROR');
    } else {
      console.log('Kode verifikasi berhasil disimpan ke database.'); // log sukses
      setVerificationCode(code);
      setModalMessage('Berikan kode ini kepada karyawan baru Anda untuk mendaftar.');
    }
    setIsModalOpen(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEmployeeClick = (employeeId) => {
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
        <button
          onClick={handleAddEmployeeClick}
          className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-blue-700"
        >
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

      <VerificationCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        code={verificationCode}
        message={modalMessage}
      />
    </div>
  );
}
