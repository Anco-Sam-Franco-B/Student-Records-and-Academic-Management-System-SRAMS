import React, { useEffect, useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import api from '../../api/client';

export default function Academics() {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await api.get('/data/academic_years');
        setYears(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch academic years", error);
      } finally {
        setLoading(false);
      }
    };
    fetchYears();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Calendar</h1>
          <p className="text-gray-500 text-sm">Manage academic years, terms, and dates.</p>
        </div>
        <button className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Academic Year
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold mb-4">Academic Years</h3>
        
        {loading ? (
          <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>
        ) : years.length === 0 ? (
          <div className="text-center text-gray-500 py-4">No academic years found.</div>
        ) : (
          <div className="space-y-4">
            {years.map((year) => (
              <div key={year.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{year.name}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(year.start_date).toLocaleDateString()} - {new Date(year.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                   {year.is_current && <span className="badge badge-success">Current</span>}
                  <button className="btn btn-ghost btn-sm text-primary">Edit Dates</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
