import React, { useState, useEffect } from 'react';
import { Download, Calendar, RefreshCw, Trash } from 'lucide-react'; // Menambahkan ikon Trash
import { supabase } from '../supabaseClient';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ExportSlipGaji.jsx: Komponen halaman untuk membuat dan mengekspor slip gaji.
export default function ExportSlipGaji() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [payslips, setPayslips] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');

  // Fungsi untuk mengambil data slip gaji dan nama perusahaan
  const fetchData = async () => {
    setLoading(true);
    setMessage('');
    console.log(`Mengambil slip gaji untuk bulan: ${selectedMonth}`);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCompanyName(user.user_metadata?.display_name || 'Perusahaan Anda');
    }

    const startDate = `${selectedMonth}-01`;
    
    const { data, error } = await supabase
      .from('payslips')
      .select(`
        *,
        employees (
          *
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

  useEffect(() => {
    if (selectedMonth) {
      fetchData();
    }
  }, [selectedMonth]);

  const handleGeneratePayslips = async () => {
    setGenerating(true);
    setMessage('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessage('Sesi admin tidak ditemukan.');
      setGenerating(false);
      return;
    }
    const startDate = `${selectedMonth}-01`;
    const { error } = await supabase.rpc('generate_payslips_for_period', {
      p_admin_id: user.id,
      p_period_start_date: startDate
    });

    if (error) {
      setMessage(`Gagal membuat slip gaji: ${error.message}`);
    } else {
      setMessage('Slip gaji berhasil dibuat!');
      fetchData();
      setTimeout(() => setMessage(''), 4000);
    }
    setGenerating(false);
  };
  
  // Fungsi untuk menghapus slip gaji
  const handleDeletePayslip = async (slipId) => {
    console.log(`Menghapus slip gaji dengan ID: ${slipId}`);
    const { error } = await supabase
      .from('payslips')
      .delete()
      .eq('id', slipId);

    if (error) {
      console.error('Error menghapus slip gaji:', error.message);
      setMessage(`Gagal menghapus: ${error.message}`);
    } else {
      console.log('Slip gaji berhasil dihapus.');
      setMessage('Slip gaji berhasil dihapus.');
      fetchData(); // Muat ulang data setelah berhasil dihapus
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const formatCurrency = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0);

  // Fungsi untuk membuat dan mendownload PDF
  const handleDownloadPdf = (slip) => {
    console.log('Membuat PDF untuk slip:', slip);
    const doc = new jsPDF();
    const period = new Date(slip.period_start_date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    const details = slip.calculation_details;

    doc.setFontSize(18);
    doc.text(companyName, 14, 22);
    doc.setFontSize(12);
    doc.text("SLIP GAJI KARYAWAN", 14, 30);
    doc.setLineWidth(0.5);
    doc.line(14, 32, 196, 32);

    autoTable(doc, {
      startY: 40,
      body: [
        ['Nama Lengkap', `: ${slip.employees.full_name}`],
        ['Jabatan', `: ${slip.employees.position || 'N/A'}`],
        ['Periode Gaji', `: ${period}`],
      ],
      theme: 'plain',
      styles: { fontSize: 10 },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Deskripsi', 'Jumlah']],
      body: [
        ['Total Hari Kerja', `${details?.total_work_days || 0} Hari`],
        ['Total Jam Kerja', `${Math.floor((details?.total_work_minutes || 0) / 60)} Jam ${Math.round((details?.total_work_minutes || 0) % 60)} Menit`],
        ['Total Tidak Masuk', `${details?.total_absent_days || 0} Hari`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
    });
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      body: [
        [{ content: 'TOTAL GAJI DITERIMA', styles: { fontStyle: 'bold' } }, { content: formatCurrency(slip.final_salary), styles: { fontStyle: 'bold', halign: 'right' } }]
      ],
      theme: 'striped',
    });

    doc.setFontSize(10);
    doc.text("Informasi Pembayaran:", 14, doc.lastAutoTable.finalY + 15);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      body: [
        ['Nama Bank', `: ${slip.employees.bank_name || 'N/A'}`],
        ['Nomor Rekening', `: ${slip.employees.account_number || 'N/A'}`],
        ['Nama Pemilik', `: ${slip.employees.account_holder_name || 'N/A'}`],
      ],
      theme: 'plain',
      styles: { fontSize: 9 },
    });

    doc.save(`slip_gaji_${slip.employees.full_name.replace(' ', '_')}_${selectedMonth}.pdf`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-200">Export Slip Gaji</h1>
        <div className="flex items-center space-x-2">
          <Calendar size={20} className="text-gray-400" />
          <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="rounded-md bg-gray-700 py-1 px-2 text-sm text-white" />
          <button onClick={handleGeneratePayslips} disabled={generating} className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:bg-blue-400">
            <RefreshCw size={16} className={generating ? 'animate-spin' : ''} />
            <span>{generating ? 'Memproses...' : 'Generate Gaji'}</span>
          </button>
        </div>
      </div>
      
      {message && <p className="text-center text-green-400 mb-4">{message}</p>}

      <div className="mt-6 overflow-hidden rounded-lg bg-gray-800 shadow-lg">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Nama Karyawan</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Jabatan</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Total Gaji</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-300">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-800">
            {loading ? (
              <tr><td colSpan="4" className="text-center py-4 text-gray-400">Memuat data...</td></tr>
            ) : payslips.length > 0 ? (
              payslips.map((slip) => (
                <tr key={slip.id} className="transition-colors duration-200 hover:bg-gray-700">
                  <td className="px-6 py-4 text-sm font-medium text-white">{slip.employees.full_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{slip.employees.position || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-white">{formatCurrency(slip.final_salary)}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                    <button onClick={() => handleDownloadPdf(slip)} className="text-blue-500 hover:text-blue-400">
                      <Download size={18} />
                    </button>
                    <button onClick={() => handleDeletePayslip(slip.id)} className="text-red-500 hover:text-red-400">
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="text-center py-4 text-gray-400">Tidak ada data. Coba generate.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
