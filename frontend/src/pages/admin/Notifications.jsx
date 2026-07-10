import React, { useEffect, useState } from 'react';
import { Bell, Plus } from 'lucide-react';
import api from '../../api/client';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/data/notifications');
        setNotifications(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Notifications</h1>
          <p className="text-gray-500 text-sm">Manage alerts and messages sent to users.</p>
        </div>
        <button className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Send Notification
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {loading ? (
          <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>
        ) : notifications.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No notifications found.</div>
        ) : (
          <div className="space-y-4">
            {notifications.map((note) => (
              <div key={note.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${note.is_read ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-600'}`}>
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h4 className={`font-semibold ${note.is_read ? 'text-gray-600' : 'text-gray-900'}`}>{note.title}</h4>
                  <p className="text-gray-500 text-sm mt-1">{note.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(note.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
