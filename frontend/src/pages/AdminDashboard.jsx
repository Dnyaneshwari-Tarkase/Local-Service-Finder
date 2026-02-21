import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ShieldCheck, UserCheck, BarChart3, AlertTriangle, Check, X } from 'lucide-react';

const AdminDashboard = () => {
  const [unverifiedProviders, setUnverifiedProviders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [uRes, aRes] = await Promise.all([
        api.get('/admin/unverified-providers'),
        api.get('/admin/analytics')
      ]);
      setUnverifiedProviders(uRes.data);
      setAnalytics(aRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, approve) => {
    try {
      await api.post(`/admin/verify-provider/${id}?approve=${approve}`);
      fetchData();
    } catch (err) {
      alert("Action failed");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <ShieldCheck className="mr-3 text-red-600" /> Admin Control Panel
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <UserCheck size={20} className="mr-2 text-blue-600" /> Pending Verifications
            </h2>

            {unverifiedProviders.length === 0 ? (
              <p className="text-gray-500 italic">No pending verifications at this time.</p>
            ) : (
              <div className="space-y-4">
                {unverifiedProviders.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div>
                      <h4 className="font-bold text-gray-900">{p.user.name}</h4>
                      <p className="text-sm text-blue-600">{p.services} • {p.experience}y exp</p>
                      <p className="text-xs text-gray-400 mt-1">Contact: {p.contact_info} • Pincode: {p.location_pincode}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerify(p.id, true)}
                        className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700"
                      >
                        <Check size={18} />
                      </button>
                      <button
                         onClick={() => handleVerify(p.id, false)}
                         className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <BarChart3 size={20} className="mr-2 text-blue-600" /> Insights
            </h2>

            {analytics && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase mb-3">Top Services</h4>
                  <div className="space-y-2">
                    {analytics.top_services.map((s, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{s.services}</span>
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">{s.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase mb-3">Active Locations</h4>
                  <div className="space-y-2">
                    {analytics.popular_locations.map((l, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{l.pincode}</span>
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-bold">{l.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-red-50 border border-red-100 rounded-xl p-6">
            <h3 className="text-red-800 font-bold mb-2 flex items-center">
              <AlertTriangle size={18} className="mr-2" /> Spam Protection
            </h3>
            <p className="text-sm text-red-600 mb-4">Review system logs to identify and report fake users or suspicious activities.</p>
            <button className="w-full bg-red-600 text-white py-2 rounded-md text-sm font-bold hover:bg-red-700 transition">
              View Activity Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
