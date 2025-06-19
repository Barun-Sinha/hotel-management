// src/utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api/v1', // base API URL
  withCredentials: true, // send cookies (e.g. access_token)
});

export default axiosInstance;
