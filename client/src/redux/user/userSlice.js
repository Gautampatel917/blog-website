import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false; // This should stop the loading state
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.loading = false; // This should also stop the loading state
            state.error = action.payload;
        },
        signoutSuccess: (state) => {
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
} = userSlice.actions;

export default userSlice.reducer;