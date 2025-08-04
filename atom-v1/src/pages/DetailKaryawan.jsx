import React, { useState, useEffect } from 'react';
import { ChevronLeft, Edit, Plus, Save, X } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Import supabase client

// DetailKaryawan.jsx: Komponen halaman Detail Karyawan dengan fungsionalitas edit
export default function DetailKaryawan({ employeeId, setActivePage }) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    position: '',
    phone_number: ''
  });
  const [message, setMessage] = useState('');

  // Mengambil data detail karyawan saat komponen dimuat atau employeeId berubah
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (!employeeId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      console.log(`Mulai mengambil detail untuk karyawan ID: ${employeeId}`); // log untuk debugging

      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', employeeId)
        .single();

      if (error) {
        console.error('Error mengambil detail karyawan:', error.message);
        setEmployee(null);
      } else {
        console.log('Detail karyawan berhasil diambil:', data);
        setEmployee(data);
        // Inisialisasi form dengan data yang ada
        setFormData({
          full_name: data.full_name || '',
          position: data.position || '',
          phone_number: data.phone_number || ''
        });
      }
      setLoading(false);
    };

    fetchEmployeeDetails();
  }, [employeeId]);

  // Menangani perubahan pada input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Menangani submit form untuk update data
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    console.log(`Menyimpan perubahan untuk karyawan ID: ${employeeId}`, formData);

    const { data, error } = await supabase
      .from('employees')
      .update({
        full_name: formData.full_name,
        position: formData.position,
        phone_number: formData.phone_number
      })
      .eq('id', employeeId)
      .select()
      .single();

    if (error) {
      console.error('Error mengupdate karyawan:', error.message);
      setMessage(`Gagal menyimpan: ${error.message}`);
    } else {
      console.log('Karyawan berhasil diupdate:', data);
      setEmployee(data);
      setIsEditing(false);
      setMessage('Data berhasil disimpan!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Data dummy absensi
  const attendanceRecords = [
    { date: '2024-08-01', checkIn: '08:00', checkOut: '17:00', status: 'Valid' },
    { date: '2024-08-02', checkIn: '08:05', checkOut: '17:05', status: 'Invalid' },
  ];

  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-400">Memuat detail karyawan...</div>;
  }

  if (!employee) {
    return <div className="p-6 text-center text-gray-400">Karyawan tidak ditemukan.</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={() => setActivePage('employees')} className="p-2 rounded-full hover:bg-gray-700 text-gray-400 transition-colors duration-200">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-200">Detail Karyawan</h1>
      </div>

      <form onSubmit={handleUpdate}>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-200">Informasi Pribadi</h3>
            {!isEditing ? (
              <button type="button" onClick={() => setIsEditing(true)} className="flex items-center space-x-2 text-blue-500 hover:text-blue-400">
                <Edit size={18} />
                <span>Edit Data</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button type="submit" className="flex items-center space-x-2 text-green-500 hover:text-green-400">
                  <Save size={18} />
                  <span>Simpan</span>
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="flex items-center space-x-2 text-red-500 hover:text-red-400">
                  <X size={18} />
                  <span>Batal</span>
                </button>
              </div>
            )}
          </div>
          {message && <p className="text-sm text-green-400 mb-4">{message}</p>}
          <div className="flex items-center space-x-6">
            <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
              {getInitials(employee.full_name)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div>
                <label className="text-sm text-gray-400">Nama Lengkap</label>
                {isEditing ? (
                  <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} className="w-full mt-1 rounded-md bg-gray-700 py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600" />
                ) : (
                  <p className="text-white font-semibold">{employee.full_name}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-400">Jabatan</label>
                {isEditing ? (
                  <input type="text" name="position" value={formData.position} onChange={handleInputChange} className="w-full mt-1 rounded-md bg-gray-700 py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600" />
                ) : (
                  <p className="text-white font-semibold">{employee.position || 'Belum diatur'}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <p className="text-gray-500 font-semibold cursor-not-allowed">{employee.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Nomor HP</label>
                {isEditing ? (
                  <input type="text" name="phone_number" value={formData.phone_number} onChange={handleInputChange} className="w-full mt-1 rounded-md bg-gray-700 py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600" />
                ) : (
                  <p className="text-white font-semibold">{employee.phone_number || 'Belum diatur'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold text-gray-200 mb-4 border-b border-gray-700 pb-2">Riwayat Absensi</h3>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{record.checkIn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{record.checkOut}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.status === 'Valid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
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
