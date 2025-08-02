import React from 'react';
import Dashboard from '../pages/Dashboard.jsx';
import DataKaryawan from '../pages/DataKaryawan.jsx';
import DetailKaryawan from '../pages/DetailKaryawan.jsx';
import ExportSlipGaji from '../pages/ExportSlipGaji.jsx';
import Notifikasi from '../pages/Notifikasi.jsx';
import Pengaturan from '../pages/Pengaturan.jsx';

// AppRoutes.jsx: Komponen untuk mengatur rute halaman setelah pengguna login (rute privat)
export default function AppRoutes({ activePage, setActivePage, selectedEmployeeId, setSelectedEmployeeId }) {
  console.log('AppRoutes (Private) dirender. Halaman aktif:', activePage); // log untuk debugging

  switch (activePage) {
    case 'dashboard':
      return <Dashboard />;
    case 'employees':
      return <DataKaryawan setActivePage={setActivePage} setSelectedEmployeeId={setSelectedEmployeeId} />;
    case 'detailKaryawan':
      return <DetailKaryawan employeeId={selectedEmployeeId} setActivePage={setActivePage} />;
    case 'export':
      return <ExportSlipGaji />;
    case 'notifications':
      return <Notifikasi />;
    case 'settings':
      return <Pengaturan />;
    default:
      // Arahkan ke dashboard jika halaman tidak valid setelah login
      return <Dashboard />;
  }
}
