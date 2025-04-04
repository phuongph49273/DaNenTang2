import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { pokemonApi } from './pokemon';
import counterReducer from "./counterSlice";
import { userApi } from './api';

export const store = configureStore({
    reducer: {
      [pokemonApi.reducerPath]: pokemonApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      counter: counterReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokemonApi.middleware, userApi.middleware),
  });
  

setupListeners(store.dispatch);


export default store;