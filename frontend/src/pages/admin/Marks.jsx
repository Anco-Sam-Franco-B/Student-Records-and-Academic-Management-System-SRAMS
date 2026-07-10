import React, { useEffect, useState } from 'react';
import { PenTool, Plus } from 'lucide-react';
import api from '../../api/client';

export default function Marks() {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const response = await api.get('/data/marks');
        setMarks(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch marks", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMarks();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Marks</h1>
          <p className="text-gray-500 text-sm">View and record student scores for assessments.</p>
        </div>
        <button className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Enter Marks
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
                  <th>Student ID</th>
                  <th>Assessment ID</th>
                  <th>Teacher ID</th>
                  <th>Marks Scored</th>
                </tr>
              </thead>
              <tbody>
                {marks.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500">No marks recorded.</td>
                  </tr>
                ) : (
                  marks.map((mark) => (
                    <tr key={mark.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="font-medium text-gray-900">{mark.student_id ? mark.student_id.substring(0,8) : 'N/A'}</td>
                      <td>{mark.assessment_id ? mark.assessment_id.substring(0,8) : 'N/A'}</td>
                      <td>{mark.teacher_id ? mark.teacher_id.substring(0,8) : 'N/A'}</td>
                      <td className="font-bold text-blue-600">{mark.marks}</td>
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
