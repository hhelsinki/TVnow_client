import { createSlice } from "@reduxjs/toolkit";

interface WishlistState {
    filled: boolean,
    saved: boolean
}
const initialState:WishlistState = {
    filled: false,
    saved: false
}


export const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        toggleWishlist: (state) => {
            state.filled = !state.filled
        },
        toggleSave: (state) => {
            state.saved = !state.saved
        }
    }
})


export const {toggleWishlist, toggleSave} = wishlistSlice.actions;

export default wishlistSlice.reducer;

type WishListState = ReturnType<typeof wishlistSlice.getInitialState>;