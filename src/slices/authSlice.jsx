import { createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit'
import React, { useState } from 'react'




// Login vaild check share store

const initialState = {
    isLogin: false,
    isUser: null,
    isLoggedIn: false,
}


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginUserFn: (state, action) => {
            state.isUser = action.payload
            localStorage.setItem("isLoggedIn", "1");
            localStorage.setItem("isUser", JSON.stringify(action.payload));
            state.isLoggedIn = true;
            state.isLogin = true;
            //when login, Turn State >> True

        },
        logOutUserFn: (state) => {
            state.isUser = null
            state.isLogin = false;
            state.isLoggedIn = false;
            localStorage.removeItem("isLoggedIn");
        }
    }
})

export const { loginUserFn, logOutUserFn } = authSlice.actions

export default authSlice 