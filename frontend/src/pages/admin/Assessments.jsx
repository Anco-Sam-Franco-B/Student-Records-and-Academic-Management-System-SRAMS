import React, { useEffect, useState } from 'react';
import { FileSpreadsheet, Plus } from 'lucide-react';
import api from '../../api/client';

export default function Assessments() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await api.get('/data/assessments');
        setAssessments(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch assessments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assessments & Marks</h1>
          <p className="text-gray-500 text-sm">Manage exams, continuous assessments, and grades.</p>
        </div>
        <button className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Assessment
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
                  <th>Title</th>
                  <th>Subject ID</th>
                  <th>Teacher ID</th>
                  <th>Total Marks</th>
                </tr>
              </thead>
              <tbody>
                {assessments.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500">No assessments found.</td>
                  </tr>
                ) : (
                  assessments.map((assessment) => (
                    <tr key={assessment.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="font-medium text-gray-900">{assessment.title || 'Untitled'}</td>
                      <td>{assessment.subject_id ? assessment.subject_id.substring(0,8) : 'N/A'}</td>
                      <td>{assessment.teacher_id ? assessment.teacher_id.substring(0,8) : 'N/A'}</td>
                      <td>{assessment.total_marks}</td>
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
