import React, { useState ,useEffect } from 'react'
// import axios from 'axios'
import axiosInstance from '../utils/axiosInstance.js'
import { HotelCard } from '../components/HotelCard.jsx'

const Home = () => {

  const [hotels, setHotels] = useState([])
  //fetching hotel from api using axios and storing t in hotels state
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/hotel/`);
        setHotels(response.data.hotels);
        // console.log('fetched data : ',response.data);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };
    fetchHotels();
  }, []);

  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="container mt-12 flex flex-col items-center justify-center bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {hotels.map((hotel) => (
          <HotelCard key={hotel._id} hotel={hotel} />
        ))}
      </div>
    </div>
    </div>
  )
}

export default Home