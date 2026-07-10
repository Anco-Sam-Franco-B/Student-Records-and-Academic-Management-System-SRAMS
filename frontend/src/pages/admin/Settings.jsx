import React, { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Briefcase, Plus, X } from 'lucide-react';
import api from '../../api/client';

export default function Settings() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
      code: '',
      name: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await api.get('/data/trade');
        setTrades(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch trades", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrades();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handleCreateSubject = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      try {
        // Clean up empty trade_id so it doesn't break UUID constraint
        const payload = { ...formData };

        await api.post('/data/trade', payload);
        setIsModalOpen(false);
        setFormData({ code: '', name: '' });
        fetchSubjects();
      } catch (error) {
        console.error("Error creating Trade", error);
        alert(error.response?.data?.error || "Failed to create Trade");
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <div className="space-y-6">
      <div className="flex w-full items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-500 text-sm">Configure core application variables and roles.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center p-2 bg-blue-600 text-white rounded-lg shadow-lg text-sm"><Plus/> Add Trade</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Briefcase className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-bold text-gray-900">Trades / Departments</h3>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-4"><span className="loading loading-spinner loading-md"></span></div>
        ) : trades.length === 0 ? (
          <p className="text-gray-500 text-sm">No trades configured.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trades.map(trade => (
              <div key={trade.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                <p className="font-semibold text-gray-900">{trade.name}</p>
                <p className="text-xs text-gray-500 mt-1">Code: {trade.code}</p>
              </div>
            ))}
          </div>
        )}
      </div>

        {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed h-screen -top-6 backdrop-blur-sm inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Add New Trade</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateSubject} className="p-6 space-y-4">
              <div className="flex flex-col gap-3">
                <div>
                  <label className="label text-sm font-medium text-gray-700">Trade Code <span className='text-red-600'>*</span></label>
                  <input required type="text" name="code" value={formData.code} onChange={handleInputChange} className="shadow-sm outline-none px-3 py-3 rounded-md border w-full" placeholder="e.g. SOD" />
                </div>
                <div>
                  <label className="label text-sm font-medium text-gray-700">Trade Name <span className='text-red-600'>*</span></label>
                  <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="shadow-sm outline-none px-3 py-3 rounded-md border w-full" placeholder="e.g. Software Development" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button className="flex items-center p-2 px-3 bg-red-600 text-white rounded-lg shadow-lg" type="button" onClick={() => setIsModalOpen(false)} >Cancel</button>
                <button type="submit" disabled={submitting} className="flex items-center p-2 px-3 bg-blue-600 text-white rounded-lg shadow-lg">
                   {submitting ? (<><LoaderPinwheelIcon className='size-5 animate-spin'/> Saving....</>) : 'Save Trade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
