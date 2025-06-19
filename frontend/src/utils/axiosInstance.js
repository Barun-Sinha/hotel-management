// src/utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // base API URL
  withCredentials: true, // send cookies (e.g. access_token)
});

export default axiosInstance;
