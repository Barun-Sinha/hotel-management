
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance.js'; 

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get('/api/v1/bookings/my-bookings', {
        withCredentials: true,
      });
      setBookings(res.data.bookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      const res = await axiosInstance.delete(
        `/api/v1/bookings/${bookingId}/cancel`,
        { withCredentials: true }
      );
      if (res.data.success) {
        alert('Booking cancelled');
        fetchBookings(); // refresh list
      }
    } catch (err) {
      console.error('Cancel booking failed:', err);
      alert('Failed to cancel booking');
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-gray-600">You have no bookings yet.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="border p-6 rounded-xl shadow-sm bg-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-rose-600">{booking.hotelId.name}</h2>
                <span
                  className={`text-sm font-medium ${
                    booking.status === 'cancelled' ? 'text-red-500' : 'text-green-600'
                  }`}
                >
                  {booking.status}
                </span>
              </div>
              <p className="text-gray-500 mb-1">Location: {booking.hotelId.location}</p>
              <p className="text-gray-600">Room: {booking.roomId.title}</p>
              <p className="text-gray-600">Room Number: {booking.roomNumber}</p>
              <p className="text-gray-600">Check-in: {new Date(booking.checkIn).toLocaleDateString()}</p>
              <p className="text-gray-600">Check-out: {new Date(booking.checkOut).toLocaleDateString()}</p>
              <p className="text-gray-800 font-semibold mt-2">Total: ₹{booking.totalPrice}</p>

              {booking.status !== 'cancelled' && (
                <button
                  onClick={() => handleCancelBooking(booking._id)}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
