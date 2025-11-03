import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Enroll: [],
};

//internally using immer lib (can create mutable state)
export const enrollSlice = createSlice({
  name: "enrollData",
  initialState,
  reducers: {
    updateAllEnroll: (state, action) => {
      state.Enroll = action.payload;
    },
  },
});

// this is for dispatch
export const { updateAllEnroll } = enrollSlice.actions;

// this is for configureStore
export default enrollSlice.reducer;
