import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initState = {
  items: [],
  paymentItems:[]
}
const cartSlice = createSlice({
  name: 'cart',
  initialState: initState,
  reducers: {
    addCart:(state, action) => {
      const num = state.items.findIndex(el => {
        console.log(action.payload)
        return el.id === action.payload.id && el.title === action.payload.title
      })
      if (num === -1) {
        console.log(action.payload)
        state.items.push({ ...action.payload, checked: false})
      } else {
        state.items[num].count += action.payload.count
      }
    },
    deleteCart: (state, action) => {
      const idx = state.items.findIndex(el => {
        return el.id ===action.payload
      })
      if (idx === -1) {
        alert('선택된 상품이 없습니다.')
      } else {
        // alert('상품을 삭제합니다')
        // state.items.splice(idx,1)
        window.confirm('선택하신 상품을 삭제하겠습니까?') && state.items.splice(idx,1)
      }
    },
    increaseCount(state,action) {
      let num = state.items.findIndex((obj) => {
        return obj.id === action.payload;
      });
      state.items[num].count += 1;
    },
    decreaseCount(state,action) {
      let num = state.items.findIndex((obj) => {
        return obj.id === action.payload;
      });
      if (state.items[num].count === 1) state.items[num].count =1
      else state.items[num].count -= 1;
    },
    deleteItem(state, action) {
      let num = state.items.findIndex((obj) => {
        return obj.id === action.payload;
      });
      state.items.splice(num, 1);
    },
    deleteAllCart(state, action) {
      state.items.length = 0
    },
    checkedChange(state, action) {
      let num = state.items.findIndex((obj) => {
        return obj.id === action.payload;
      });
      state.items[num].checked = !state.items[num].checked;
    },
    allCheckedTrue(state, action) {
      state.items.forEach((obj) => {
        obj.checked = true;
      })
    },
    allCheckedFalse(state, action) {
      state.items.forEach((obj) => {
        obj.checked = false;  
      });
    },
    setPaymentItems(state, action) {
      state.paymentItems = action.payload
    },
    clearCart: (state) => {
      state.items = []
    },
    removePaidItems: (state) => {
      const paidId = state.paymentItems.map(item => item.id)
      state.items = state.items.filter(item => !paidId.includes(item.id))
      state.paymentItems = []
    }
  },
  extraReducers: (builder) => {
    builder.addCase(asyncAdminCartsFetch.pending, (state, action) => {
      state.status = 'pending'
    })
    builder.addCase(asyncAdminCartsFetch.fulfilled, (state, action) => {
      console.log('--------- asyncAdmingCartsFetch')
      console.log(action.payload)
      state.paymentItems = action.payload
      state.status = 'Complete'
    })
    builder.addCase(asyncAdminCartsFetch.rejected, (state, action) => {
      state.status ='Failed'
    })
  }
})

export const {deleteCart, addCart, increaseCount, decreaseCount, deleteAllCart, deleteItem, checkedChange, allCheckedFalse, allCheckedTrue, setPaymentItems, clearCart, removePaidItems } = cartSlice.actions
export default cartSlice

export const asyncAdminCartsFetch = createAsyncThunk('cart/asyncAdminCartsFetch',
  async () => {
    // const res = await axios.get(`${API_SERVER_HOST}/payment`)
    // const data = res.data
    // const arrData = data.filter(el => el.paymentResult)
    // console.log(arrData,' arrData')
    // return data
  }
)