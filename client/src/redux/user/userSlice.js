import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    isLoading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            state.isLoading = false;
            state.currentUser = action.payload;
        },
        signInFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        signOutSuccess: (state) => {
            state.currentUser = null;
        },
        updateProfilePicture: (state, action) => {
            state.currentUser.profilePicture = action.payload.profilePicture;
        },
        updateStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        updateFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        deleteUserStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.isLoading = false;
            state.error = null;
        },
        deleteUserFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        signOutSuccess: (state) => {
            state.currentUser = null;
            state.error = null;
            state.loading = false;
        },
    },
});

export const {
    signInStart,
    signInSuccess,
    signInFailure,
    signOutSuccess,
    updateProfilePicture,
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
} = userSlice.actions;

export default userSlice.reducer;