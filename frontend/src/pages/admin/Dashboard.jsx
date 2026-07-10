import React, { useEffect, useState } from 'react';
import { Users, GraduationCap, BookOpen, Layers, Bell } from 'lucide-react';
import api from '../../api/client';

export default function Dashboard() {
  const [statsData, setStatsData] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    subjects: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/data/stats');
        setStatsData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: 'Total Students', value: statsData.students, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Teachers', value: statsData.teachers, icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Active Classes', value: statsData.classes, icon: Layers, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Subjects', value: statsData.subjects, icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm">Welcome back to SRAMS Admin Panel.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? <span className="loading loading-spinner loading-sm"></span> : stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Activities</h2>
            <button className="text-primary text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            <p className="text-gray-500 text-sm italic">No recent activities available from the server.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Quick Alerts</h2>
            <Bell className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
              <h4 className="font-semibold text-orange-800 text-sm">System Update</h4>
              <p className="text-xs text-orange-600 mt-1">APIs successfully connected to the frontend.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}