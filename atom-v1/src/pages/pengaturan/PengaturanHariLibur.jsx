import React, { useState, useEffect } from 'react';
import { Plus, Trash, Calendar } from 'lucide-react';
import { supabase } from '../../supabaseClient.js';

// PengaturanHariLibur.jsx: Halaman untuk mengelola data hari libur nasional/perusahaan.
export default function PengaturanHariLibur() {
  const [holidays, setHolidays] = useState([]);
  const [newDate, setNewDate] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Fungsi untuk mengambil daftar hari libur
  const fetchHolidays = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('holidays')
      .select('*')
      .eq('admin_id', user.id)
      .order('holiday_date', { ascending: true });

    if (error) {
      console.error('Error mengambil data hari libur:', error.message);
    } else {
      setHolidays(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  // Fungsi untuk menambah hari libur baru
  const handleAddHoliday = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('holidays')
      .insert({
        admin_id: user.id,
        holiday_date: newDate,
        description: newDesc
      });

    if (error) {
      console.error('Error menambah hari libur:', error.message);
      setMessage(`Gagal: ${error.message}`);
    } else {
      setMessage('Hari libur berhasil ditambahkan.');
      setNewDate('');
      setNewDesc('');
      fetchHolidays(); // Muat ulang data
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Fungsi untuk menghapus hari libur
  const handleDeleteHoliday = async (holidayId) => {
    const { error } = await supabase
      .from('holidays')
      .delete()
      .eq('id', holidayId);
    
    if (error) {
      console.error('Error menghapus hari libur:', error.message);
    } else {
      fetchHolidays(); // Muat ulang data
    }
  };
  
  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    }).format(new Date(dateString));
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-4">Pengaturan Hari Libur</h2>
      
      {/* Form Tambah Hari Libur */}
      <form onSubmit={handleAddHoliday} className="mb-6 p-4 bg-gray-700 rounded-lg flex items-end space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-400">Tanggal Libur</label>
          <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="mt-1 w-full rounded-md bg-gray-800 p-2 text-white" required />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-400">Keterangan</label>
          <input type="text" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Cth: Hari Kemerdekaan RI" className="mt-1 w-full rounded-md bg-gray-800 p-2 text-white" required />
        </div>
        <button type="submit" className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
          <Plus size={16} />
          <span>Tambah</span>
        </button>
      </form>
      {message && <p className="text-center text-sm text-green-400 mb-4">{message}</p>}

      {/* Daftar Hari Libur */}
      <div className="space-y-2">
        {loading ? <p className="text-gray-400">Memuat...</p> : holidays.map(holiday => (
          <div key={holiday.id} className="flex justify-between items-center p-3 rounded-lg bg-gray-700">
            <div className="flex items-center space-x-3">
              <Calendar size={20} className="text-gray-400" />
              <div>
                <p className="font-medium text-white">{formatDate(holiday.holiday_date)}</p>
                <p className="text-sm text-gray-400">{holiday.description}</p>
              </div>
            </div>
            <button onClick={() => handleDeleteHoliday(holiday.id)} className="text-red-500 hover:text-red-400">
              <Trash size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
