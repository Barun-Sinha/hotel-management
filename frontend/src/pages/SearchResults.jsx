import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../utils/axiosInstance.js';
import { RoomCard } from '../components/RoomCard';

const SearchResults = () => {
  const search = useSelector((state) => state.search);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        const { location, checkIn, checkOut, guests } = search;

        // 1. Get all hotels in the location
        const res = await axiosInstance.get(`/api/v1/hotel/city/${location}`);
        const hotels = res.data.hotels;

        const plannedDates = [];
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        // 2. Create plannedDates array in ISO format
        for (
          let d = new Date(checkInDate);
          d < checkOutDate;
          d.setDate(d.getDate() + 1)
        ) {
          plannedDates.push(new Date(d).toISOString().split('T')[0]);
        }

        const availableRooms = [];

        // 3. Loop through each hotel
        for (const hotel of hotels) {
          const roomRes = await axiosInstance.get(`/api/v1/room/byHotel/${hotel._id}`);
          const rooms = roomRes.data.rooms;

          for (const room of rooms) {
            if (room.maxPeople < guests) continue;

            const isAvailable = room.roomNumbers.some((roomNumber) => {
              return plannedDates.every((plannedDate) => {
                return roomNumber.unavailableDates.every((unavailable) => {
                  const unavailDate = new Date(unavailable).toISOString().split('T')[0];
                  return plannedDate !== unavailDate;
                });
              });
            });

            if (isAvailable) {
              availableRooms.push({ ...room, hotelName: hotel.name });
            }
          }
        }

        setRooms(availableRooms);
      } catch (error) {
        console.error('Error fetching available rooms:', error);
      }
    };

    fetchAvailableRooms();
  }, [search]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Available Rooms</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <RoomCard key={room._id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
