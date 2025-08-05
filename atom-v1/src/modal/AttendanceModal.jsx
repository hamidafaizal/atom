import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// AttendanceModal.jsx: Modal untuk menambah atau mengedit data absensi oleh admin.
export default function AttendanceModal({ isOpen, onClose, onSuccess, employeeId, recordToEdit }) {
  const [date, setDate] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mengisi form jika dalam mode edit
  useEffect(() => {
    if (recordToEdit) {
      const checkInDate = new Date(recordToEdit.check_in_time);
      const checkOutDate = recordToEdit.check_out_time ? new Date(recordToEdit.check_out_time) : null;

      setDate(checkInDate.toISOString().split('T')[0]);
      setCheckIn(checkInDate.toTimeString().slice(0, 5));
      if (checkOutDate) {
        setCheckOut(checkOutDate.toTimeString().slice(0, 5));
      } else {
        setCheckOut('');
      }
    } else {
      // Reset form jika mode tambah
      setDate(new Date().toISOString().split('T')[0]);
      setCheckIn('');
      setCheckOut('');
    }
  }, [recordToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const checkInDateTime = new Date(`${date}T${checkIn}:00`).toISOString();
    const checkOutDateTime = checkOut ? new Date(`${date}T${checkOut}:00`).toISOString() : null;

    if (recordToEdit) {
      // --- Mode Edit ---
      console.log('Updating attendance:', { id: recordToEdit.id, check_in_time: checkInDateTime, check_out_time: checkOutDateTime });
      const { error: updateError } = await supabase
        .from('attendance')
        .update({ check_in_time: checkInDateTime, check_out_time: checkOutDateTime })
        .eq('id', recordToEdit.id);
      if (updateError) {
        setError(updateError.message);
      } else {
        onSuccess();
        onClose();
      }
    } else {
      // --- Mode Tambah ---
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Sesi admin tidak ditemukan. Silakan login ulang.");
        setLoading(false);
        return;
      }

      console.log('Adding new attendance:', { employee_id: employeeId, admin_id: user.id, check_in_time: checkInDateTime, check_out_time: checkOutDateTime });
      const { error: insertError } = await supabase
        .from('attendance')
        .insert({ 
          employee_id: employeeId, 
          admin_id: user.id, // [FIX] Menambahkan admin_id saat admin membuat absensi
          check_in_time: checkInDateTime, 
          check_out_time: checkOutDateTime 
        });
      if (insertError) {
        setError(insertError.message);
      } else {
        onSuccess();
        onClose();
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-md">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-6 text-white shadow-xl">
        <h2 className="mb-4 text-xl font-bold">{recordToEdit ? 'Edit Absensi' : 'Tambah Absensi'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">Tanggal</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-md border border-gray-700 bg-gray-700 p-2 text-white" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">Jam Masuk</label>
            <input type="time" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="mt-1 w-full rounded-md border border-gray-700 bg-gray-700 p-2 text-white" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">Jam Keluar</label>
            <input type="time" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="mt-1 w-full rounded-md border border-gray-700 bg-gray-700 p-2 text-white" />
          </div>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="rounded-lg bg-gray-600 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-gray-500">Batal</button>
            <button type="submit" disabled={loading} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-blue-700 disabled:bg-blue-400">{loading ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
