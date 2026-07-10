import React, { useEffect, useState } from 'react';
import { CheckSquare } from 'lucide-react';
import api from '../../api/client';

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await api.get('/data/attendance');
        setAttendance(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch attendance", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Records</h1>
          <p className="text-gray-500 text-sm">Monitor student and teacher attendance records.</p>
        </div>
        <button className="btn btn-outline">
          <CheckSquare className="w-4 h-4 mr-2" />
          Generate Report
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
             <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>
          ) : (
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-50 text-gray-500">
                  <th>Date</th>
                  <th>Student ID</th>
                  <th>Teacher ID</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500">No attendance records found.</td>
                  </tr>
                ) : (
                  attendance.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                      <td>{new Date(record.attendance_date).toLocaleDateString()}</td>
                      <td>{record.student_id ? record.student_id.substring(0,8) : 'N/A'}</td>
                      <td>{record.teacher_id ? record.teacher_id.substring(0,8) : 'N/A'}</td>
                      <td>
                        <span className={`badge ${record.status === 'PRESENT' ? 'badge-success' : 'badge-error'} badge-sm`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
