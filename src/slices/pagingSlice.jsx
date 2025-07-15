import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentPage: 1,
  itemsPerPage: 6
}
const pagingSlice = createSlice({
  name: 'paging',
  initialState,
  reducers: {
    setPage(state, action) {
      state.currentPage = action.payload
    },
    nextPage(state, action) {
      if (state.currentPage < action.payload) {
        state.currentPage += 1
      }
    },
    prevPage(state) {
      if (state.currentPage > 1) {
        state.currentPage -= 1
      }
    },
    resetPage(state) {
      state.currentPage = 1
    }
  }
})

export const { setPage, nextPage, prevPage, resetPage } = pagingSlice.actions
export default pagingSlice