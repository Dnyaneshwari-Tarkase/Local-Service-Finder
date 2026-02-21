import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Calendar, User, Clock } from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Welcome back, {user?.name}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Link to="/search" className="bg-blue-600 text-white p-8 rounded-2xl shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1">
          <Search size={32} className="mb-4" />
          <h2 className="text-xl font-bold mb-2">Find a Service</h2>
          <p className="text-blue-100 text-sm">Search for verified plumbers, electricians, and more near you.</p>
        </Link>

        <Link to="/bookings" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition transform hover:-translate-y-1">
          <Calendar size={32} className="mb-4 text-blue-600" />
          <h2 className="text-xl font-bold mb-2">My Bookings</h2>
          <p className="text-gray-500 text-sm">View and manage your service appointments and history.</p>
        </Link>

        <Link to="/profile" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition transform hover:-translate-y-1">
          <User size={32} className="mb-4 text-blue-600" />
          <h2 className="text-xl font-bold mb-2">Profile Settings</h2>
          <p className="text-gray-500 text-sm">Update your personal information and account details.</p>
        </Link>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h3 className="text-blue-800 font-bold text-xl mb-2">Become a Service Provider?</h3>
          <p className="text-blue-600">Earn money by offering your skills to people in your neighborhood.</p>
        </div>
        <button className="mt-4 md:mt-0 bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md">
          List Your Services
        </button>
      </div>
    </div>
  );
};

export default CustomerDashboard;
