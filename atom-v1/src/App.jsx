import { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DataKaryawan from './pages/DataKaryawan.jsx';
import DetailKaryawan from './pages/DetailKaryawan.jsx';
import ExportSlipGaji from './pages/ExportSlipGaji.jsx';
import Notifikasi from './pages/Notifikasi.jsx';
import Pengaturan from './pages/Pengaturan.jsx'; // Mengimpor komponen Pengaturan

// App.jsx: Komponen utama aplikasi dengan layout flexbox menggunakan Tailwind
function App() {
  // State untuk melacak halaman yang aktif. Nilai default adalah 'dashboard'.
  const [activePage, setActivePage] = useState('dashboard');
  // State baru untuk melacak ID karyawan yang dipilih.
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  
  console.log('App dirender. Halaman aktif:', activePage); // log untuk debugging

  return (
    // Container utama dengan padding kiri untuk memberikan ruang bagi sidebar yang fixed
    <div className="pl-[70px] min-h-screen">
      {/* Sidebar: Menampilkan komponen sidebar di sisi kiri */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Membungkus konten utama dengan ErrorBoundary */}
      <ErrorBoundary>
        <div className="flex-1">
          {/* Konten utama yang ditampilkan berdasarkan halaman yang aktif */}
          {activePage === 'dashboard' && <Dashboard />}
          {activePage === 'employees' && <DataKaryawan setActivePage={setActivePage} setSelectedEmployeeId={setSelectedEmployeeId} />}
          {activePage === 'detailKaryawan' && <DetailKaryawan employeeId={selectedEmployeeId} setActivePage={setActivePage} />}
          {activePage === 'export' && <ExportSlipGaji />}
          {activePage === 'notifications' && <Notifikasi />}
          {activePage === 'settings' && <Pengaturan />}
        </div>
      </ErrorBoundary>
    </div>
  );
}

export default App;
