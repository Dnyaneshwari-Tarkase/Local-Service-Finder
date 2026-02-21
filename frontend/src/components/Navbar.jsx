import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Home, Search, Calendar, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center font-bold text-xl">
              <Home className="mr-2" /> LocalHelper
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link to="/search" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                <Search size={16} className="mr-1" /> Find Services
              </Link>
              {user && (
                <Link to="/bookings" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <Calendar size={16} className="mr-1" /> My Bookings
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                   Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium flex items-center text-yellow-300">
                    <ShieldCheck size={16} className="mr-1" /> Admin
                  </Link>
                )}
                <Link to="/profile" className="flex items-center hover:text-blue-200">
                  <User size={20} className="mr-1" /> {user.name}
                </Link>
                <button onClick={handleLogout} className="flex items-center hover:text-blue-200">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="hover:text-blue-200">Login</Link>
                <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
