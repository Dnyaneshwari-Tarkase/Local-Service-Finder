import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProviderSearch from './pages/ProviderSearch';
import ProviderDetail from './pages/ProviderDetail';
import BookingHistory from './pages/BookingHistory';
import CustomerDashboard from './pages/CustomerDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import AdminDashboard from './pages/AdminDashboard';

const DashboardRouter = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  if (user.role === 'admin') return <AdminDashboard />;
  if (user.role === 'provider') return <ProviderDashboard />;
  return <CustomerDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/search" element={<ProviderSearch />} />
              <Route path="/provider/:id" element={<ProviderDetail />} />

              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              <Route path="/bookings" element={
                <ProtectedRoute>
                  <BookingHistory />
                </ProtectedRoute>
              } />

              <Route path="/dashboard" element={<DashboardRouter />} />

              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
