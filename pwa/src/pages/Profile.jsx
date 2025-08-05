import React, { useState, useEffect } from 'react';
import { Mail, Phone, User, Edit, Save, X, Landmark, Hash, UserSquare } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Import Supabase client

// Profile.jsx: Halaman untuk menampilkan dan mengedit profil karyawan.
export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bank_name: '',
    account_number: '',
    account_holder_name: ''
  });
  const [message, setMessage] = useState('');

  // Fungsi untuk mengambil data profil
  const fetchProfile = async () => {
    setLoading(true);
    console.log('Mulai mengambil data profil dari Supabase.');
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error mengambil profil:', error.message);
      } else {
        console.log('Data profil berhasil diambil:', data);
        setProfileData(data);
        setFormData({
          bank_name: data.bank_name || '',
          account_number: data.account_number || '',
          account_holder_name: data.account_holder_name || ''
        });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Menangani perubahan input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Menangani update data rekening
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    const { data, error } = await supabase
      .from('employees')
      .update({
        bank_name: formData.bank_name,
        account_number: formData.account_number,
        account_holder_name: formData.account_holder_name
      })
      .eq('id', profileData.id)
      .select()
      .single();

    if (error) {
      console.error('Error mengupdate profil:', error.message);
      setMessage('Gagal menyimpan data.');
    } else {
      console.log('Profil berhasil diupdate:', data);
      setProfileData(data);
      setIsEditing(false);
      setMessage('Data rekening berhasil disimpan!');
      setTimeout(() => setMessage(''), 3000);
    }
    setLoading(false);
  };

  const getInitials = (name) => {
    if (!name) return <User size={48} />;
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.slice(0, 2).toUpperCase();
  };

  if (loading && !profileData) {
    return <div className="p-6 text-center text-gray-400">Memuat profil...</div>;
  }

  if (!profileData) {
    return <div className="p-6 text-center text-gray-400">Gagal memuat profil.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-gray-200 mb-6">Profil Saya</h1>

      <div className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg shadow-lg backdrop-blur-md mb-6">
        <div className="h-24 w-24 rounded-full border-2 border-blue-500 bg-blue-600 flex items-center justify-center text-white text-4xl font-bold">
          {getInitials(profileData.full_name)}
        </div>
        <p className="mt-2 text-sm text-gray-400">ID Karyawan: {profileData.employee_id_text || 'N/A'}</p>
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-bold text-white">{profileData.full_name}</h2>
          <p className="text-gray-400">{profileData.position || 'Jabatan belum diatur'}</p>
        </div>
        <div className="mt-6 w-full space-y-4">
          <div className="flex items-center space-x-3 text-gray-400"><Mail size={20} /><p className="text-sm">{profileData.email}</p></div>
          <div className="flex items-center space-x-3 text-gray-400"><Phone size={20} /><p className="text-sm">{profileData.phone_number || 'Nomor HP belum diatur'}</p></div>
        </div>
      </div>

      <div className="p-6 bg-gray-800 rounded-lg shadow-lg backdrop-blur-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">Informasi Rekening Bank</h2>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm">
              <Edit size={16} /><span>Edit</span>
            </button>
          )}
        </div>
        {message && <p className="text-sm text-green-400 mb-4">{message}</p>}
        <form onSubmit={handleUpdate}>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400">Nama Bank</label>
                <input type="text" name="bank_name" value={formData.bank_name} onChange={handleInputChange} className="w-full mt-1 rounded-md bg-gray-700 py-2 px-3 text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-400">Nomor Rekening</label>
                <input type="text" name="account_number" value={formData.account_number} onChange={handleInputChange} className="w-full mt-1 rounded-md bg-gray-700 py-2 px-3 text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-400">Nama Pemilik Rekening</label>
                <input type="text" name="account_holder_name" value={formData.account_holder_name} onChange={handleInputChange} className="w-full mt-1 rounded-md bg-gray-700 py-2 px-3 text-white" />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsEditing(false)} className="flex items-center space-x-2 rounded-lg bg-gray-600 px-3 py-1 text-sm text-white hover:bg-gray-500"><X size={16} /><span>Batal</span></button>
                <button type="submit" disabled={loading} className="flex items-center space-x-2 rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:bg-blue-400"><Save size={16} /><span>{loading ? 'Menyimpan...' : 'Simpan'}</span></button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <InfoItem icon={Landmark} label="Nama Bank" value={profileData.bank_name} />
              <InfoItem icon={Hash} label="Nomor Rekening" value={profileData.account_number} />
              <InfoItem icon={UserSquare} label="Nama Pemilik" value={profileData.account_holder_name} />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-3">
    <Icon size={20} className="text-gray-400 flex-shrink-0" />
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm text-white font-medium">{value || 'Belum diatur'}</p>
    </div>
  </div>
);
