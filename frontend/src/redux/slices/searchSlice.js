import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    location:"",
    checkIn:"",
    checkOut:"",
    guests:1,
}

const searchSlice = createSlice({
    name:"search",
    initialState,
    reducers:{
        setSearchParams: (state, action) => {
            return {
                ...state,
                ...action.payload,
            };
        },
        resetSearch: () => initialState,
    },
});

export const { setSearchParams, resetSearch } = searchSlice.actions;

export default searchSlice.reducer;
