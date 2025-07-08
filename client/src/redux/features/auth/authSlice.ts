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
        }
    }
})
export const { userRegistration } = authSlice.actions