import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Plus } from 'lucide-react';
import api from '../../api/client';

export default function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await api.get('/data/student_promotions');
        setPromotions(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch promotions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Promotions</h1>
          <p className="text-gray-500 text-sm">Manage student transitions between academic years and classes.</p>
        </div>
        <button className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Promotion Run
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
                  <th>From Class</th>
                  <th>To Class</th>
                  <th>Academic Year</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {promotions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">No promotions recorded.</td>
                  </tr>
                ) : (
                  promotions.map((promo) => (
                    <tr key={promo.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="font-medium text-gray-900">{promo.student_id ? promo.student_id.substring(0,8) : 'N/A'}</td>
                      <td>{promo.from_class ? promo.from_class.substring(0,8) : 'N/A'}</td>
                      <td>{promo.to_class ? promo.to_class.substring(0,8) : 'N/A'}</td>
                      <td>{promo.academic_year_id ? promo.academic_year_id.substring(0,8) : 'N/A'}</td>
                      <td>
                        <span className="badge badge-info badge-sm">{promo.status}</span>
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
