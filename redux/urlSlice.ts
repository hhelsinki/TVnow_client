import { createSlice } from "@reduxjs/toolkit";

interface URL {
    api: string,
    key: string
}

const initialState:URL = {
    api: 'http://localhost:3001/',
    key: 'vid:0Uhh9SSorq/bgkOYKnQ9A2q='
}

export const urlSlice = createSlice({
    name: 'url',
    initialState,
    reducers: {}
});

export default urlSlice.reducer;