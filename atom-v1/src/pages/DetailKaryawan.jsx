import React, { useState, useEffect } from 'react';
import { ChevronLeft, Edit, Plus, Save, X } from 'lucide-react';
import { supabase } from '../supabaseClient';
import AttendanceModal from '../modal/AttendanceModal.jsx';

// DetailKaryawan.jsx: Komponen halaman Detail Karyawan dengan fungsionalitas edit
export default function DetailKaryawan({ employeeId, setActivePage }) {
  const [employee, setEmployee] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [salaryModels, setSalaryModels] = useState([]); // State untuk daftar model gaji
  const [loading, setLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    position: '',
    phone_number: '',
    salary_model_id: '', // Menambahkan salary_model_id ke form
  });
  const [message, setMessage] = useState('');

  // Fungsi untuk mengambil semua data
  const fetchAllData = async () => {
    if (!employeeId) {
      setLoading(false);
      setAttendanceLoading(false);
      return;
    }
    setLoading(true);
    setAttendanceLoading(true);
    console.log(`Mulai mengambil data untuk karyawan ID: ${employeeId}`);

    // Ambil detail karyawan dengan join ke tabel salary_models
    const { data: employeeData, error: employeeError } = await supabase
      .from('employees')
      .select(`
        *,
        salary_models (
          id,
          model_name
        )
      `)
      .eq('id', employeeId)
      .single();

    if (employeeError) {
      console.error('Error mengambil detail karyawan:', employeeError.message);
      setEmployee(null);
    } else {
      console.log('Detail karyawan berhasil diambil:', employeeData);
      setEmployee(employeeData);
      setFormData({
        full_name: employeeData.full_name || '',
        position: employeeData.position || '',
        phone_number: employeeData.phone_number || '',
        salary_model_id: employeeData.salary_model_id || '',
      });
    }
    setLoading(false);
    
    // Ambil semua model gaji yang tersedia untuk admin
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { data: modelsData, error: modelsError } = await supabase
            .from('salary_models')
            .select('id, model_name')
            .eq('admin_id', user.id);
        if (modelsError) {
            console.error('Error mengambil model gaji:', modelsError.message);
        } else {
            setSalaryModels(modelsData);
        }
    }

    // Ambil riwayat absensi
    const { data: attendanceData, error: attendanceError } = await supabase
      .from('attendance')
      .select('*')
      .eq('employee_id', employeeId)
      .order('check_in_time', { ascending: false });
    
    if (attendanceError) {
      console.error('Error mengambil riwayat absensi:', attendanceError.message);
    } else {
      console.log('Riwayat absensi berhasil diambil:', attendanceData);
      setAttendanceRecords(attendanceData);
    }
    setAttendanceLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, [employeeId]);
  
  const handleOpenAddModal = () => {
    setRecordToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (record) => {
    setRecordToEdit(record);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    const { data, error } = await supabase
      .from('employees')
      .update({
        full_name: formData.full_name,
        position: formData.position,
        phone_number: formData.phone_number,
        salary_model_id: formData.salary_model_id || null, // Simpan null jika tidak ada yang dipilih
      })
      .eq('id', employeeId)
      .select(`
        *,
        salary_models (
          id,
          model_name
        )
      `)
      .single();

    if (error) {
      setMessage(`Gagal menyimpan: ${error.message}`);
    } else {
      setEmployee(data);
      setIsEditing(false);
      setMessage('Data berhasil disimpan!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    return names.map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };
  
  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(isoString));
  };
  
  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(isoString));
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
                <Edit size={18} /><span>Edit Data</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button type="submit" className="flex items-center space-x-2 text-green-500 hover:text-green-400">
                  <Save size={18} /><span>Simpan</span>
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="flex items-center space-x-2 text-red-500 hover:text-red-400">
                  <X size={18} /><span>Batal</span>
                </button>
              </div>
            )}
          </div>
          {message && <p className="text-sm text-green-400 mb-4">{message}</p>}
          <div className="flex items-start space-x-6">
            <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {getInitials(employee.full_name)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div>
                <label className="text-sm text-gray-400">Nama Lengkap</label>
                {isEditing ? <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} className="w-full mt-1 rounded-md bg-gray-700 py-2 px-3 text-white" /> : <p className="text-white font-semibold">{employee.full_name}</p>}
              </div>
              <div>
                <label className="text-sm text-gray-400">Jabatan</label>
                {isEditing ? <input type="text" name="position" value={formData.position} onChange={handleInputChange} className="w-full mt-1 rounded-md bg-gray-700 py-2 px-3 text-white" /> : <p className="text-white font-semibold">{employee.position || 'Belum diatur'}</p>}
              </div>
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <p className="text-gray-500 font-semibold cursor-not-allowed">{employee.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Nomor HP</label>
                {isEditing ? <input type="text" name="phone_number" value={formData.phone_number} onChange={handleInputChange} className="w-full mt-1 rounded-md bg-gray-700 py-2 px-3 text-white" /> : <p className="text-white font-semibold">{employee.phone_number || 'Belum diatur'}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-400">Model Gaji</label>
                {isEditing ? (
                  <select name="salary_model_id" value={formData.salary_model_id} onChange={handleInputChange} className="w-full mt-1 rounded-md bg-gray-700 py-2 px-3 text-white">
                    <option value="">-- Pilih Model Gaji --</option>
                    {salaryModels.map(model => (
                      <option key={model.id} value={model.id}>{model.model_name}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-white font-semibold">{employee.salary_models?.model_name || 'Belum diatur'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Tabel Riwayat Absensi */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
            <h3 className="text-lg font-bold text-gray-200">Riwayat Absensi</h3>
            <button onClick={handleOpenAddModal} className="flex items-center space-x-2 rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700">
                <Plus size={16} /><span>Tambah Absen</span>
            </button>
        </div>
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Jam Masuk</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Jam Keluar</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-800">
              {attendanceLoading ? (
                <tr><td colSpan="4" className="text-center py-4 text-gray-400">Memuat riwayat absensi...</td></tr>
              ) : attendanceRecords.length > 0 ? (
                attendanceRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{formatDate(record.check_in_time)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{formatTime(record.check_in_time)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{formatTime(record.check_out_time)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleOpenEditModal(record)} className="text-blue-500 hover:text-blue-400 focus:outline-none">
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center py-4 text-gray-400">Tidak ada riwayat absensi.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <AttendanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchAllData}
        employeeId={employeeId}
        recordToEdit={recordToEdit}
      />
    </div>
  );
}
