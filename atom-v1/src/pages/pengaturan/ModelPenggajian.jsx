import React, { useState } from 'react';
import { Plus, DollarSign } from 'lucide-react';
import TambahModelPenggajianModal from '../../modal/TambahModelPenggajianModal.jsx';

// ModelPenggajian.jsx: Halaman pengaturan untuk mengelola model penggajian.
export default function ModelPenggajian() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const salaryModels = [
    { id: 1, name: 'Model Gaji Bulanan', description: 'Model standar untuk gaji bulanan.', status: 'Aktif' },
    { id: 2, name: 'Model Gaji Project', description: 'Model khusus untuk karyawan berbasis proyek.', status: 'Tidak Aktif' },
  ];
  
  console.log('Halaman pengaturan ModelPenggajian dirender.'); // log untuk debugging
  
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
        {salaryModels.map((model) => (
          <div key={model.id} className="flex justify-between items-center p-4 rounded-lg bg-gray-700 transition-colors duration-200 hover:bg-gray-600">
            <div>
              <p className="text-lg font-medium text-white">{model.name}</p>
              <p className="text-sm text-gray-400">{model.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${model.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {model.status}
              </span>
              <button className="text-blue-500 hover:text-blue-400">
                <DollarSign size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Modal untuk menambah model penggajian */}
      <TambahModelPenggajianModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
