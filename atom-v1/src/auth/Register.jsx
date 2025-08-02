import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Eye, EyeOff } from 'lucide-react';

// Register.jsx: Halaman untuk registrasi admin baru
export default function Register({ setActivePage }) {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  console.log('Halaman Register Admin dirender.'); // log untuk debugging

  // Fungsi untuk menangani proses registrasi admin
  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== verifyPassword) {
      setError('Password tidak cocok.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    console.log('Mencoba mendaftar admin dengan email:', email); // log untuk debugging

    // Memanggil signUp dengan menyertakan company_name di metadata
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          // Data ini akan ditangkap oleh trigger 'handle_new_user' di Supabase
          company_name: companyName,
        },
      },
    });

    if (error) {
      console.error('Error registrasi admin:', error.message); // log untuk debugging
      setError(error.message);
    } else {
      console.log('Registrasi admin berhasil, cek email untuk verifikasi.'); // log untuk debugging
      setSuccess('Registrasi berhasil! Silakan cek email Anda untuk verifikasi.');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <img src="/logoatom.svg" alt="Atom Logo" className="w-16 h-16 mb-2" />
          <h1 className="text-2xl font-bold text-white">Atom Absensi</h1>
        </div>
        <form onSubmit={handleRegister} className="space-y-6">
          <input
            type="text"
            placeholder="Nama Perusahaan"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-white">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="relative">
            <input
              type={showVerifyPassword ? 'text' : 'password'}
              placeholder="Verifikasi Password"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
              className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button type="button" onClick={() => setShowVerifyPassword(!showVerifyPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-white">
              {showVerifyPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-500">{success}</p>}
          <button type="submit" disabled={loading} className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            {loading ? 'Loading...' : 'Register'}
          </button>
        </form>
        <p className="text-sm text-center text-gray-400">
          Sudah punya akun?{' '}
          <button onClick={() => setActivePage('login')} className="font-semibold text-blue-500 hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
