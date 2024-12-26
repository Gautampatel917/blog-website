import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import userReducer from './user/userSlice'
import themeReducer from './theme/themeSlice'
import storage from 'redux-persist/lib/storage'; // Import storage

const rootReducer = combineReducers({
    user: userReducer,
    theme: themeReducer,
    // Add other reducers here
});

// Persist configuration
const persistConfig = {
    key: 'root',
    storage,
    version: 1,
};
// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
    reducer: {
        user: persistedReducer, // Use the persisted reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(
        { serializableCheck: false },
    ),
});

// Create a persistor
export const persistor = persistStore(store);