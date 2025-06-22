import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance.js'; // Adjust the import path as necessary
import { RoomCard } from '../components/RoomCard';

const HotelDetails = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await axiosInstance.get(`/api/v1/hotel/${id}`);
        setHotel(res.data.hotel);
      } catch (err) {
        console.error('Failed to fetch hotel:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!hotel) return <p className="text-center text-red-500">Hotel not found</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Hotel Banner */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-800">{hotel.name}</h1>
        <p className="text-lg text-gray-600">{hotel.location}</p>
        {hotel.photos && (
          <img
            src={hotel.photos}
            alt={hotel.name}
            className="w-full h-[400px] object-cover rounded-xl mt-4 shadow-md"
          />
        )}
      </div>

      {/* Hotel Description */}
      {hotel.description && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">About This Place</h2>
          <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
        </div>
      )}

      {/* Room List */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Available Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotel.rooms.map((room) => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
