import React from 'react'
import { useNavigate } from 'react-router-dom'

export const HotelCard = ({ hotel }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/hotel/${hotel._id}`);
  };

  return (
    <div key={hotel._id} onClick={handleCardClick} className="cursor-pointer border rounded-lg overflow-hidden shadow-md">
      <img src={hotel.photos} alt={hotel.name} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-semibold">{hotel.name}</h2>
        <p className="text-gray-600">{hotel.location}</p>
        <p className="text-gray-800 font-bold-400 text-md">{`₹${hotel.cheapestPrice} per night`}</p>
      </div>
    </div>
  )
}
