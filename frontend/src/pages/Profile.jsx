import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, Calendar, Briefcase, MapPin } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [providerProfile, setProviderProfile] = useState(null);

  useEffect(() => {
    if (user?.role === 'provider') {
      // Fetch provider specific details if needed
    }
  }, [user]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-blue-600 h-32"></div>
        <div className="px-6 pb-6">
          <div className="relative -mt-16 flex items-end space-x-5">
            <div className="h-32 w-32 bg-gray-200 rounded-full border-4 border-white flex items-center justify-center overflow-hidden">
               <User size={64} className="text-gray-400" />
            </div>
            <div className="mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500 uppercase tracking-wider text-xs font-semibold">{user.role}</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <Mail className="mr-3 text-blue-500" /> {user.email}
              </div>
              <div className="flex items-center text-gray-700">
                <Calendar className="mr-3 text-blue-500" /> Joined {new Date(user.created_at).toLocaleDateString()}
              </div>
            </div>

            {user.role === 'provider' && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-blue-800 mb-2 flex items-center">
                  <Briefcase size={18} className="mr-2" /> Provider Info
                </h3>
                <p className="text-sm text-gray-600">Register your provider profile to start appearing in search results.</p>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm">Update Service Profile</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
