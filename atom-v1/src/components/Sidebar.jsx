import { Home, Users, Download, Settings, Bell, User } from 'lucide-react';
import { useState } from 'react';
import ProfileModal from '../modal/ProfileModal.jsx'; // Mengimpor komponen modal profil

// Sidebar.jsx: Komponen sidebar dengan tombol-tombol navigasi berupa ikon menggunakan Tailwind
export default function Sidebar({ activePage, setActivePage }) {
  // state untuk mengontrol visibilitas modal profil
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  // state untuk mengontrol visibilitas dan konten tooltip
  const [tooltip, setTooltip] = useState({ text: '', visible: false });

  // array yang berisi data untuk setiap tombol navigasi
  const navItems = [
    { name: 'dashboard', icon: Home, tooltipText: 'Dashboard' },
    { name: 'employees', icon: Users, tooltipText: 'Data Karyawan' },
    { name: 'export', icon: Download, tooltipText: 'Export Slip Gaji' },
    { name: 'settings', icon: Settings, tooltipText: 'Pengaturan' },
    { name: 'notifications', icon: Bell, tooltipText: 'Notifikasi' },
  ];

  console.log('Sidebar dirender. Halaman aktif:', activePage); // log untuk debugging
  console.log('Status ProfileModal:', isProfileModalOpen); // log untuk debugging

  // Fungsi untuk menangani klik ikon profil
  const handleProfileClick = () => {
    console.log('Tombol profile diklik.');
    setIsProfileModalOpen(!isProfileModalOpen); // Toggle visibilitas modal
  };

  return (
    // Menggunakan kelas Tailwind untuk styling sidebar
    <div className="fixed top-0 left-0 z-10 flex flex-col w-[70px] h-screen p-2 shadow-lg backdrop-blur-md" style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
      {/* Logo Atom ditempatkan di bagian atas sidebar */}
      <div className="mb-4 flex justify-center items-center p-3">
        <img src="/logoatom.svg" alt="Atom Logo" className="h-8 w-8" />
      </div>

      <nav className="flex-1">
        <ul className="list-none p-0 m-0">
          {navItems.map((item) => (
            <li key={item.name} className="relative mb-4">
              <a
                href={`#${item.name}`}
                // Menggunakan kelas Tailwind dinamis untuk tombol aktif
                className={`group flex justify-center items-center p-3 rounded-lg text-gray-400 transition-colors duration-200 focus:outline-none
                  ${activePage === item.name ? 'text-white backdrop-blur-sm bg-gray-800' : 'hover:bg-gray-800 hover:text-white'}`}
                onClick={() => {
                  console.log(`Tombol ${item.name} diklik.`);
                  setActivePage(item.name); // Mengubah state halaman melalui prop
                  setIsProfileModalOpen(false); // Tutup modal saat tombol lain diklik
                }}
                onMouseEnter={() => setTooltip({ text: item.tooltipText, visible: true })}
                onMouseLeave={() => setTooltip({ ...tooltip, visible: false })}
              >
                <item.icon size={24} />
              </a>
              {/* Tooltip melayang di samping ikon */}
              {tooltip.visible && tooltip.text === item.tooltipText && (
                <div
                  className="absolute left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium text-white shadow-lg backdrop-blur-md transition-opacity duration-150"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  {tooltip.text}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
      {/* Tombol profil dipindahkan ke bagian bawah sidebar dan tidak memiliki gaya tombol navigasi */}
      <div className="mt-auto">
        <button
          className="flex justify-center items-center p-3 rounded-lg text-gray-400 transition-colors duration-200 hover:bg-gray-800 hover:text-white focus:outline-none"
          onClick={handleProfileClick}
        >
          <User size={24} />
        </button>
      </div>
      {/* Menampilkan modal profil jika isProfileModalOpen bernilai true */}
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </div>
  );
}
