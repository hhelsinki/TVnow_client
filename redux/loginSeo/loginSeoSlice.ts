import { createSlice } from "@reduxjs/toolkit"

interface LoginSeoState {
    enable: boolean
}

const initialState:LoginSeoState = {
    enable: false
}

export const loginSeoSlice = createSlice({
    name: 'loginSeo',
    initialState,
    reducers: {
        toggleLogin: (state) => {
            state.enable = !state.enable
        }
    }
});

export const {toggleLogin} = loginSeoSlice.actions;

export default loginSeoSlice.reducer;