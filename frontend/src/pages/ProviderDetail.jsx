import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Star, Calendar, Phone, MessageCircle } from 'lucide-react';

const ProviderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [pRes, rRes] = await Promise.all([
          api.get(`/providers/${id}`),
          api.get(`/reviews/provider/${id}`)
        ]);
        setProvider(pRes.data);
        setReviews(rRes.data);
      } catch (error) {
        console.error("Error fetching provider details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setBookingLoading(true);
    try {
      await api.post('/bookings/', {
        provider_id: parseInt(id),
        date_time: new Date(bookingDate).toISOString()
      });
      alert("Booking request sent successfully!");
      navigate('/bookings');
    } catch (error) {
      alert("Failed to create booking: " + (error.response?.data?.detail || "Unknown error"));
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!provider) return <div className="text-center py-20">Provider not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Profile info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col md:flex-row gap-6">
            <div className="w-32 h-32 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-4xl flex-shrink-0">
              {provider.user.name.charAt(0)}
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{provider.user.name}</h1>
                  <p className="text-blue-600 font-bold text-lg">{provider.services}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-yellow-500 font-bold text-2xl">
                    <Star className="fill-current mr-1" size={24} /> {provider.rating_avg.toFixed(1)}
                  </div>
                  <p className="text-gray-400 text-sm">{reviews.length} reviews</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center"><MapPin size={16} className="mr-2 text-blue-500" /> {provider.location_pincode}</div>
                <div className="flex items-center"><Calendar size={16} className="mr-2 text-blue-500" /> {provider.experience} years experience</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-bold mb-6">Customer Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet.</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < review.rating ? 'fill-current' : 'text-gray-300'} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Booking form */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-8 sticky top-6">
            <h3 className="text-xl font-bold mb-6">Book this Service</h3>
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  className="w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-md font-bold hover:bg-blue-700 transition"
              >
                {bookingLoading ? "Processing..." : "Confirm Booking Request"}
              </button>
            </form>

            <div className="mt-6 border-t pt-6 space-y-3">
              <p className="text-sm text-gray-500 text-center mb-4 font-medium uppercase">Direct Contact</p>
              <a href={`tel:${provider.contact_info}`} className="flex items-center justify-center w-full border border-blue-600 text-blue-600 py-2 rounded-md hover:bg-blue-50 transition">
                <Phone size={18} className="mr-2" /> Call Now
              </a>
              <a href={`https://wa.me/${provider.contact_info}`} target="_blank" className="flex items-center justify-center w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition">
                <MessageCircle size={18} className="mr-2" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetail;
