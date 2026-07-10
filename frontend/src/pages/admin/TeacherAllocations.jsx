import React, { useEffect, useState } from 'react';
import { BookCopy, Plus, X, Trash2, LoaderPinwheelIcon } from 'lucide-react';
import api from '../../api/client';

export default function TeacherAllocations() {
  const [allocations, setAllocations] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ teacher_id: '', trade_id: '', class_id: '', subject_id: '' });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchAll = async () => {
    try {
      const [allocRes, teacherRes, subjectRes, classRes, tradeRes] = await Promise.all([
        api.get('/data/teacher_subjects'),
        api.get('/data/teachers'),
        api.get('/data/subjects'),
        api.get('/data/classes'),
        api.get('/data/trade')
      ]);
      setAllocations(allocRes.data.data || []);
      setTeachers(teacherRes.data.data || []);
      setSubjects(subjectRes.data.data || []);
      setClasses(classRes.data.data || []);
      setTrades(tradeRes.data.data || []);
    } catch (e) {
      console.error('Failed to fetch data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const getTeacherName = (id) => {
    const t = teachers.find(t => t.id === id);
    if (!t) return 'N/A';
    return `${t.first_name || ''} ${t.last_name || ''}`.trim();
  };
  const getSubjectName = (id) => {
    const s = subjects.find(s => s.id === id);
    return s?.name || 'N/A';
  };
  const getClassLabel = (id) => {
    const c = classes.find(c => c.id === id);
    if (!c) return 'N/A';
    return `${c.name}${c.level ? ` (L${c.level})` : ''}`;
  };
  const getTradeName = (id) => {
    const tr = trades.find(t => t.id === id);
    return tr?.name || 'N/A';
  };

  const handleDelete = async (allocId) => {
    if (!window.confirm('Delete this allocation?')) return;
    setDeletingId(allocId);
    try {
      await api.delete(`/data/teacher_subjects/${allocId}`);
      await fetchAll();
    } catch (e) {
      console.error('Delete failed', e);
      alert('Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  const openModal = () => {
    setForm({ teacher_id: '', trade_id: '', class_id: '', subject_id: '' });
    setModalOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/data/teacher_subjects', form);
      setModalOpen(false);
      await fetchAll();
    } catch (e) {
      console.error('Create failed', e);
      alert('Failed to create allocation');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Allocations</h1>
          <p className="text-gray-500 text-sm">Map teachers to trades, classes, and subjects.</p>
        </div>
        <button onClick={openModal} className="flex items-center p-2 bg-blue-600 text-white rounded-lg shadow-lg">
          <Plus className="w-4 h-4 mr-2" /> New Allocation
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center p-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <table className="table w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500">
                  <th>Teacher</th>
                  <th>Subject</th>
                  <th>Class / Level</th>
                  <th>Trade</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {allocations.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">No allocations found.</td>
                  </tr>
                ) : (
                  allocations.map((alloc) => (
                    <tr key={alloc.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="font-medium">{getTeacherName(alloc.teacher_id)}</td>
                      <td>{getSubjectName(alloc.subject_id)}</td>
                      <td>{getClassLabel(alloc.class_id)}</td>
                      <td>{getTradeName(alloc.trade_id)}</td>
                      <td className="text-right space-x-2">
                        <button onClick={() => handleDelete(alloc.id)} disabled={deletingId === alloc.id} className="btn btn-ghost btn-xs text-error">
                          {deletingId === alloc.id ? (
                            <LoaderPinwheelIcon className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
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

      {/* Create Allocation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-xl font-bold">New Allocation</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Teacher *</label>
                  <select required className="appearance-none w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.teacher_id} onChange={(e) => setForm({ ...form, teacher_id: e.target.value })}>
                    <option value="" disabled>Select Teacher</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Trade *</label>
                  <select required className="appearance-none w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.trade_id} onChange={(e) => setForm({ ...form, trade_id: e.target.value })}>
                    <option value="" disabled>Select Trade</option>
                    {trades.map(tr => (
                      <option key={tr.id} value={tr.id}>{tr.name} ({tr.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Class *</label>
                  <select required className="appearance-none w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.class_id} onChange={(e) => setForm({ ...form, class_id: e.target.value })}>
                    <option value="" disabled>Select Class</option>
                    {classes.filter(c => !form.trade_id || c.trade_id === form.trade_id).map(c => (
                      <option key={c.id} value={c.id}>{c.name} {c.level ? `(L${c.level})` : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject *</label>
                  <select required className="appearance-none w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.subject_id} onChange={(e) => setForm({ ...form, subject_id: e.target.value })}>
                    <option value="" disabled>Select Subject</option>
                    {subjects.filter(s => !form.trade_id || s.trade_id === form.trade_id).map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow">
                  {saving ? <LoaderPinwheelIcon className="size-5 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
