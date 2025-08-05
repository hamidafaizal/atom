import React, { useState, useEffect } from 'react';
import { CalendarDays, Briefcase, Clock, DollarSign } from 'lucide-react';
import { supabase } from '../supabaseClient';

// Gaji.jsx: Halaman untuk melihat informasi gaji dan absensi.
export default function Gaji() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [salaryInfo, setSalaryInfo] = useState({ final_salary: 0, workDays: 0, totalWorkMinutes: 0 }); // [FIX] Inisialisasi dengan data default
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateRealtimeSalary = async () => {
      setLoading(true);
      // [FIX] Tidak mereset ke null, agar UI tetap konsisten
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSalaryInfo({ final_salary: 0, workDays: 0, totalWorkMinutes: 0 });
        setLoading(false);
        return;
      }

      const date = new Date(selectedMonth);
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().slice(0, 10);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().slice(0, 10);
      
      console.log(`Menghitung gaji real-time untuk ${user.id} pada periode ${startDate} - ${endDate}`);

      const { data: employee, error: employeeError } = await supabase
        .from('employees')
        .select('salary_model_id, salary_models(salary_type)')
        .eq('id', user.id)
        .single();

      if (employeeError || !employee?.salary_model_id) {
        console.error('Karyawan tidak memiliki model gaji:', employeeError?.message);
        setSalaryInfo({ final_salary: 0, workDays: 0, totalWorkMinutes: 0 });
        setLoading(false);
        return;
      }

      const modelType = employee.salary_models.salary_type;
      let rpcName = '';
      if (modelType === 'bulanan') {
        rpcName = 'calculate_monthly_salary';
      } else if (modelType === 'perJam') {
        rpcName = 'calculate_hourly_salary';
      } else {
        setSalaryInfo({ final_salary: 0, workDays: 0, totalWorkMinutes: 0 });
        setLoading(false);
        return;
      }

      const [salaryResponse, attendanceResponse] = await Promise.all([
        supabase.rpc(rpcName, { p_employee_id: user.id, p_start_date: startDate, p_end_date: endDate }),
        supabase.from('attendance').select('check_in_time, check_out_time').eq('employee_id', user.id).gte('check_in_time', startDate).lte('check_in_time', new Date(endDate).toISOString().replace('T00:00:00.000Z', 'T23:59:59.999Z'))
      ]);

      const { data: final_salary, error: salaryError } = salaryResponse;
      const { data: attendance_records, error: attendanceError } = attendanceResponse;

      if (salaryError || attendanceError) {
        console.error('Error saat kalkulasi:', salaryError?.message || attendanceError?.message);
        setSalaryInfo({ final_salary: 0, workDays: 0, totalWorkMinutes: 0 });
        setLoading(false);
        return;
      }

      const workDays = new Set(attendance_records.map(att => new Date(att.check_in_time).toDateString())).size;
      const totalWorkMinutes = attendance_records.reduce((sum, att) => {
        if (att.check_in_time && att.check_out_time) {
          return sum + (new Date(att.check_out_time) - new Date(att.check_in_time));
        }
        return sum;
      }, 0) / (1000 * 60);

      console.log('Perhitungan selesai:', { final_salary, workDays, totalWorkMinutes });
      setSalaryInfo({ final_salary, workDays, totalWorkMinutes });
      setLoading(false);
    };

    if (selectedMonth) {
      calculateRealtimeSalary();
    }
  }, [selectedMonth]);

  const formatCurrency = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0);
  const totalMinutes = salaryInfo?.totalWorkMinutes || 0;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);

  const stats = [
    { name: 'Total Masuk (Hari)', value: `${salaryInfo?.workDays || 0} Hari`, icon: Briefcase },
    { name: 'Total Jam Kerja', value: `${hours} Jam ${minutes} Menit`, icon: Clock },
    { name: 'Total Gaji Didapat', value: formatCurrency(salaryInfo?.final_salary), icon: DollarSign },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between rounded-lg bg-gray-800 p-4 shadow-lg backdrop-blur-md mb-6">
        <h1 className="text-xl font-bold text-gray-200">Informasi Gaji</h1>
        <div className="flex items-center space-x-2">
          <CalendarDays size={20} className="text-gray-400" />
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-md bg-gray-700 py-1 px-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* [FIX] Selalu tampilkan kartu statistik, baik saat loading maupun sudah ada data */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.name} className="flex items-center rounded-lg bg-gray-800 p-4 shadow-lg backdrop-blur-md transition-transform duration-200 hover:scale-105">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">{stat.name}</p>
              {loading ? (
                <div className="h-6 w-24 bg-gray-700 rounded animate-pulse mt-1"></div>
              ) : (
                <p className="text-xl font-semibold text-white">{stat.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
