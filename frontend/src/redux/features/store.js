import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "../api/apiSlice";
import authReducer from '../features/auth/authSlice.js'
import favoritesReducer from '../features/favorites/favoriteSlice.js'
import cartSliceReducer from "./cart/carSlice.js";
import shopReducer from "./shop/shopSlice.js";
import { getFavoritesFromLocalStorage } from "../../Utils/localStorage.js";

const initialFavorites = getFavoritesFromLocalStorage() || []

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    favorites: favoritesReducer,
    cart: cartSliceReducer,
    shop: shopReducer,
  },

  preloadedState: {
    favorites: initialFavorites
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);
export default store;
