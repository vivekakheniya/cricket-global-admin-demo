import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Student: [],
};

//internally using immer lib (can create mutable state)
export const studentSlice = createSlice({
  name: "studentData",
  initialState,
  reducers: {
    updateAllStudents: (state, action) => {
      state.Student = action.payload;
    },
  },
});

// this is for dispatch
export const { updateAllStudents } = studentSlice.actions;

// this is for configureStore
export default studentSlice.reducer;
