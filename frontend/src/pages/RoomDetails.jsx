import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance.js';

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axiosInstance.get(`/api/v1/room/${id}`);
        setRoom(res.data.room);
        const hotelRes = await axiosInstance.get(`/api/v1/hotel/${res.data.room.hotelId}`);
        setHotel(hotelRes.data.hotel);
      } catch (err) {
        console.error('Error fetching room details', err);
      }
    };
    fetchRoom();
  }, [id]);

  if (!room || !hotel) return <p className="text-center mt-20">Loading...</p>;

  // const handleBooking = () => {
  //   console.log({ checkIn, checkOut, guests });
  //   // Add booking logic
  // };
  const handleBooking = async () => {
  if (!checkIn || !checkOut) {
    alert('Please select both check-in and check-out dates.');
    return;
  }

  try {
    const res = await axiosInstance.post(
      '/api/v1/bookings/book',
      {
        roomId: room._id,
        hotelId: hotel._id,
        checkIn,
        checkOut,
        guests,
      },
      {
        withCredentials: true,
      }
    );

    if (res.data.success) {
      alert('Room booked successfully!');
      // Optionally, navigate to the MyBookings page:
      // navigate('/my-bookings');
    }
  } catch (error) {
    console.error('Booking failed:', error);
    alert(error?.response?.data?.message || 'Failed to book the room.');
  }
};


  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Section 1: Title and Description */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{room.title}</h1>
        <p className="text-lg text-gray-600">{room.description}</p>
      </div>

      {/* Section 2: Photo Gallery */}
      <div className="grid grid-cols-3 gap-2 mb-8">
        <div className="col-span-2">
          <img src={room.photos[0]} alt="Main" className="w-full h-96 object-cover rounded-lg" />
        </div>
        <div className="flex flex-col gap-2">
          <img src={room.photos[1] || room.photos[0]} alt="Small 1" className="h-48 object-cover rounded-lg" />
          <img src={room.photos[2] || room.photos[0]} alt="Small 2" className="h-48 object-cover rounded-lg" />
        </div>
        {room.photos.length > 3 && (
          <p className="text-blue-600 text-sm col-span-3 cursor-pointer mt-2">+ View more photos</p>
        )}
      </div>

      {/* Section 3: Info + Booking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Info */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
        {/* Room Details */}
        <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">🏨 Room Details</h2>
            <div className="space-y-2 text-gray-700">
            <p className="text-lg"><span className="font-semibold">💰 Price:</span> ₹{room.price} / night</p>
            <p className="text-lg"><span className="font-semibold">👥 Max People:</span> {room.maxPeople}</p>
            <p className="text-lg"><span className="font-semibold">🛏️ Available Rooms:</span> {room.roomNumbers.length}</p>
            </div>
        </div>

        {/* Hotel Info */}
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">🏨 Hotel Info</h2>
            <div className="space-y-2 text-gray-700">
            <p className="text-xl font-semibold text-gray-900">{hotel.name}</p>
            <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
            <p className="text-sm text-gray-500 mt-1">📍 Location: <span className="italic">{hotel.location}</span></p>
            </div>
        </div>
        </div>


        {/* Right Booking Form */}
        <div className="border rounded-lg shadow-md p-6 h-fit">
          <h3 className="text-xl font-bold mb-4">Book this room</h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium">Check-In</label>
              <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium">Check-Out</label>
              <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium">Guests</label>
              <input type="number" min={1} value={guests} onChange={e => setGuests(e.target.value)} className="w-full border p-2 rounded" />
            </div>
            <button
              onClick={handleBooking}
              className="bg-rose-500 text-white py-2 px-4 rounded-full hover:bg-rose-600 transition"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
