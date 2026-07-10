import React, { useEffect, useState } from 'react';
import { Users, Plus, Search, X } from 'lucide-react';
import api from '../../api/client';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    admission_no: '',
    first_name: '',
    last_name: '',
    email: '',
    nationality: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/data/students');
      setStudents(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch students", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/data/students', formData);
      setIsModalOpen(false);
      setFormData({ admission_no: '', first_name: '', last_name: '', email: '', nationality: 'Rwanda' });
      fetchStudents(); // Refresh list
    } catch (error) {
      console.error("Error creating student", error);
      alert(error.response?.data?.error || "Failed to create student");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students Management</h1>
          <p className="text-gray-500 text-sm">Manage student records, admissions, and details.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className='flex gap-1 active:scale-95 items-center p-2 bg-gradient-to-r
from-blue-600
to-indigo-600 rounded-md text-white shadow-lg'>
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search students..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
            />
          </div>
          <div className="flex gap-2">
            <select className="appearance-none  bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl px-4 py-1.5 shadow-sm cursor-pointer transition-all duration-200 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
              <option>All Classes</option>
            </select>
            <select className="appearance-none  bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl px-4 py-1.5 shadow-sm cursor-pointer transition-all duration-200 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
              <option>All Trades</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
             <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>
          ) : (
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-50 text-gray-500">
                  <th>Admission No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Trade</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">No students found.</td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="font-medium text-gray-900">{student.admission_no}</td>
                      <td>{student.first_name} {student.last_name}</td>
                      <td>{student.email || 'N/A'}</td>
                      <td>{student.trade_name || 'N/A'}</td>
                      <td>
                        <span className={`badge ${student.is_active ? 'badge-success' : 'badge-error'} badge-sm`}>
                          {student.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
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

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed h-screen -top-6 backdrop-blur-sm inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Add New Student</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateStudent} className="p-6 space-y-4">
              <div>
                <label className="label text-sm font-medium text-gray-700">Admission Number *</label>
                <input required type="text" name="admission_no" value={formData.admission_no} onChange={handleInputChange} className="input input-bordered w-full" placeholder="e.g. ADM-2026-001" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label text-sm font-medium text-gray-700">First Name *</label>
                  <input required type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} className="input input-bordered w-full" />
                </div>
                <div>
                  <label className="label text-sm font-medium text-gray-700">Last Name *</label>
                  <input required type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} className="input input-bordered w-full" />
                </div>
              </div>
              <div>
                <label className="label text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="input input-bordered w-full" placeholder="student@srams.edu" />
              </div>
              <div>
                <label className="label text-sm font-medium text-gray-700">Nationality *</label>
                <input required type="text" name="nationality" value={formData.nationality} onChange={handleInputChange} className="input input-bordered w-full" />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? <span className="loading loading-spinner loading-sm"></span> : 'Save Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
