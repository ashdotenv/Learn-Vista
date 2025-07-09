import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: "",
    user: ""
}
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        userRegistration: (state, action) => {
            state.token = action.payload.token
        },
        userLogedIn: (state, action) => {
            state.token = action.payload.accessToken
            state.user = action.payload.user
        },
        userLoggedOut: (state) => {
            state.token = ""
            state.user = ""
        }

    }
})
export const { userRegistration, userLogedIn, userLoggedOut } = authSlice.actions
export default authSlice.reducer