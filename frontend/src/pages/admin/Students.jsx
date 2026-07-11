import React, { useEffect, useState } from 'react';
import { Users, Plus, Search, X, LoaderPinwheelIcon, Trash2, Edit2 } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';

export default function Students() {
    const [students, setStudents] = useState([]);
    const [trades, setTrades] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTrade, setFilterTrade] = useState('');
    const [filterClass, setFilterClass] = useState('');
  
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        admission_no: '',
        class_id: '',
        trade_id: '',
        first_name: '',
        last_name: '',
        email: '',
        nationality: '',
        gender: '',
        phone: '',
        date_of_birth: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchStudents = async () => {
        try {
            const response = await api.get('/data/students');
            setStudents(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch students", error);
            toast.error("Failed to load students");
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
        }
    };

    const fetchTrades = async () => {
        try {
            const response = await api.get('/data/trade');
            setTrades(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch trades", error);
        }
    };

    useEffect(() => {
        fetchTrades();
        fetchClasses();
        fetchStudents();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            if (name === "trade_id") {
                setStep(value ? 2 : 1);
                updated.class_id = "";
            }
            if (name === "class_id") {
                setStep(value ? 3 : 2);
            }
            return updated;
        });
    };

    const openCreateModal = () => {
        setIsEditMode(false);
        setEditingId(null);
        setFormData({
            admission_no: '',
            class_id: '',
            trade_id: '',
            first_name: '',
            last_name: '',
            email: '',
            nationality: '',
            gender: '',
            phone: '',
            date_of_birth: ''
        });
        setStep(1);
        setIsModalOpen(true);
    };

    const openEditModal = (student) => {
        setIsEditMode(true);
        setEditingId(student.id);
        setFormData({
            admission_no: student.admission_no || '',
            class_id: student.class_id || '',
            trade_id: student.trade_id || '',
            first_name: student.first_name || '',
            last_name: student.last_name || '',
            email: student.email || '',
            nationality: student.nationality || '',
            gender: student.gender || '',
            phone: student.phone || '',
            date_of_birth: student.date_of_birth ? student.date_of_birth.split('T')[0] : ''
        });
        setStep(3);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditingId(null);
        setFormData({
            admission_no: '',
            class_id: '',
            trade_id: '',
            first_name: '',
            last_name: '',
            email: '',
            nationality: '',
            gender: '',
            phone: '',
            date_of_birth: ''
        });
        setStep(1);
    };

    const handleCreateStudent = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Clean up empty fields
            const payload = { ...formData };
            if (!payload.trade_id) delete payload.trade_id;
            if (!payload.class_id) delete payload.class_id;
            if (!payload.email) delete payload.email;
            if (!payload.gender) delete payload.gender;
            if (!payload.phone) delete payload.phone;
            if (!payload.date_of_birth) delete payload.date_of_birth;
            
            await api.post('/data/students', payload);
            toast.success("Student created successfully");
            closeModal();
            fetchStudents();
        } catch (error) {
            console.error("Error creating student", error);
            toast.error(error.response?.data?.error || "Failed to create student");
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = { ...formData };
            if (!payload.trade_id) delete payload.trade_id;
            if (!payload.class_id) delete payload.class_id;
            if (!payload.email) delete payload.email;
            if (!payload.gender) delete payload.gender;
            if (!payload.phone) delete payload.phone;
            if (!payload.date_of_birth) delete payload.date_of_birth;
            
            await api.put(`/data/students/${editingId}`, payload);
            toast.success("Student updated successfully");
            closeModal();
            fetchStudents();
        } catch (error) {
            console.error("Error updating student", error);
            toast.error(error.response?.data?.error || "Failed to update student");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteStudent = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        try {
            await api.delete(`/data/students/${id}`);
            toast.success("Student deleted successfully");
            fetchStudents();
        } catch (error) {
            console.error("Error deleting student", error);
            toast.error(error.response?.data?.error || "Failed to delete student");
        }
    };

    // Filter students
    const filteredStudents = students.filter(student => {
        const matchesSearch = searchTerm === '' || 
            student.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.admission_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTrade = filterTrade === '' || student.trade_id === filterTrade;
        const matchesClass = filterClass === '' || student.class_id === filterClass;
        return matchesSearch && matchesTrade && matchesClass;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Students Management</h1>
                    <p className="text-gray-500 text-sm">Manage student records, admissions, and details.</p>
                </div>
                <button onClick={openCreateModal} className='flex gap-1 active:scale-95 items-center p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md text-white shadow-lg'>
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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select 
                            value={filterTrade}
                            onChange={(e) => setFilterTrade(e.target.value)}
                            className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl px-4 py-1.5 shadow-sm cursor-pointer transition-all duration-200 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        >
                            <option value="">All Trades</option>
                            {trades.map(trade => (
                                <option key={trade.id} value={trade.id}>{trade.name}</option>
                            ))}
                        </select>
                        <select 
                            value={filterClass}
                            onChange={(e) => setFilterClass(e.target.value)}
                            className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl px-4 py-1.5 shadow-sm cursor-pointer transition-all duration-200 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        >
                            <option value="">All Classes</option>
                            {classes.map(cls => (
                                <option key={cls.id} value={cls.id}>{cls.name}</option>
                            ))}
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
                                    <th>Class</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-8 text-gray-500">No students found.</td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => (
                                        <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="font-medium text-gray-900">{student.admission_no}</td>
                                            <td>{student.first_name} {student.last_name}</td>
                                            <td>{student.email || 'N/A'}</td>
                                            <td>{student.trade_name || 'N/A'}</td>
                                            <td>{classes.find(c => c.id === student.class_id)?.name || 'N/A'}</td>
                                            <td>
                                                <span className={`badge ${student.is_active ? 'badge-success' : 'badge-error'} badge-sm`}>
                                                    {student.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button onClick={() => openEditModal(student)} className="btn btn-ghost btn-xs text-primary">
                                                        <Edit2 className="size-4" />
                                                    </button>
                                                    <button onClick={() => handleDeleteStudent(student.id)} className="btn btn-ghost btn-xs text-error">
                                                        <Trash2 className="size-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed h-screen -top-6 backdrop-blur-sm inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-[700px] overflow-hidden shadow-xl">
                        <div className="flex bg-gray-50 justify-between items-center p-6 border-b border-gray-100">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-xl font-bold text-gray-900">{isEditMode ? 'Edit Student' : 'Add New Student'}</h2>
                                <p className='text-md text-gray-500'>{isEditMode ? 'Update student details' : 'Add student according to his/her trade and class'}</p>
                            </div>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="w-full p-6">
                            {!isEditMode && (
                                <>
                                    {/* Step Indicator */}
                                    <div className="flex items-center justify-center mb-6">
                                        {[1, 2, 3].map((s) => (
                                            <React.Fragment key={s}>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                                    {s}
                                                </div>
                                                {s < 3 && <div className={`w-16 h-1 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`}></div>}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </>
                            )}

                            {(step === 1 && !isEditMode) && (
                                <div className='w-full ring-1 ring-blue-200 bg-blue-50 shadow-sm p-3 rounded-lg'>
                                    <label className="label text-sm font-medium text-blue-900">Choose Student Trade *</label>
                                    <select required type="text" name="trade_id" value={formData.trade_id} onChange={handleInputChange} className="appearance-none w-full mt-3 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl px-4 py-1.5 shadow-sm cursor-pointer transition-all duration-200 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                                        <option value='' disabled>Select Student Trade</option>
                                        {trades.map((data, index) => (
                                            <option value={data.id} key={index}>{data.name} ({data.code})</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {(step === 2 && !isEditMode) && (
                                <div className='w-full mt-3 ring-1 ring-blue-200 bg-blue-50 shadow-sm p-3 rounded-lg'>
                                    <label className="label text-sm font-medium text-blue-900">Choose Student Class *</label>
                                    <select required type="text" name="class_id" value={formData.class_id} onChange={handleInputChange} className="appearance-none w-full mt-3 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl px-4 py-1.5 shadow-sm cursor-pointer transition-all duration-200 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                                        <option value='' disabled>Select Student Class</option>
                                        {classes.map((data, index) => (
                                            <option value={data.id} key={index}>{data.name} ({data.level})</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {(step === 3 || isEditMode) && (
                                <form onSubmit={isEditMode ? handleUpdateStudent : handleCreateStudent} className="p-3 space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="label text-sm font-medium text-gray-700">First Name *</label>
                                            <input required type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} className="appearance-none w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-1.5 shadow-sm cursor-pointer transition-all duration-200 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                                        </div>
                                        <div>
                                            <label className="label text-sm font-medium text-gray-700">Last Name *</label>
                                            <input required type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} className="appearance-none w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-1.5 shadow-sm cursor-pointer transition-all duration-200 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                                        </div>
                                        <div>
                                            <label className="label text-sm font-medium text-gray-700">Email Address</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="appearance-none w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-1.5 shadow-sm cursor-pointer transition-all duration-200 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="student@srams.edu" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="label text-sm font-medium text-gray-700">Nationality *</label>
                                            <input required type="text" name="nationality" value={formData.nationality} onChange={handleInputChange} className="appearance-none w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-1.5 shadow-sm cursor-pointer transition-all duration-200 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                                        </div>
                                        <div>
                                            <label className="label text-sm font-medium text-gray-700">Gender</label>
                                            <select name="gender" value={formData.gender} onChange={handleInputChange} className="appearance-none w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-1.5 shadow-sm cursor-pointer transition-all duration-200 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="label text-sm font-medium text-gray-700">Phone</label>
                                            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="appearance-none w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-1.5 shadow-sm cursor-pointer transition-all duration-200 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="+250..." />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="label text-sm font-medium text-gray-700">Date of Birth</label>
                                            <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleInputChange} className="appearance-none w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-1.5 shadow-sm cursor-pointer transition-all duration-200 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                                        </div>
                                        {isEditMode && (
                                            <>
                                                <div>
                                                    <label className="label text-sm font-medium text-gray-700">Trade</label>
                                                    <select name="trade_id" value={formData.trade_id} onChange={handleInputChange} className="appearance-none w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-1.5 shadow-sm cursor-pointer transition-all duration-200 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                                                        <option value="">Select Trade</option>
                                                        {trades.map((t) => (
                                                            <option key={t.id} value={t.id}>{t.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="label text-sm font-medium text-gray-700">Class</label>
                                                    <select name="class_id" value={formData.class_id} onChange={handleInputChange} className="appearance-none w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-1.5 shadow-sm cursor-pointer transition-all duration-200 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                                                        <option value="">Select Class</option>
                                                        {classes.map((c) => (
                                                            <option key={c.id} value={c.id}>{c.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    
                                    <div className="pt-4 flex justify-end gap-3">
                                        <button type="button" onClick={closeModal} className="btn btn-ghost">Cancel</button>
                                        <button type="submit" disabled={submitting} className="btn btn-primary">
                                            {submitting ? <span className="loading loading-spinner loading-sm"></span> : (isEditMode ? 'Update Student' : 'Save Student')}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {!isEditMode && step === 3 && (
                                <div className="flex w-full items-center justify-between mt-4">
                                    <div className="flex gap-2 items-center">
                                        <button
                                            className="p-2 bg-gray-200 text-gray-700 font-medium text-sm rounded-lg active:scale-95 shadow-lg"
                                            disabled={step === 1}
                                            onClick={() => setStep(step - 1)}
                                        >
                                            Back
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
