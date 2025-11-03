import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Lesson: [],
};
//internally using immer lib (can create mutable state)
export const lessonSlice = createSlice({
  name: "lessonList",
  initialState,
  reducers: {
    updateAllLesson: (state, action) => {
      state.Lesson = action.payload;
    },
  },
});
// this is for dispatch
export const { updateAllLesson } = lessonSlice.actions;
// this is for configureStore
export default lessonSlice.reducer;
