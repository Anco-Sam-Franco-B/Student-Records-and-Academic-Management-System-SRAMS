import React, { useEffect, useState } from 'react';
import { FileText, Printer } from 'lucide-react';
import api from '../../api/client';

export default function ReportCards() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/data/report_cards');
        setReports(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch report cards", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Report Cards</h1>
          <p className="text-gray-500 text-sm">Generate and view end-of-term student report cards.</p>
        </div>
        <button className="btn btn-primary">
          <FileText className="w-4 h-4 mr-2" />
          Generate New Reports
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
                  <th>Term ID</th>
                  <th>Total Marks</th>
                  <th>Average</th>
                  <th>Position</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">No report cards generated yet.</td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="font-medium text-gray-900">{report.student_id ? report.student_id.substring(0,8) : 'N/A'}</td>
                      <td>{report.term_id ? report.term_id.substring(0,8) : 'N/A'}</td>
                      <td>{report.total_marks}</td>
                      <td>{report.average}%</td>
                      <td>{report.position}</td>
                      <td>
                        <button className="btn btn-ghost btn-xs text-primary" title="Print">
                          <Printer className="w-4 h-4" />
                        </button>
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
