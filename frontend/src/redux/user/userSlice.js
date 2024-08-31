import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    signInFailure: (state) => {
      state.loading = false;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    updateUserFailed: (state) => {
      state.loading = false;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state, action) => {
      state.currentUser = null;
      state.loading = false;
    },
    deleteUserFailed: (state) => {
      state.loading = false;
    },
    signOutUserSuccess: (state, action) => {
      state.currentUser = null;
      state.loading = false;
    },
  },
});
export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserSuccess,
  updateUserFailed,
  updateUserStart,
  deleteUserFailed,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserSuccess,
} = userSlice.actions;

export default userSlice.reducer;
