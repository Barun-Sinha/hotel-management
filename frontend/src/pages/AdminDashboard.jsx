import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance.js'; 

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'user' });

  const [showAddHotelModal, setShowAddHotelModal] = useState(false);
  const [newHotel, setNewHotel] = useState({
  name: '',
  title: '',
  destination: '',
  location: '',
  description: '',
  rating: '',
  cheapestPrice: '',
  photos: [],
});

  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [newRoom, setNewRoom] = useState({
  title: '',
  description: '',
  price: '',
  maxPeople: '',
  photos: '',
  roomNumbers: '',
});

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'hotels') fetchHotels();
  }, [activeTab]);

  const fetchUsers = async () => {
    const res = await axiosInstance.get('/api/v1/admin/users', { withCredentials: true });
    setUsers(res.data);
  };

  const fetchHotels = async () => {
    const res = await axiosInstance.get('/api/v1/hotel', { withCredentials: true });
    setHotels(res.data.hotels);
  };

  const handleAddUser = async () => {
    const res = await axiosInstance.post('/api/v1/admin/users', newUser, { withCredentials: true });
    setUsers(prev => [...prev, res.data.user]);
    setShowAddUserModal(false);
    setNewUser({ username: '', email: '', password: '', role: 'user' });
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await axiosInstance.delete(`/api/v1/admin/users/${userId}`, { withCredentials: true });
    setUsers(prev => prev.filter(u => u._id !== userId));
  };

  const handleAddHotel = async () => {
  try {
    const res = await axiosInstance.post(
      '/api/v1/hotel/create',
      {
        ...newHotel,
        rating: Number(newHotel.rating),
        cheapestPrice: Number(newHotel.cheapestPrice),
        photos: Array.isArray(newHotel.photos) ? newHotel.photos : [], // Ensures it's an array
      },
      { withCredentials: true }
    );

    setHotels(prev => [...prev, res.data.hotel]);
    setShowAddHotelModal(false);
    setNewHotel({
      name: '',
      title: '',
      destination: '',
      location: '',
      description: '',
      rating: '',
      cheapestPrice: '',
      photos: [],
    });
  } catch (err) {
    console.error('Error adding hotel:', err);
    alert('Failed to add hotel');
  }
};



  const handleDeleteHotel = async (hotelId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    await axiosInstance.delete(`/api/v1/hotel/${hotelId}`, { withCredentials: true });
    setHotels(prev => prev.filter(h => h._id !== hotelId));
  };

  const handleSelectHotel = async (hotelId) => {
    const res = await axiosInstance.get(`/api/v1/hotel/${hotelId}`, { withCredentials: true });
    setSelectedHotel(res.data.hotel);
  };

  const handleAddRoom = async () => {
  const roomToSubmit = {
    title: newRoom.title,
    description: newRoom.description,
    price: Number(newRoom.price),
    maxPeople: Number(newRoom.maxPeople),
    photos: newRoom.photos.split(',').map(p => p.trim()),
    roomNumbers: newRoom.roomNumbers
      .split(',')
      .map(n => ({ number: Number(n.trim()) })),
  };

  try {
    const res = await axiosInstance.post(
      `/api/v1/room/${selectedHotel._id}`,
      roomToSubmit,
      { withCredentials: true }
    );

    setSelectedHotel(prev => ({
      ...prev,
      rooms: [...prev.rooms, res.data.room],
    }));

    setNewRoom({
      title: '',
      description: '',
      price: '',
      maxPeople: '',
      photos: '',
      roomNumbers: '',
    });
    setShowAddRoomModal(false);
  } catch (err) {
    console.error('Error adding room:', err);
    alert('Failed to add room');
  }
};




  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    await axiosInstance.delete(`/api/v1/room/${roomId}/${selectedHotel._id}`, { withCredentials: true });
    setSelectedHotel(prev => ({ ...prev, rooms: prev.rooms.filter(r => r._id !== roomId) }));
  };

  return (
  <div className="flex flex-col md:flex-row font-sans text-gray-800">
    {/* Sidebar */}
    <div className="w-full md:w-64  bg-[#FF385C] text-white p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <ul className="space-y-4">
          <li>
            <button
              className={`w-full text-left py-2 px-4 rounded-lg transition ${activeTab === 'users' ? 'bg-white text-[#FF385C] font-bold shadow' : 'hover:bg-[#d60b30]'}`}
              onClick={() => setActiveTab('users')}
            >Users</button>
          </li>
          <li>
            <button
              className={`w-full text-left py-2 px-4 rounded-lg transition ${activeTab === 'hotels' ? 'bg-white text-[#FF385C] font-bold shadow' : 'hover:bg-[#d60b30]'}`}
              onClick={() => setActiveTab('hotels')}
            >Hotels</button>
          </li>
        </ul>
      </div>

    {/* Main Content */}
    <div className="flex-1 p-4 sm:p-6 md:p-10 bg-gray-50 min-h-screen overflow-y-auto">
      {activeTab === 'users' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Users</h2>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="bg-[#FF385C] hover:bg-[#d60b30] text-white px-5 py-2 rounded-lg transition shadow"
            >
              + Add User
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map(user => (
              <div
                key={user._id}
                className="bg-white p-4 rounded-lg shadow-md relative hover:shadow-lg transition"
              >
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                >
                  ✕
                </button>
                <p className="font-semibold text-lg">{user.username}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-500 mt-1">Role: {user.role}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'hotels' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Hotels</h2>
            <button
              onClick={() => setShowAddHotelModal(prev => !prev)}
              className="bg-[#FF385C] hover:bg-[#d60b30] text-white px-5 py-2 rounded-lg transition shadow"
            >
              + Add Hotel
            </button>
          </div>

          <div className="space-y-6">
            {hotels.map(hotel => (
              <div
                key={hotel._id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3
                      className="text-xl font-semibold text-[#d60b30] cursor-pointer"
                      onClick={() => handleSelectHotel(hotel._id)}
                    >
                      {hotel.name}
                    </h3>
                    <p className="text-sm text-gray-600">{hotel.location}</p>
                    <p className="text-xs text-gray-500 mt-1">{hotel.description}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteHotel(hotel._id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>

                {selectedHotel && selectedHotel._id === hotel._id && (
                  <div className="mt-4 bg-gray-50 p-4 rounded border">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-semibold text-[#d60b30]">Rooms</h4>
                      <button
                        onClick={() => setShowAddRoomModal(true)}
                        className="bg-[#FF385C] hover:bg-[#d60b30] text-white px-3 py-1 text-sm rounded transition"
                      >
                        + Add Room
                      </button>
                    </div>
                    <ul className="space-y-2">
                      {selectedHotel.rooms.map(room => (
                        <li
                          key={room._id}
                          className="flex justify-between items-center bg-white p-3 rounded shadow-sm"
                        >
                          <div>
                            <p className="font-medium text-gray-800">{room.title}</p>
                            <p className="text-sm text-gray-500">₹{room.price}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteRoom(room._id)}
                            className="text-red-500 text-sm hover:underline"
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>

    {/* Modals */}

    {showAddUserModal && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md relative">
          <h2 className="text-xl font-semibold mb-4">Add New User</h2>
          <button
            onClick={() => setShowAddUserModal(false)}
            className="absolute top-2 right-2 text-gray-600 hover:text-black"
          >
            ✕
          </button>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={e => setNewUser({ ...newUser, username: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={e => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={e => setNewUser({ ...newUser, password: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />
            <select
              value={newUser.role}
              onChange={e => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={handleAddUser}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full"
            >
              Add User
            </button>
          </div>
        </div>
      </div>
    )}
    
    {showAddHotelModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white p-6 rounded shadow-lg w-[400px] max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4">Add New Hotel</h3>
          <input type="text" placeholder="Name" value={newHotel.name} onChange={e => setNewHotel({ ...newHotel, name: e.target.value })} className="w-full border p-2 mb-2 rounded" />
          <input type="text" placeholder="Title" value={newHotel.title} onChange={e => setNewHotel({ ...newHotel, title: e.target.value })} className="w-full border p-2 mb-2 rounded" />
          <input type="text" placeholder="Destination" value={newHotel.destination} onChange={e => setNewHotel({ ...newHotel, destination: e.target.value })} className="w-full border p-2 mb-2 rounded" />
          <input type="text" placeholder="Location" value={newHotel.location} onChange={e => setNewHotel({ ...newHotel, location: e.target.value })} className="w-full border p-2 mb-2 rounded" />
          <textarea placeholder="Description" value={newHotel.description} onChange={e => setNewHotel({ ...newHotel, description: e.target.value })} className="w-full border p-2 mb-2 rounded" />
          <input type="number" placeholder="Rating" value={newHotel.rating} onChange={e => setNewHotel({ ...newHotel, rating: e.target.value })} className="w-full border p-2 mb-2 rounded" />
          <input type="number" placeholder="Cheapest Price" value={newHotel.cheapestPrice} onChange={e => setNewHotel({ ...newHotel, cheapestPrice: e.target.value })} className="w-full border p-2 mb-2 rounded" />
          <input type="text" placeholder="Photos (comma-separated)" value={newHotel.photos} onChange={e => setNewHotel({ ...newHotel, photos: e.target.value.split(',') })} className="w-full border p-2 mb-4 rounded" />
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowAddHotelModal(false)} className="px-4 py-2 border rounded">Cancel</button>
            <button onClick={handleAddHotel} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
          </div>
        </div>
      </div>
    )}

    {showAddRoomModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white p-6 rounded shadow-lg w-[500px]">
          <h3 className="text-xl font-semibold mb-4">Add New Room</h3>
          <input type="text" placeholder="Title" value={newRoom.title} onChange={(e) => setNewRoom({ ...newRoom, title: e.target.value })} className="w-full border p-2 mb-2 rounded" />
          <textarea placeholder="Description" value={newRoom.description} onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })} className="w-full border p-2 mb-2 rounded" />
          <input type="number" placeholder="Price" value={newRoom.price} onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })} className="w-full border p-2 mb-2 rounded" />
          <input type="number" placeholder="Max People" value={newRoom.maxPeople} onChange={(e) => setNewRoom({ ...newRoom, maxPeople: e.target.value })} className="w-full border p-2 mb-2 rounded" />
          <input type="text" placeholder="Photos (comma-separated)" value={newRoom.photos} onChange={(e) => setNewRoom({ ...newRoom, photos: e.target.value })} className="w-full border p-2 mb-2 rounded" />
          <input type="text" placeholder="Room Numbers (comma-separated)" value={newRoom.roomNumbers} onChange={(e) => setNewRoom({ ...newRoom, roomNumbers: e.target.value })} className="w-full border p-2 mb-4 rounded" />
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowAddRoomModal(false)} className="px-4 py-2 border rounded">Cancel</button>
            <button onClick={handleAddRoom} className="bg-green-600 text-white px-4 py-2 rounded">Add Room</button>
          </div>
        </div>
      </div>
    )}
  </div>


  );
};

export default AdminDashboard;
