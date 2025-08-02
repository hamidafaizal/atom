import React from 'react';
import { X, Copy } from 'lucide-react';

// VerificationCodeModal.jsx: Modal untuk menampilkan kode verifikasi kepada admin.
export default function VerificationCodeModal({ isOpen, onClose, code, message }) {
  console.log('VerificationCodeModal dirender. isOpen:', isOpen); // log untuk debugging

  if (!isOpen) return null;

  // Fungsi untuk menyalin kode ke clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    console.log('Kode disalin ke clipboard:', code); // log untuk debugging
    // Anda bisa menambahkan notifikasi "Copied!" di sini jika mau
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-md">
      <div className="w-full max-w-sm rounded-lg bg-gray-800 p-6 text-white shadow-xl text-center">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <h2 className="mb-4 text-xl font-bold">Kode Verifikasi Karyawan</h2>
        <p className="mb-6 text-gray-400">{message}</p>
        <div className="flex items-center justify-center space-x-2 rounded-lg bg-gray-700 p-4">
          <p className="text-4xl font-bold tracking-widest text-white">{code}</p>
          <button onClick={copyToClipboard} className="text-gray-400 hover:text-white">
            <Copy size={24} />
          </button>
        </div>
        <p className="mt-4 text-xs text-gray-500">Kode ini akan kedaluwarsa dalam 24 jam.</p>
      </div>
    </div>
  );
}
