import { configureStore } from '@reduxjs/toolkit'
import React from 'react'
import authSlice from '../slices/authSlice'
import cartSlice from '../slices/cartSlice'
import paymentSlice from '../slices/paymentSlice'
import pagingSlice from '../slices/pagingSlice'


const index = configureStore({
    reducer: {
        auth: authSlice.reducer,
        cart: cartSlice.reducer,
        payment: paymentSlice.reducer,
        paging: pagingSlice.reducer
    }

})
export default index