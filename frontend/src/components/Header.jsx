import React, { useEffect, useRef, useState } from 'react';
import SearchForm from './SearchForm';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice.js';
import axiosInstance from '../utils/axiosInstance.js';
import AuthModal from './AuthModal.jsx';

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const toggleSearch = () => setShowSearch(prev => !prev);
  const toggleUserDropdown = () => setShowDropdown(prev => !prev);
  const toggleMobileMenu = () => setShowMobileMenu(prev => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSearch(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSearch, showDropdown]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/api/v1/auth/logout', {}, { withCredentials: true });
      dispatch(logout());
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <>
      <div className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 flex justify-center">
        <div className="container flex flex-col md:flex-row items-center justify-between py-4 px-4 md:px-16 gap-y-4">
          
          {/* Logo */}
          <div className="flex justify-between items-center w-full md:w-auto">
            <Link to="/">
              <img className="w-28 md:w-32" src="/Airbnb_logo.svg" alt="Hotel Management System" />
            </Link>
            <button className="md:hidden" onClick={toggleMobileMenu}>
              <img src="/menu.svg" alt="menu" className="w-6" />
            </button>
          </div>

          {/* Search (hidden on small screens) */}
          <div
            className="hidden md:flex items-center gap-4 border border-gray-300 rounded-full px-4 py-2 cursor-pointer"
            onClick={toggleSearch}
          >
            <button className="btn">Anywhere</button>
            <p className="text-gray-500">|</p>
            <button className="btn">Any week</button>
            <p className="text-gray-500">|</p>
            <button className="btn">Add guests</button>
            <img
              className="w-8 p-2 border rounded-full"
              style={{ backgroundColor: '#FF385C' }}
              src="/search2.png"
              alt="search"
            />
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-5">
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="text-blue-600 font-semibold hover:underline"
              >
                Admin
              </button>
            )}
            <button><img className="w-5" src="/language_image.png" alt="language" /></button>

            {user ? (
              <div ref={userDropdownRef} className="relative">
                <button onClick={toggleUserDropdown}>
                  <img className="w-5" src="/more.png" alt="more" />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded-md w-40 z-50">
                    <Link
                      to="/my-bookings"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      My Bookings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="text-rose-500 font-semibold hover:underline"
                onClick={() => setShowAuthModal(true)}
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Dropdown */}
          {showMobileMenu && (
            <div className="md:hidden w-full mt-2 bg-white shadow rounded-md border px-4 py-3 space-y-3">
              <div
                onClick={toggleSearch}
                className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 cursor-pointer"
              >
                <span className="text-sm text-gray-600">Search</span>
                <img className="w-5" src="/search2.png" alt="search" />
              </div>

              {user?.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="block text-blue-600 hover:underline"
                >
                  Admin
                </button>
              )}

              {user ? (
                <>
                  <Link
                    to="/my-bookings"
                    className="block text-gray-700 hover:underline"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    My Bookings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-red-500 hover:underline"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  className="text-rose-500 font-semibold hover:underline"
                  onClick={() => {
                    setShowAuthModal(true);
                    setShowMobileMenu(false);
                  }}
                >
                  Login
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Spacer */}
      <div className="h-[80px]" />

      {/* Search Bar Modal */}
      {showSearch && (
        <div className="flex justify-center mt-4">
          <div ref={dropdownRef} className="w-[90%] md:w-[80%] bg-white shadow-md rounded-xl z-40">
            <SearchForm setShowSearch={setShowSearch} />
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
};

export default Header;
