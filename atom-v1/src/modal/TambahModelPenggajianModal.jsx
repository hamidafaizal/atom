import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

// TambahModelPenggajianModal.jsx: Komponen modal untuk menambah model penggajian baru.
export default function TambahModelPenggajianModal({ isOpen, onClose, onSuccess }) {
  const [modelName, setModelName] = useState('');
  const [jenisGaji, setJenisGaji] = useState('bulanan');
  const [nominalGaji, setNominalGaji] = useState('');
  const [potongan, setPotongan] = useState('');
  const [bonusLembur, setBonusLembur] = useState('');
  const [workHours, setWorkHours] = useState('8'); // State baru untuk jam kerja standar
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleJenisGajiChange = (e) => {
    setJenisGaji(e.target.value);
    setNominalGaji('');
    setPotongan('');
    setBonusLembur('');
    setWorkHours('8'); // Reset ke default
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        setError('Tidak dapat memverifikasi pengguna. Silakan login kembali.');
        setLoading(false);
        return;
    }

    const dataToInsert = {
        admin_id: user.id,
        model_name: modelName,
        salary_type: jenisGaji,
        base_salary: parseFloat(nominalGaji) || 0,
        deduction_per_day: jenisGaji === 'bulanan' ? parseFloat(potongan) || 0 : 0,
        overtime_bonus_per_hour: parseFloat(bonusLembur) || 0,
        work_hours_per_day: jenisGaji === 'bulanan' ? parseFloat(workHours) || 8 : null, // Menyimpan jam kerja
    };

    console.log('Data yang akan dikirim ke Supabase:', dataToInsert);

    const { error: insertError } = await supabase
      .from('salary_models')
      .insert([dataToInsert]);

    if (insertError) {
      setError(insertError.message);
    } else {
      onSuccess();
      onClose();
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-md">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-6 text-white shadow-xl">
        <h2 className="mb-4 text-xl font-bold">Tambah Model Penggajian</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">Nama Model Gaji</label>
            <input type="text" placeholder="Cth: Gaji Pokok Bulanan" value={modelName} onChange={(e) => setModelName(e.target.value)} className="mt-1 w-full rounded-md border border-gray-700 bg-gray-700 p-2 text-white" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">Jenis Gaji</label>
            <select value={jenisGaji} onChange={handleJenisGajiChange} className="mt-1 w-full rounded-md border border-gray-700 bg-gray-700 p-2 text-white">
              <option value="bulanan">Bulanan</option>
              <option value="harian">Harian</option>
              <option value="perJam">Per Jam</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">Nominal Gaji Pokok</label>
            <input type="number" placeholder="Masukkan nominal gaji" value={nominalGaji} onChange={(e) => setNominalGaji(e.target.value)} className="mt-1 w-full rounded-md border border-gray-700 bg-gray-700 p-2 text-white" required />
          </div>

          {jenisGaji === 'bulanan' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400">Jam Kerja Standar (per hari)</label>
                <input type="number" placeholder="Cth: 8" value={workHours} onChange={(e) => setWorkHours(e.target.value)} className="mt-1 w-full rounded-md border border-gray-700 bg-gray-700 p-2 text-white" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400">Potongan Tidak Masuk (per hari)</label>
                <input type="number" placeholder="Masukkan potongan per hari" value={potongan} onChange={(e) => setPotongan(e.target.value)} className="mt-1 w-full rounded-md border border-gray-700 bg-gray-700 p-2 text-white" />
              </div>
            </>
          )}

          {(jenisGaji === 'bulanan' || jenisGaji === 'harian') && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400">Bonus Lembur (per jam)</label>
              <input type="number" placeholder="Masukkan bonus lembur per jam" value={bonusLembur} onChange={(e) => setBonusLembur(e.target.value)} className="mt-1 w-full rounded-md border border-gray-700 bg-gray-700 p-2 text-white" />
            </div>
          )}
          
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="rounded-lg bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-500">Batal</button>
            <button type="submit" disabled={loading} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:bg-blue-400">{loading ? 'Menyimpan...' : 'Tambah'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
