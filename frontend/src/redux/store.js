import {configureStore} from '@reduxjs/toolkit';
import searchReducer from './slices/searchSlice.js';
import authReducer from './slices/authSlice.js';

export const store = configureStore({
    reducer:{
        search : searchReducer,
        auth: authReducer,
    },
});