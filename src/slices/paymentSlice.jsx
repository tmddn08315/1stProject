import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const payment = {
  paymentData: [],
  paymentItems: [],
  paymentMemberData: [],
  totalRevenue: 0,
  monthlyRevenue: {}
}

const paymentSlice = createSlice({
  name:'payment',
  initialState: payment,
  reducers: {
    addPayment(state, action) {
      const num = state.paymentData.findIndex(el => {
        return el.id === action.payload.id
      })
      if (num === -1) {
        console.log(action.payload, ' <<')
        state.paymentData.push(action.payload)
      } else {
        state.paymentData[num] = action.payload
      }
      state.totalRevenue += action.payload.paymentAmount || 0

      // if (action.payload.date) {
      //   const [year, month] = action.payload.date.split('/')
      //   const yearMonth = `${year}/${month}`

      //   if (!state.monthlyRevenue[yearMonth]) {
      //     state.monthlyRevenue[yearMonth] = 0
      //   }
      //   state.monthlyRevenue[yearMonth] += action.payload.paymentAmount || 0
      // }
    },
    setPaymentItems(state, action) {
      state.paymentItems = action.payload
    },
    pushPaymentData : (state, action) => {
      state.paymentData.push(action.payload)
    }
  }
})


// export const monthlyRevenue = (state) => {
//   const data = state.payment.paymentData
//   const monthly = {}

//   data.forEach((payment) => {
//     const date = payment.date
//     if (!date) return;

//     const [year, month] = date.split('/')
//     const yearMonth = `${year}/${month}`

//     if(!monthly[yearMonth]) {
//       monthly[yearMonth] = 0
//     }
//     monthly[yearMonth] += payment.paymentAmount || 0
//   })
//   return monthly
// }
export const { addPayment, setPaymentItems, pushPaymentData } = paymentSlice.actions
export default paymentSlice