import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Clock, CheckCircle, UserRoundCheck, Clock3 } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../supabaseClient';

// Dashboard.jsx: Komponen halaman Dashboard yang menampilkan metrik utama dan data tambahan.
export default function Dashboard() {
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().slice(0, 10));
  
  const [stats, setStats] = useState({
    employeeCount: 0,
    totalSalary: 0,
    avgWorkHours: 0,
    presentToday: 0,
  });
  const [weeklyAttendanceData, setWeeklyAttendanceData] = useState([]);
  const [latestActivities, setLatestActivities] = useState([]);
  const [employeeSalaries, setEmployeeSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      console.log(`Mengambil data dashboard untuk periode: ${startDate} hingga ${endDate}`);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      // --- Ambil semua data yang diperlukan secara paralel ---
      const [employeeData, attendanceData, todayAttendanceData, salaryModelsData] = await Promise.all([
        supabase.from('employees').select('id, full_name, position, salary_model_id').eq('admin_id', user.id),
        supabase.from('attendance').select('employee_id, check_in_time, check_out_time').eq('admin_id', user.id).gte('check_in_time', startDate).lte('check_in_time', new Date(endDate).toISOString().replace('T00:00:00.000Z', 'T23:59:59.999Z')),
        supabase.from('attendance').select('*, employees(full_name)').eq('admin_id', user.id).gte('check_in_time', todayStart.toISOString()),
        supabase.from('salary_models').select('id, salary_type').eq('admin_id', user.id) // Ambil tipe dari semua model gaji
      ]);

      // --- Proses Data & Update State ---
      const employees = employeeData.data || [];
      const salaryModels = salaryModelsData.data || [];
      const employeeCount = employees.length;
      
      const presentToday = todayAttendanceData.data?.length || 0;
      const activities = [];
      todayAttendanceData.data?.forEach(record => {
        activities.push({ id: `${record.id}-in`, type: 'in', time: record.check_in_time, employee_name: record.employees.full_name });
        if (record.check_out_time) {
          activities.push({ id: `${record.id}-out`, type: 'out', time: record.check_out_time, employee_name: record.employees.full_name });
        }
      });
      activities.sort((a, b) => new Date(b.time) - new Date(a.time));
      setLatestActivities(activities);

      let totalWorkSeconds = 0;
      attendanceData.data?.forEach(att => {
        if (att.check_in_time && att.check_out_time) {
          totalWorkSeconds += new Date(att.check_out_time) - new Date(att.check_in_time);
        }
      });
      const avgWorkHours = employeeCount > 0 ? (totalWorkSeconds / 1000 / 3600) / employeeCount : 0;

      const weeklyData = {};
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        const dayString = day.toLocaleDateString('id-ID', { weekday: 'long' });
        weeklyData[dayString] = { name: dayString, Hadir: 0, 'Tidak Hadir': employeeCount };
      }
      attendanceData.data?.forEach(att => {
        const attDate = new Date(att.check_in_time);
        const dayString = attDate.toLocaleDateString('id-ID', { weekday: 'long' });
        if (weeklyData[dayString]) {
          weeklyData[dayString].Hadir += 1;
          weeklyData[dayString]['Tidak Hadir'] -= 1;
        }
      });
      setWeeklyAttendanceData(Object.values(weeklyData));
      
      // [FIX] Logika untuk memanggil kalkulator yang sesuai
      const salaryPromises = employees.map(async (employee) => {
        const model = salaryModels.find(m => m.id === employee.salary_model_id);
        if (!model) return { ...employee, salary: 0 };

        let rpcName = '';
        if (model.salary_type === 'bulanan') {
          rpcName = 'calculate_monthly_salary';
        } else if (model.salary_type === 'perJam') {
          rpcName = 'calculate_hourly_salary';
        } else {
          return { ...employee, salary: 0 };
        }

        const { data: salary, error } = await supabase.rpc(rpcName, {
          p_employee_id: employee.id, p_start_date: startDate, p_end_date: endDate
        });

        if (error) {
          console.error(`Error menghitung gaji (${rpcName}) untuk ${employee.full_name}:`, error);
          return { ...employee, salary: 0 };
        }
        
        return { ...employee, salary: salary || 0 };
      });

      const calculatedSalaries = await Promise.all(salaryPromises);
      setEmployeeSalaries(calculatedSalaries);
      const totalSalary = calculatedSalaries.reduce((sum, s) => sum + s.salary, 0);

      setStats({ employeeCount, totalSalary, avgWorkHours, presentToday });
      setLoading(false);
    };

    fetchDashboardData();
  }, [startDate, endDate]);

  const formatCurrency = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between rounded-lg bg-gray-800 p-4 shadow-lg mb-6">
        <h1 className="text-2xl font-bold text-gray-200">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-md bg-gray-700 py-1 px-2 text-sm text-white" />
          <span>-</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-md bg-gray-700 py-1 px-2 text-sm text-white" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} name="Jumlah Karyawan" value={stats.employeeCount} loading={loading} />
        <StatCard icon={DollarSign} name="Total Gaji (Periode Dipilih)" value={formatCurrency(stats.totalSalary)} loading={loading} />
        <StatCard icon={Clock} name="Rata-rata Jam Kerja (Periode Dipilih)" value={`${stats.avgWorkHours.toFixed(1)} Jam`} loading={loading} />
        <StatCard icon={CheckCircle} name="Hadir Hari Ini" value={stats.presentToday} loading={loading} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-gray-800 p-4 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">Grafik Kehadiran (Periode Dipilih)</h2>
          <div className="mt-4 w-full h-64">
            {loading ? <p className="text-center text-gray-400">Memuat grafik...</p> : 
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={weeklyAttendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: 'none' }} />
                <Legend />
                <Bar dataKey="Hadir" fill="#10b981" />
                <Bar dataKey="Tidak Hadir" fill="#ef4444" />
              </RechartsBarChart>
            </ResponsiveContainer>}
          </div>
        </div>

        <div className="rounded-lg bg-gray-800 p-4 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">Aktivitas Terbaru Hari Ini</h2>
          <div className="mt-4 max-h-64 overflow-y-auto">
            {loading ? <p className="text-center text-gray-400">Memuat aktivitas...</p> :
            <ul className="space-y-4">
              {latestActivities.length > 0 ? latestActivities.map(activity => (
                <li key={activity.id} className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-white">
                    {activity.type === 'out' ? <Clock3 size={20} /> : <UserRoundCheck size={20} />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-200">{activity.employee_name}</p>
                    <p className="text-sm text-gray-400">
                      {activity.type === 'out' ? 'Absen Keluar' : 'Absen Masuk'} ({new Date(activity.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })})
                    </p>
                  </div>
                </li>
              )) : <p className="text-center text-gray-400">Tidak ada aktivitas hari ini.</p>}
            </ul>}
          </div>
        </div>
      </div>
      
      <div className="mt-6 rounded-lg bg-gray-800 p-4 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">Total Gaji Karyawan (Periode Dipilih)</h2>
        <div className="mt-4 max-h-64 overflow-y-auto overflow-x-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700 sticky top-0">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Nama</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Jabatan</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Gaji</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-800">
              {loading ? (
                <tr><td colSpan="3" className="text-center py-4 text-gray-400">Menghitung gaji...</td></tr>
              ) : employeeSalaries.map((employee) => (
                <tr key={employee.id} className="transition-colors duration-200 hover:bg-gray-700">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">{employee.full_name}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">{employee.position || 'N/A'}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">{formatCurrency(employee.salary)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Komponen kecil untuk menampilkan kartu statistik
const StatCard = ({ icon: Icon, name, value, loading }) => (
  <div className="flex items-center rounded-lg bg-gray-800 p-4 shadow-lg">
    <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-400">{name}</p>
      {loading ? <div className="h-6 w-24 bg-gray-700 rounded animate-pulse mt-1"></div> : <p className="text-xl font-semibold text-white">{value}</p>}
    </div>
  </div>
);
