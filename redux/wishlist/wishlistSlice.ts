import { createSlice } from "@reduxjs/toolkit";

interface WishlistState {
    test: any
    filled: boolean
}
const initialState:WishlistState = {
    test: [],
    filled: false
}


export const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        toggleWishlist: (state) => {
            state.filled = !state.filled
        }
    }
})


export const {toggleWishlist} = wishlistSlice.actions;

export default wishlistSlice.reducer;