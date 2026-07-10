import React, { useEffect, useState } from 'react';
import { CalendarDays, Plus } from 'lucide-react';
import api from '../../api/client';

export default function Terms() {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await api.get('/data/terms');
        setTerms(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch terms", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Terms</h1>
          <p className="text-gray-500 text-sm">Manage terms within academic years.</p>
        </div>
        <button className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Term
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
                  <th>Name</th>
                  <th>Academic Year ID</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {terms.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">No terms found.</td>
                  </tr>
                ) : (
                  terms.map((term) => (
                    <tr key={term.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="font-medium text-gray-900">{term.name}</td>
                      <td>{term.academic_year_id ? term.academic_year_id.substring(0,8) : 'N/A'}</td>
                      <td>{term.start_date ? new Date(term.start_date).toLocaleDateString() : 'N/A'}</td>
                      <td>{term.end_date ? new Date(term.end_date).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <span className={`badge ${term.is_current ? 'badge-success' : 'badge-ghost'} badge-sm`}>
                          {term.is_current ? 'Current' : 'Past'}
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
