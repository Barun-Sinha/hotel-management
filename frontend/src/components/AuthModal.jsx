import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axiosInstance from '../utils/axiosInstance.js';
import { login } from '../redux/slices/authSlice.js';

const AuthModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = mode === 'login' ? '/api/v1/auth/login' : '/api/v1/auth/register';
      const payload = mode === 'login'
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await axiosInstance.post(url, payload, { withCredentials: true });
      dispatch(login(res.data.user));
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-gray-500 text-xl">×</button>
        <h2 className="text-xl font-semibold text-center mb-6">{mode === 'login' ? 'Login' : 'Register'}</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full border rounded-lg p-3"
              value={formData.username}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border rounded-lg p-3"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border rounded-lg p-3"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-lg"
            disabled={loading}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          {mode === 'login' ? 'Don\'t have an account?' : 'Already have an account?'}{' '}
          <button
            className="text-rose-500 underline font-medium"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
          >
            {mode === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
