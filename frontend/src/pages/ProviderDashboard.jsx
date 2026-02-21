import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Calendar, Star, CheckCircle, Clock } from 'lucide-react';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const [provider, setProvider] = useState(null);
  const [stats, setStats] = useState({ bookings: 0, rating: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const res = await api.get('/bookings/my-bookings');
        const bks = res.data;

        // Find provider profile
        // In a real app we'd have an endpoint /providers/me
        const pRes = await api.get('/providers/');
        const myP = pRes.data.find(p => p.user_id === user.id);

        setProvider(myP);
        setStats({
          bookings: bks.length,
          rating: myP?.rating_avg || 0
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProviderData();
  }, [user]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
        {!provider && (
          <Link to="/profile" className="bg-red-600 text-white px-6 py-2 rounded-md font-bold hover:bg-red-700 animate-pulse">
            Complete Your Provider Profile
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <Calendar size={32} className="mb-4 text-blue-600" />
          <h2 className="text-3xl font-extrabold text-gray-900">{stats.bookings}</h2>
          <p className="text-gray-500 font-medium">Total Bookings</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <Star size={32} className="mb-4 text-yellow-500" />
          <h2 className="text-3xl font-extrabold text-gray-900">{stats.rating.toFixed(1)}</h2>
          <p className="text-gray-500 font-medium">Average Rating</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <CheckCircle size={32} className="mb-4 text-green-500" />
          <h2 className="text-3xl font-extrabold text-gray-900">{provider?.verified ? 'Verified' : 'Pending'}</h2>
          <p className="text-gray-500 font-medium">Profile Status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <Clock size={20} className="mr-2 text-blue-600" /> Recent Activity
          </h3>
          <Link to="/bookings" className="block text-center py-4 text-blue-600 hover:bg-blue-50 rounded-lg border border-dashed border-blue-200 transition">
            View All Booking Requests
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <Briefcase size={20} className="mr-2 text-blue-600" /> My Services
          </h3>
          {provider ? (
            <div className="space-y-4">
               <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                 <span className="font-bold text-gray-700">{provider.services}</span>
                 <span className="text-sm text-gray-500">{provider.experience} years exp.</span>
               </div>
               <Link to="/profile" className="block text-center text-sm text-blue-600 hover:underline">Edit Profile</Link>
            </div>
          ) : (
            <p className="text-gray-500 italic">No services listed yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
