import React, { useEffect, useState } from 'react';
import { Layers, Plus, X } from 'lucide-react';
import api from '../../api/client';

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    level: '',
    capacity: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/data/classes');
      setClasses(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch classes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/data/classes', formData);
      setIsModalOpen(false);
      setFormData({ name: '', level: '', capacity: '' });
      fetchClasses();
    } catch (error) {
      console.error("Error creating class", error);
      alert(error.response?.data?.error || "Failed to create class");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          <p className="text-gray-500 text-sm">Manage school classes and their associated trades.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Class
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>
      ) : classes.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
          No classes found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div key={cls.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Layers className="w-6 h-6" />
                </div>
                <button className="btn btn-ghost btn-xs">Edit</button>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{cls.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{cls.trade_name || 'No Trade'}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Level: {cls.level || 'N/A'}</span>
                <span className="text-blue-600 font-medium cursor-pointer hover:underline">View List</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Add New Class</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateClass} className="p-6 space-y-4">
              <div>
                <label className="label text-sm font-medium text-gray-700">Class Name *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="input input-bordered w-full" placeholder="e.g. Senior 1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label text-sm font-medium text-gray-700">Level *</label>
                  <input required type="text" name="level" value={formData.level} onChange={handleInputChange} className="input input-bordered w-full" placeholder="e.g. 1" />
                </div>
                <div>
                  <label className="label text-sm font-medium text-gray-700">Capacity</label>
                  <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} className="input input-bordered w-full" placeholder="e.g. 40" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? <span className="loading loading-spinner loading-sm"></span> : 'Save Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
