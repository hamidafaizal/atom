import React, { useState, useEffect } from 'react';
import { Plus, Trash } from 'lucide-react';
import TambahModelPenggajianModal from '../../modal/TambahModelPenggajianModal.jsx';
import { supabase } from '../../supabaseClient.js';

// ModelPenggajian.jsx: Halaman pengaturan untuk mengelola model penggajian.
export default function ModelPenggajian() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salaryModels, setSalaryModels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mengambil data model gaji
  const fetchSalaryModels = async () => {
    setLoading(true);
    console.log("Mengambil data model gaji dari Supabase."); // log untuk debugging
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from('salary_models')
        .select('*')
        .eq('admin_id', user.id);

      if (error) {
        console.error("Error mengambil model gaji:", error.message);
      } else {
        console.log("Model gaji berhasil diambil:", data);
        setSalaryModels(data);
      }
    }
    setLoading(false);
  };

  // Mengambil data saat komponen dimuat
  useEffect(() => {
    fetchSalaryModels();
  }, []);
  
  // Fungsi untuk menghapus model gaji
  const handleDelete = async (modelId) => {
    console.log(`Menghapus model gaji dengan ID: ${modelId}`);
    const { error } = await supabase
      .from('salary_models')
      .delete()
      .eq('id', modelId);
      
    if (error) {
      console.error('Error menghapus model gaji:', error.message);
    } else {
      console.log('Model gaji berhasil dihapus.');
      // Refresh data setelah menghapus
      fetchSalaryModels();
    }
  };

  // Fungsi untuk memformat angka menjadi format mata uang Rupiah
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
        <h2 className="text-xl font-semibold text-gray-200">Model Penggajian</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 rounded-lg bg-blue-600 px-3 py-1 text-sm text-white transition-colors duration-200 hover:bg-blue-700"
        >
          <Plus size={16} />
          <span>Tambah Model</span>
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {loading ? (
          <p className="text-center text-gray-400">Memuat model penggajian...</p>
        ) : salaryModels.length > 0 ? (
          salaryModels.map((model) => (
            <div key={model.id} className="flex justify-between items-start p-4 rounded-lg bg-gray-700 transition-colors duration-200 hover:bg-gray-600">
              <div className="flex-1">
                <p className="text-lg font-medium text-white">{model.model_name}</p>
                <p className="text-sm text-gray-400 capitalize">Jenis: {model.salary_type}</p>
                <div className="mt-2 text-xs text-gray-300 space-y-1 border-t border-gray-600 pt-2">
                  {model.base_salary > 0 && (
                    <p>Gaji Pokok: <span className="font-semibold">{formatCurrency(model.base_salary)}</span></p>
                  )}
                  {model.deduction_per_day > 0 && (
                    <p>Potongan per Hari: <span className="font-semibold">{formatCurrency(model.deduction_per_day)}</span></p>
                  )}
                  {model.overtime_bonus_per_hour > 0 && (
                    <p>Bonus Lembur per Jam: <span className="font-semibold">{formatCurrency(model.overtime_bonus_per_hour)}</span></p>
                  )}
                </div>
              </div>
              <div className="ml-4">
                <button onClick={() => handleDelete(model.id)} className="text-red-500 hover:text-red-400">
                  <Trash size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">Belum ada model penggajian yang dibuat.</p>
        )}
      </div>
      
      {/* Modal untuk menambah model penggajian */}
      <TambahModelPenggajianModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchSalaryModels} // Melewatkan fungsi fetch sebagai callback
      />
    </div>
  );
}
