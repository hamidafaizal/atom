import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash } from 'lucide-react';
import { supabase } from '../supabaseClient';
import VerificationCodeModal from '../modal/VerificationCodeModal.jsx';

// DataKaryawan.jsx: Komponen halaman Data Karyawan.
export default function DataKaryawan({ setActivePage, setSelectedEmployeeId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mengambil data karyawan saat komponen dimuat
  const fetchEmployees = async () => {
    console.log('Mulai mengambil data karyawan dari Supabase.'); // log untuk debugging
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('admin_id', user.id);

      if (error) {
        console.error('Error mengambil data karyawan:', error.message);
      } else {
        console.log('Data karyawan berhasil diambil:', data);
        setEmployees(data);
      }
    } else {
      console.log('Admin tidak login, tidak dapat mengambil data karyawan.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fungsi untuk generate dan menyimpan kode verifikasi
  const handleAddEmployeeClick = async () => {
    console.log('Tombol Tambah Karyawan diklik.'); // log untuk debugging
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('Admin tidak login.');
      setModalMessage('Gagal mendapatkan data admin. Silakan login ulang.');
      setVerificationCode('ERROR');
      setIsModalOpen(true);
      return;
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    console.log('Kode yang digenerate:', code, 'untuk admin ID:', user.id);

    const { error } = await supabase
      .from('verification_codes')
      .insert([{ code: code, admin_id: user.id }]);

    if (error) {
      console.error('Gagal menyimpan kode verifikasi:', error.message);
      setModalMessage('Gagal membuat kode. Coba lagi.');
      setVerificationCode('ERROR');
    } else {
      console.log('Kode verifikasi berhasil disimpan ke database.');
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

  // Fungsi untuk menangani klik tombol hapus
  const handleDeleteClick = async (employeeId) => {
    console.log(`Tombol Hapus diklik untuk karyawan ID: ${employeeId}`); // log untuk debugging
    
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', employeeId);

    if (error) {
      console.error('Error menghapus karyawan:', error.message);
    } else {
      console.log('Karyawan berhasil dihapus dari database.');
      setEmployees(employees.filter(emp => emp.id !== employeeId));
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.slice(0, 2).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const filteredEmployees = employees.filter(employee =>
    (employee.full_name && employee.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (employee.email && employee.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (employee.phone_number && employee.phone_number.includes(searchTerm))
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Nomor HP</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Jabatan</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Tanggal Bergabung</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Aksi</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-800">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-400">Memuat data...</td>
              </tr>
            ) : filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <tr key={employee.id} className="transition-colors duration-200 hover:bg-gray-700">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                          {getInitials(employee.full_name)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <button onClick={() => handleEmployeeClick(employee.id)} className="text-sm font-medium text-white hover:underline focus:outline-none">{employee.full_name}</button>
                        <div className="text-sm text-gray-400">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">{employee.phone_number || '-'}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">{employee.position || 'Belum diatur'}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">{formatDate(employee.created_at)}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button onClick={() => handleDeleteClick(employee.id)} className="text-red-500 hover:text-red-400">
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-400">Tidak ada data karyawan.</td>
              </tr>
            )}
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
