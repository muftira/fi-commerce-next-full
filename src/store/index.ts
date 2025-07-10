import { configureStore, combineReducers } from '@reduxjs/toolkit';
import sidebarReducer from './slices/sidebarSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // default: localStorage
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
  sidebar: sidebarReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['sidebar'], // only this slice will be persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
    }),
});
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
