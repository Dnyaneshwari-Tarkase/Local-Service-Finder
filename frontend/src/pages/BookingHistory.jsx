import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, User, CheckCircle, XCircle, Star } from 'lucide-react';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [reviewModal, setReviewModal] = useState({ show: false, bookingId: null });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}/status?status=${status}`);
      fetchBookings();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews/', {
        booking_id: reviewModal.bookingId,
        rating,
        comment
      });
      alert("Review submitted!");
      setReviewModal({ show: false, bookingId: null });
      fetchBookings();
    } catch (error) {
      alert("Failed to submit review");
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <Calendar className="mr-3 text-blue-600" /> Booking History
      </h1>

      {bookings.length === 0 ? (
        <div className="bg-white p-10 rounded-lg shadow-sm text-center">
          <p className="text-gray-500">You don't have any bookings yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {user?.role === 'provider' ? booking.customer.name : booking.provider.user.name}
                  </h3>
                  <p className="text-blue-600 font-medium text-sm">{user?.role === 'provider' ? 'Customer' : booking.provider.services}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {new Date(booking.date_time).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                  booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {booking.status}
                </span>

                <div className="flex gap-2">
                  {booking.status === 'pending' && (
                    <>
                      {user?.role === 'provider' && (
                        <button
                          onClick={() => updateStatus(booking.id, 'completed')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                          title="Mark Completed"
                        >
                          <CheckCircle size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => updateStatus(booking.id, 'cancelled')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                        title="Cancel Booking"
                      >
                        <XCircle size={20} />
                      </button>
                    </>
                  )}
                  {booking.status === 'completed' && user?.role === 'customer' && !booking.review && (
                    <button
                      onClick={() => setReviewModal({ show: true, bookingId: booking.id })}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition"
                    >
                      Rate & Review
                    </button>
                  )}
                  {booking.review && (
                    <div className="flex items-center text-yellow-500 font-bold">
                       <Star size={16} className="fill-current mr-1" /> {booking.review.rating}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-8 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comment (Optional)</label>
                <textarea
                  className="w-full border rounded-md p-2 h-24"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How was your experience?"
                ></textarea>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-grow bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700 transition"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setReviewModal({ show: false, bookingId: null })}
                  className="px-6 py-2 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
