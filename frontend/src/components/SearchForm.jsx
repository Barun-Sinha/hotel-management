import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchParams } from '../redux/slices/searchSlice';

const SearchForm = ({ setShowSearch }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(0);

  const handleSearch = () => {
    const searchParams = { location, checkIn, checkOut, guests };
    dispatch(setSearchParams(searchParams));
    setShowSearch(false);
    navigate('/search');

  };

  return (
    <div className="flex gap-2 p-4 items-center justify-center bg-white shadow-md rounded-xl">
      <div>
          <label className="text-xs font-medium text-gray-700 uppercase mb-1 block">Where</label>
          <input
            type="text"
            placeholder="Search locations"
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rose-400"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 uppercase mb-1 block">Check in</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rose-400"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
     <div>
          <label className="text-xs font-medium text-gray-700 uppercase mb-1 block">Check out</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rose-400"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
      
      <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-end">
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-700 uppercase mb-1 block">Guests</label>
            <input
              type="number"
              min={1}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rose-400"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
          </div>
          <button
            onClick={handleSearch}
            className="mt-2 md:mt-0 bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl transition-all duration-300"
          >
            🔍 Search
          </button>
        </div>
    </div>
  );
};

export default SearchForm;
