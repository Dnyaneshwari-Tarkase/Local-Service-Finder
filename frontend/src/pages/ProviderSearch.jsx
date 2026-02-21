import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import { Search, MapPin, Star, Filter } from 'lucide-react';

const ProviderSearch = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [filters, setFilters] = useState({
    category: queryParams.get('category') || '',
    pincode: queryParams.get('pincode') || '',
  });

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/providers/', { params: filters });
      setProviders(response.data);
    } catch (error) {
      console.error("Error fetching providers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProviders();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Search className="mr-2 text-blue-600" /> Find Service Providers
        </h1>

        <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
          <select
            className="border rounded-md px-3 py-2 bg-white"
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="">All Categories</option>
            <option value="Plumber">Plumber</option>
            <option value="Electrician">Electrician</option>
            <option value="Painter">Painter</option>
            <option value="Carpenter">Carpenter</option>
            <option value="Cleaner">Cleaner</option>
          </select>
          <input
            type="text"
            placeholder="Pincode"
            className="border rounded-md px-3 py-2"
            value={filters.pincode}
            onChange={(e) => setFilters({...filters, pincode: e.target.value})}
          />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
            Filter
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-20">Loading...</div>
      ) : providers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-dashed border-gray-300">
           <p className="text-gray-500">No verified providers found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <Link
              key={provider.id}
              to={`/provider/${provider.id}`}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 border border-gray-100"
            >
              <div className="flex p-6">
                <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-4 flex-shrink-0 font-bold text-2xl uppercase">
                  {provider.user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{provider.user.name}</h3>
                  <p className="text-blue-600 text-sm font-semibold mb-1">{provider.services}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin size={14} className="mr-1" /> {provider.location_pincode}
                  </div>
                  <div className="flex items-center">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <span className="ml-1 font-bold">{provider.rating_avg.toFixed(1)}</span>
                    <span className="ml-2 text-xs text-gray-400">({provider.experience}y exp)</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t flex justify-between items-center">
                <span className="text-xs text-green-600 font-bold bg-green-100 px-2 py-1 rounded">VERIFIED</span>
                <span className="text-blue-600 font-medium text-sm">View Profile →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderSearch;
