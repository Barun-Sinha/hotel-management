import React from 'react'
import { useNavigate } from 'react-router-dom'

export const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate(`/room/${room._id}`);
  };

  return (
    <div key={room._id} onClick={handleBookNow} className="cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        <img
        src={room.photos?.[0] || '/fallback.jpg'}
        alt={room.title}
        className="w-full h-48 object-cover"
        />
        <div className="p-4">
            <h3 className="text-xl font-bold mb-1 text-gray-800">{room.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{room.description}</p>
            <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">₹{room.price}</span>
                <span className="text-sm text-gray-500">Max {room.maxPeople} people</span>
            </div>
            <div className="mt-2">
                <span className={`text-sm font-medium ${room.roomNumbers.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {room.roomNumbers.length > 0 ? 'Available' : 'Not Available'}
                </span>
            </div>
        </div>
    </div>
  )
}
