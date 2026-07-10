import React, { useEffect, useState } from 'react';
import { Award, Plus } from 'lucide-react';
import api from '../../api/client';

export default function GradingSystem() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await api.get('/data/grading_system');
        setGrades(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch grades", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grading System</h1>
          <p className="text-gray-500 text-sm">Configure grade scales and boundaries.</p>
        </div>
        <button className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Grade
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
                  <th>Grade</th>
                  <th>Min Mark</th>
                  <th>Max Mark</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {grades.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">No grading rules configured.</td>
                  </tr>
                ) : (
                  grades.map((grade) => (
                    <tr key={grade.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="font-bold text-gray-900 text-lg">{grade.grade}</td>
                      <td>{grade.min_mark}%</td>
                      <td>{grade.max_mark}%</td>
                      <td><span className="badge badge-outline">{grade.remarks}</span></td>
                      <td>
                        <button className="btn btn-ghost btn-xs text-primary">Edit</button>
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
