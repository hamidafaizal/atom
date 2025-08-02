import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Eye, EyeOff } from 'lucide-react';

// Register.jsx: Halaman untuk registrasi pengguna baru PWA dengan kode verifikasi
export default function Register({ setActivePage }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  console.log('Halaman Register PWA dirender.'); // log untuk debugging

  // Fungsi untuk menangani proses registrasi
  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== verifyPassword) {
      setError('Password tidak cocok.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 1. Validasi kode verifikasi
      console.log('Memvalidasi kode:', verificationCode); // log untuk debugging
      const { data: codeData, error: codeError } = await supabase
        .from('verification_codes')
        .select('id, admin_id, is_used')
        .eq('code', verificationCode)
        .single();

      if (codeError && codeError.code !== 'PGRST116') throw new Error('Terjadi kesalahan saat validasi kode.');
      if (!codeData) throw new Error('Kode verifikasi tidak valid.');
      if (codeData.is_used) throw new Error('Kode verifikasi sudah digunakan.');

      // 2. Jika kode valid, daftarkan pengguna baru
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            admin_id: codeData.admin_id,
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!user) throw new Error('Gagal membuat pengguna.');

      // 3. [PERBAIKAN] Panggil fungsi RPC untuk mengklaim kode
      console.log('Pengguna terdaftar. Memanggil RPC untuk klaim kode:', verificationCode);
      const { data: rpcData, error: rpcError } = await supabase.rpc('claim_verification_code', {
        code_to_claim: verificationCode
      });

      if (rpcError) {
        console.error('GAGAL KLAIM KODE (RPC)! Detail Error:', rpcError);
      } else if (rpcData && !rpcData.success) {
        console.warn('Gagal klaim kode:', rpcData.message);
      } else {
        console.log('Berhasil update status kode verifikasi via RPC.');
      }

      console.log('Registrasi dan penautan berhasil.');
      setSuccess('Registrasi berhasil! Silakan cek email Anda untuk verifikasi dan kemudian login.');

    } catch (err) {
      console.error('Error selama proses registrasi:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-sm p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt="Atom Logo" className="w-16 h-16 mb-2" />
          <h1 className="text-2xl font-bold text-white">Atom Absensi</h1>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
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
          <input
            type="tel"
            placeholder="Nomer HP"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Kode Verifikasi"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
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
            Masuk
          </button>
        </p>
      </div>
    </div>
  );
}
