import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from 'next-redux-wrapper';
import { userContent, userProfile } from "./userApi";
import urlReducer from './urlSlice';
import wishlist from './wishlist/wishlistSlice';
import loginSeo from './loginSeo/loginSeoSlice';

const makeStore = () => configureStore({
    reducer: {
        wishlist,
        loginSeo,
        url: urlReducer,
        [userContent.reducerPath]: userContent.reducer,
        [userProfile.reducerPath]: userProfile.reducer
    }, 
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([
        userContent.middleware,
        userProfile.middleware
    ])
})

export const wrapper = createWrapper(makeStore);