import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Course: [],
};

//internally using immer lib (can create mutable state)
export const courseSlice = createSlice({
  name: "courseData",
  initialState,
  reducers: {
    updateAllCourse: (state, action) => {
      state.Course = action.payload;
    },
  },
});

// this is for dispatch
export const { updateAllCourse } = courseSlice.actions;

// this is for configureStore
export default courseSlice.reducer;
