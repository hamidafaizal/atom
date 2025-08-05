import React, { useState, useEffect } from 'react';
import { Download, Calendar, RefreshCw } from 'lucide-react';
import { supabase } from '../supabaseClient';

// ExportSlipGaji.jsx: Komponen halaman untuk membuat dan mengekspor slip gaji.
export default function ExportSlipGaji() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');

  // Fungsi untuk mengambil data slip gaji yang sudah ada
  const fetchPayslips = async () => {
    setLoading(true);
    setMessage('');
    console.log(`Mengambil slip gaji untuk bulan: ${selectedMonth}`);

    const startDate = `${selectedMonth}-01`;
    
    const { data, error } = await supabase
      .from('payslips')
      .select(`
        id,
        period_start_date,
        final_salary,
        employees (
          full_name,
          position
        )
      `)
      .eq('period_start_date', startDate);

    if (error) {
      console.error('Error mengambil slip gaji:', error.message);
      setMessage(`Gagal memuat data: ${error.message}`);
    } else {
      console.log('Slip gaji berhasil diambil:', data);
      setPayslips(data);
    }
    setLoading(false);
  };

  // Ambil data setiap kali bulan yang dipilih berubah
  useEffect(() => {
    if (selectedMonth) {
      fetchPayslips();
    }
  }, [selectedMonth]);

  // Fungsi untuk memanggil RPC dan membuat slip gaji
  const handleGeneratePayslips = async () => {
    setGenerating(true);
    setMessage('');
    console.log(`Memulai pembuatan slip gaji untuk bulan: ${selectedMonth}`);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessage('Sesi admin tidak ditemukan.');
      setGenerating(false);
      return;
    }

    const startDate = `${selectedMonth}-01`;

    const rpcParams = {
      p_admin_id: user.id,
      p_period_start_date: startDate
    };
    console.log('Parameter yang dikirim ke RPC generate_payslips_for_period:', rpcParams);

    const { error } = await supabase.rpc('generate_payslips_for_period', rpcParams);

    if (error) {
      console.error('Error saat membuat slip gaji:', error.message);
      setMessage(`Gagal membuat slip gaji: ${error.message}`);
    } else {
      console.log('Slip gaji berhasil dibuat, memuat ulang data...');
      setMessage('Slip gaji berhasil dibuat!');
      fetchPayslips();
      setTimeout(() => setMessage(''), 4000);
    }
    setGenerating(false);
  };
  
  const formatCurrency = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0);

  // Fungsi untuk mendownload data sebagai CSV
  const handleDownload = (dataToDownload) => {
    if (!dataToDownload || dataToDownload.length === 0) {
      alert('Tidak ada data untuk di-download.');
      return;
    }
    console.log('Memulai proses download CSV...');

    // Header untuk file CSV
    const headers = ["Nama Karyawan", "Jabatan", "Periode", "Total Gaji"];
    
    // Mengubah data JSON menjadi baris CSV
    const csvRows = dataToDownload.map(slip => {
      const name = `"${slip.employees.full_name}"`;
      const position = `"${slip.employees.position || 'N/A'}"`;
      const period = new Date(slip.period_start_date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
      const salary = slip.final_salary;
      return [name, position, `"${period}"`, salary].join(',');
    });

    // Menggabungkan header dan baris
    const csvString = [headers.join(','), ...csvRows].join('\n');

    // Membuat file dan memicu download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const fileName = dataToDownload.length > 1 ? `semua_slip_gaji_${selectedMonth}.csv` : `slip_gaji_${dataToDownload[0].employees.full_name.replace(' ', '_')}_${selectedMonth}.csv`;
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('File CSV berhasil dibuat dan di-download.');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-200">Export Slip Gaji</h1>
        <div className="flex items-center space-x-2">
          <Calendar size={20} className="text-gray-400" />
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-md bg-gray-700 py-1 px-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button 
            onClick={handleGeneratePayslips} 
            disabled={generating}
            className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-blue-700 disabled:bg-blue-400"
          >
            <RefreshCw size={16} className={generating ? 'animate-spin' : ''} />
            <span>{generating ? 'Memproses...' : 'Generate Gaji'}</span>
          </button>
          <button 
            onClick={() => handleDownload(payslips)} 
            disabled={payslips.length === 0}
            className="flex items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-green-700 disabled:bg-gray-500"
          >
            <Download size={16} />
            <span>Download Semua</span>
          </button>
        </div>
      </div>
      
      {message && <p className="text-center text-green-400 mb-4">{message}</p>}

      <div className="mt-6 overflow-hidden rounded-lg bg-gray-800 shadow-lg">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Nama Karyawan</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Jabatan</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Total Gaji</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Aksi</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-800">
            {loading ? (
              <tr><td colSpan="4" className="text-center py-4 text-gray-400">Memuat data slip gaji...</td></tr>
            ) : payslips.length > 0 ? (
              payslips.map((slip) => (
                <tr key={slip.id} className="transition-colors duration-200 hover:bg-gray-700">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">{slip.employees.full_name}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">{slip.employees.position || 'N/A'}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-white">{formatCurrency(slip.final_salary)}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button onClick={() => handleDownload([slip])} className="text-blue-500 hover:text-blue-400">
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="text-center py-4 text-gray-400">Tidak ada data slip gaji untuk periode ini. Coba generate terlebih dahulu.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
