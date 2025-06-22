import './App.css';
import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';
import { BrowserRouter as Router , Routes , Route} from 'react-router-dom';
import HotelDetails from './pages/HotelDetails.jsx';
import RoomDetails from './pages/RoomDetails.jsx';
import SearchResults from './pages/SearchResults.jsx';
import MyBookings from './pages/MyBooking.jsx';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axiosInstance from './utils/axiosInstance.js';
import { login, logout, setLoading } from './redux/slices/authSlice.js';
import AdminDashboard from './pages/AdminDashboard.jsx';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
  const checkAuth = async () => {
    dispatch(setLoading(true));
    try {
      const res = await axiosInstance.get('/api/v1/auth/me');
      if (res.data?.user) {
        dispatch(login(res.data.user));
      } else {
        dispatch(logout());
      }
    } catch (err) {
      dispatch(logout());
    } finally {
      dispatch(setLoading(false));
    }
  };

  checkAuth();
}, [dispatch]);

  return (
    <Router>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/hotel/:id' element={<HotelDetails/>}/>
        <Route path='/room/:id' element={<RoomDetails/>}/>
        <Route path='/search' element={<SearchResults/>}/>
        <Route path='/my-bookings' element={<MyBookings/>}/>
        <Route path='/admin' element={<AdminDashboard/>}/>
      </Routes>
    </Router>
  );
}

export default App;
