import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, MapPin } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Import Supabase client

// Beranda.jsx: Halaman utama yang menampilkan jam digital, lokasi, dan tombol absen
export default function Beranda() {
  const [time, setTime] = useState(new Date());
  const [locationStatus, setLocationStatus] = useState({
    valid: false,
    text: 'Mencari lokasi...',
    coords: null,
  });
  const [attendanceStatus, setAttendanceStatus] = useState({
    hasClockedIn: false,
    attendanceId: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fungsi untuk memeriksa status absensi hari ini
  const checkTodaysAttendance = async () => {
    console.log('Memeriksa status absensi hari ini.'); // log untuk debugging
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data, error } = await supabase
      .from('attendance')
      .select('id, check_out_time')
      .eq('employee_id', user.id)
      .gte('check_in_time', today.toISOString())
      .lt('check_in_time', tomorrow.toISOString())
      .order('check_in_time', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error memeriksa absensi:', error.message);
    } else if (data) {
      if (data.check_out_time === null) {
        console.log('Sudah absen masuk, belum absen keluar.');
        setAttendanceStatus({ hasClockedIn: true, attendanceId: data.id });
      } else {
        console.log('Sudah absen masuk dan keluar hari ini.');
        setAttendanceStatus({ hasClockedIn: false, attendanceId: null });
      }
    } else {
        console.log('Belum ada absensi hari ini.');
        setAttendanceStatus({ hasClockedIn: false, attendanceId: null });
    }
  };

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    console.log('Jam digital dimulai.');
    checkTodaysAttendance();

    const officeLat = -7.876305;
    const officeLon = 111.480648;
    const radiusMeters = 100;

    const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
      const R = 6371e3;
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    if (!navigator.geolocation) {
      setLocationStatus({ valid: false, text: 'Geolocation tidak didukung.', coords: null });
      return;
    }

    const locationWatcher = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(`Lokasi perangkat: ${latitude}, ${longitude}`);
        const distance = getDistanceFromLatLonInMeters(latitude, longitude, officeLat, officeLon);
        console.log(`Jarak dari kantor: ${distance.toFixed(2)} meter`);

        if (distance <= radiusMeters) {
          setLocationStatus({ valid: true, text: 'Anda berada di zona kantor.', coords: { latitude, longitude } });
        } else {
          setLocationStatus({ valid: false, text: 'Anda tidak berada di zona kantor.', coords: null });
        }
      },
      (error) => {
        console.error('Error mendapatkan lokasi:', error.message);
        let text = 'Gagal mendapatkan lokasi.';
        if (error.code === 1) { text = 'Izin lokasi ditolak.'; }
        setLocationStatus({ valid: false, text: text, coords: null });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => {
      clearInterval(timerId);
      navigator.geolocation.clearWatch(locationWatcher);
      console.log('Jam digital dan location watcher dihentikan.');
    };
  }, []);

  // Fungsi pembulatan waktu
  const getRoundedTime = (direction) => {
    const now = new Date();
    const minutes = now.getMinutes();
    
    if (direction === 'in') {
      // Pembulatan maju untuk absen masuk
      const roundedMinutes = Math.ceil(minutes / 10) * 10;
      now.setMinutes(roundedMinutes, 0, 0);
    } else { // direction === 'out'
      // Pembulatan mundur untuk absen keluar
      const roundedMinutes = Math.floor(minutes / 10) * 10;
      now.setMinutes(roundedMinutes, 0, 0);
    }
    
    console.log(`Waktu asli: ${new Date().toLocaleTimeString()}, Waktu dibulatkan: ${now.toLocaleTimeString()}`); // log untuk debugging
    return now.toISOString();
  };

  const handleAttendance = async () => {
    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        alert('Gagal mendapatkan sesi pengguna.');
        setIsSubmitting(false);
        return;
    }

    if (attendanceStatus.hasClockedIn) {
      // --- Logika Absen Keluar ---
      console.log('Melakukan absen keluar untuk ID:', attendanceStatus.attendanceId);
      const checkOutTime = getRoundedTime('out');
      const { error } = await supabase
        .from('attendance')
        .update({ 
            check_out_time: checkOutTime,
            check_out_location: `POINT(${locationStatus.coords.longitude} ${locationStatus.coords.latitude})`
        })
        .eq('id', attendanceStatus.attendanceId);

      if (error) {
        alert(`Gagal absen keluar: ${error.message}`);
      } else {
        alert('Berhasil absen keluar!');
        setAttendanceStatus({ hasClockedIn: false, attendanceId: null });
      }
    } else {
      // --- Logika Absen Masuk ---
      console.log('Melakukan absen masuk.');
      const checkInTime = getRoundedTime('in');
      const { data, error } = await supabase
        .from('attendance')
        .insert({
            employee_id: user.id,
            check_in_time: checkInTime,
            check_in_location: `POINT(${locationStatus.coords.longitude} ${locationStatus.coords.latitude})`
        })
        .select('id')
        .single();
      
      if (error) {
        alert(`Gagal absen masuk: ${error.message}`);
      } else {
        alert('Berhasil absen masuk!');
        setAttendanceStatus({ hasClockedIn: true, attendanceId: data.id });
      }
    }
    setIsSubmitting(false);
  };

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const isButtonDisabled = !locationStatus.valid || isSubmitting;
  const buttonText = attendanceStatus.hasClockedIn ? 'Absen Keluar' : 'Absen Masuk';
  const ButtonIcon = attendanceStatus.hasClockedIn ? LogOut : LogIn;
  const buttonColor = attendanceStatus.hasClockedIn ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700';

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <div className="mb-8 rounded-xl bg-gray-800 p-8 shadow-xl backdrop-blur-md">
        <p className="text-6xl font-bold text-white">{`${hours}:${minutes}:${seconds}`}</p>
      </div>

      <div className={`mb-6 flex items-center space-x-2 rounded-full px-4 py-2 ${locationStatus.valid ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
        <MapPin size={20} className={`${locationStatus.valid ? 'text-green-400' : 'text-red-400'}`} />
        <p className={`text-sm ${locationStatus.valid ? 'text-green-200' : 'text-red-200'}`}>{locationStatus.text}</p>
      </div>

      <button
        onClick={handleAttendance}
        disabled={isButtonDisabled}
        className={`flex items-center space-x-2 rounded-lg px-8 py-4 text-white shadow-lg transition-colors duration-200 
          ${isButtonDisabled ? 'bg-gray-500 cursor-not-allowed' : buttonColor}`}
      >
        <ButtonIcon size={24} />
        <span className="font-semibold text-lg">{isSubmitting ? 'Memproses...' : buttonText}</span>
      </button>
    </div>
  );
}
