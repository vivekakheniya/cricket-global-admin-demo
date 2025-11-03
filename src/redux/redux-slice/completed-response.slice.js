import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  CompletedResponse: [],
};

//internally using immer lib (can create mutable state)
export const completedResponseSlice = createSlice({
  name: "completedResponse",
  initialState,
  reducers: {
    updateAllCompletedResponse: (state, action) => {
      state.CompletedResponse = action.payload;
    },
  },
});

// this is for dispatch
export const { updateAllCompletedResponse } = completedResponseSlice.actions;

// this is for configureStore
export default completedResponseSlice.reducer;
