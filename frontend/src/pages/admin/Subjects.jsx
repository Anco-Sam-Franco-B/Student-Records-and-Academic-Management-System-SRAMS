import React, { useEffect, useState } from 'react';
import { BookMarked, LoaderPinwheelIcon, Plus, X } from 'lucide-react';
import api from '../../api/client';

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trade, setTrade]=useState([])

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    weight: '',
    trade_id: '',
    class_id: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/data/subjects');
      setSubjects(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch subjects", error);
    } finally {
      setLoading(false);
    }
  };
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

      const fetchTrades = async () => {
        try {
          const response = await api.get('/data/trade');
          setTrade(response.data.data || []);
        } catch (error) {
          console.error("Failed to fetch trades", error);
        } finally {
          setLoading(false);
        }
      };
     

  useEffect(() => {
    fetchSubjects();
    fetchTrades();
    fetchClasses();
  }, [trade, classes, subjects]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Clean up empty trade_id so it doesn't break UUID constraint
      const payload = { ...formData };
      if (!payload.trade_id && !payload.class_id) delete payload.trade_id && delete payload.class_id;

      await api.post('/data/subjects', payload);
      setIsModalOpen(false);
      setFormData({ code: '', name: '', weight: '', trade_id: '', class_id });
      fetchSubjects();
    } catch (error) {
      console.error("Error creating subject", error);
      alert(error.response?.data?.error || "Failed to create subject");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subjects</h1>
          <p className="text-gray-500 text-sm">Manage curriculum subjects, codes, and weights.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Subject
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
                  <th>Code</th>
                  <th>Subject Name</th>
                  <th>Trade</th>
                  <th>Weight (Marks)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">No subjects found.</td>
                  </tr>
                ) : (
                  subjects.map((subject) => (
                    <tr key={subject.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="font-medium text-gray-900">{subject.code || 'N/A'}</td>
                      <td>{subject.name}</td>
                      <td>{subject.trade_name || 'N/A'}</td>
                      <td>{subject.weight}</td>
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
        <div className="fixed -top-6 h-screen backdrop-blur-sm  inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Add New Subject</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateSubject} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label text-sm font-medium text-gray-700">Subject Code <span className='text-red-600'>*</span></label>
                  <input required type="text" name="code" value={formData.code} onChange={handleInputChange} className="appearance-none w-full  bg-white border border-gray-200 text-gray-700 text-sm  rounded-xl px-4 py-1.5 shadow-sm cursor-pointer transition-all duration-200 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="e.g. MTH101" />
                </div>
                <div>
                  <label className="label text-sm font-medium text-gray-700">Weight (Marks) <span className='text-red-600'>*</span></label>
                  <input required type="number" step="0.01" name="weight" value={formData.weight} onChange={handleInputChange} className="appearance-none w-full  bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl px-4 py-1.5 shadow-sm cursor-pointer transition-all duration-200 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="e.g. 100" />
                </div>
              </div>
              <div>
                <label className="label text-sm font-medium text-gray-700">Subject Name <span className='text-red-600'>*</span></label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="appearance-none w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-1.5 shadow-sm cursor-pointer transition-all duration-200 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="e.g. Advanced Mathematics" />
              </div>
              <div>
                <label className="label text-sm font-medium text-gray-700">Trade Name <span className='text-red-600'>*</span></label>
                <select name="trade_id" value={formData.trade_id} onChange={handleInputChange} className="appearance-none w-full  bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl px-4 py-1.5 shadow-sm cursor-pointer transition-all duration-200 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                  <option value="" disabled> Select Trade</option>
                  {
                    trade.map((data, index)=>(
                      <option value={data.id} key={index} className='font-medium'>{data.name} ({data.code})</option>
                    ))
                  }
                </select>
              </div>

              <div>
                <label className="label text-sm font-medium text-gray-700">Class <span className='text-red-600'>*</span></label>
                <select name="class_id" value={formData.class_id} onChange={handleInputChange} className="appearance-none w-full  bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl px-4 py-1.5 shadow-sm cursor-pointer transition-all duration-200 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                  <option value="" disabled>Select Class</option>
                  {
                    classes.map((data, index)=>(
                      <option value={data.id} key={index} className='font-medium'>{data.name} ({data.level})</option>
                    ))
                  }
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button className="flex items-center p-2 px-3 bg-red-600 text-white rounded-lg shadow-lg" type="button" onClick={() => setIsModalOpen(false)} >Cancel</button>
                <button type="submit" disabled={submitting} className="flex items-center p-2 px-3 bg-blue-600 text-white rounded-lg shadow-lg">
                   {submitting ? (<><LoaderPinwheelIcon className='size-5 animate-spin'/> Saving....</>) : 'Save Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
