import React, { useState } from 'react';

// TambahModelPenggajianModal.jsx: Komponen modal untuk menambah model penggajian baru.
export default function TambahModelPenggajianModal({ isOpen, onClose }) {
  // State untuk data form
  const [modelName, setModelName] = useState('');
  const [jenisGaji, setJenisGaji] = useState('bulanan');

  // State untuk input dinamis
  const [nominalGaji, setNominalGaji] = useState('');
  const [potongan, setPotongan] = useState('');
  const [bonusLembur, setBonusLembur] = useState('');

  console.log('TambahModelPenggajianModal dirender. isOpen:', isOpen); // log untuk debugging

  if (!isOpen) return null;

  const handleJenisGajiChange = (e) => {
    console.log('Jenis gaji diubah menjadi:', e.target.value);
    setJenisGaji(e.target.value);
    // Reset input saat jenis gaji berubah
    setNominalGaji('');
    setPotongan('');
    setBonusLembur('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form disubmit dengan data:', { modelName, jenisGaji, nominalGaji, potongan, bonusLembur });
    // Logika untuk menyimpan data akan ditambahkan di sini
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-md">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-6 text-white shadow-xl">
        <h2 className="mb-4 text-xl font-bold">Tambah Model Penggajian</h2>
        <form onSubmit={handleSubmit}>
          {/* Input Nama Model */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">Nama Model Gaji</label>
            <input
              type="text"
              placeholder="Masukkan nama model gaji"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-700 bg-gray-700 p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          {/* Dropdown Jenis Gaji */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">Jenis Gaji</label>
            <select
              value={jenisGaji}
              onChange={handleJenisGajiChange}
              className="mt-1 w-full rounded-md border border-gray-700 bg-gray-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="bulanan">Bulanan</option>
              <option value="harian">Harian</option>
              <option value="perJam">Per Jam</option>
            </select>
          </div>

          {/* Input Dinamis berdasarkan Jenis Gaji */}
          {jenisGaji === 'bulanan' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400">Nominal Gaji</label>
                <input
                  type="text"
                  placeholder="Masukkan nominal gaji"
                  value={nominalGaji}
                  onChange={(e) => setNominalGaji(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-700 bg-gray-700 p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400">Potongan Tidak Masuk</label>
                <input
                  type="text"
                  placeholder="Masukkan potongan per hari"
                  value={potongan}
                  onChange={(e) => setPotongan(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-700 bg-gray-700 p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400">Bonus Lembur per Jam</label>
                <input
                  type="text"
                  placeholder="Masukkan bonus lembur per jam"
                  value={bonusLembur}
                  onChange={(e) => setBonusLembur(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-700 bg-gray-700 p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </>
          )}

          {jenisGaji === 'harian' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400">Nominal Gaji</label>
                <input
                  type="text"
                  placeholder="Masukkan nominal gaji"
                  value={nominalGaji}
                  onChange={(e) => setNominalGaji(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-700 bg-gray-700 p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400">Bonus Lembur</label>
                <input
                  type="text"
                  placeholder="Masukkan bonus lembur"
                  value={bonusLembur}
                  onChange={(e) => setBonusLembur(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-700 bg-gray-700 p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </>
          )}

          {jenisGaji === 'perJam' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400">Nominal Gaji</label>
              <input
                type="text"
                placeholder="Masukkan nominal gaji"
                value={nominalGaji}
                onChange={(e) => setNominalGaji(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-700 bg-gray-700 p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-600 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-gray-500"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-blue-700"
            >
              Tambah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
