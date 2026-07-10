import React, { useEffect, useState } from 'react';
import { ShieldCheck, Plus, Search, Trash2, PowerCircle, PowerOff } from 'lucide-react';
import api from '../../api/client';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [usersRes, rolesRes] = await Promise.all([
        api.get('/data/users'),
        api.get('/data/roles')
      ]);
      setUsers(usersRes.data.data || []);
      setRoles(rolesRes.data.data || []);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [users, roles]);

  const handleRoleChange = async (userId, newRoleId) => {
    try {
      await api.put(`/users/${userId}/role`, { role_id: newRoleId });
      
      fetchData(); // Refresh UI
    } catch (error) {
      console.error("Error changing role", error);
      alert("Failed to change role.");
    }
  };

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'Unassigned';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Users</h1>
          <p className="text-gray-500 text-sm">Manage administrators, teachers, and other system users.</p>
        </div>

      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
             <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>
          ) : (
            <table className="table w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500">
                  <th className='p-3'>Name</th>
                  <th className='p-3'>Email</th>
                  <th className='p-3'>Role</th>
                  <th className='p-3'>Status</th>
                  <th className='p-3'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">No users found.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="font-medium text-gray-900 p-3 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-md shadow-md">
                            {`${user.first_name?.charAt(0)}${user.last_name?.charAt(0)}`.toUpperCase()}
                        </div>
                        {user.first_name} {user.last_name}
                        </td>
                      <td className='p-3'>{user.email}</td>
                      <td className='p-3'>
                        <select 
                         className="appearance-none  bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl px-4 py-1.5 shadow-sm cursor-pointer transition-all duration-200 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                          value={user.role_id || ''}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        >
                          <option value="" disabled>Select Role</option>
                          {roles.map(role => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className='p-3'>
                        <span className={`${user.is_active ? 'bg-green-100 px-2 font-medium rounded-full text-green-600' : 'bg-red-100 px-2 font-medium rounded-full text-red-600'} badge-sm`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className='p-3 flex items-center gap-2 justify-center'>
                        <button className="btn btn-ghost btn-xs text-primary" title='Toggle Account status'>{user.is_active ? (<PowerOff className='size-5 text-red-500'/>) : (<PowerCircle className='size-5 text-green-500'/>)}</button>
                        <button className="btn btn-ghost btn-xs text-red-500" title='Delete User'><Trash2 className='size-5'/></button>
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
