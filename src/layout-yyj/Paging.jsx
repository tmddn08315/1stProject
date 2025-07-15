import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { nextPage, prevPage, setPage } from '../slices/pagingSlice'

const Paging = ({totalItems, currentPage, itemsPerPage, onPageChange}) => {
  // const dispatch = useDispatch()
  // const { currentPage, itemsPerPage } = useSelector((state) => state.paging)
  const handlePageClick = (page) => {
    window.scrollTo(0,0)
    onPageChange(page)    
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const groupSize = 2
  const groupIndex = Math.floor((currentPage - 1) / groupSize)

  const startPage = groupIndex * groupSize + 1
  const endPage = Math.min(startPage + groupSize - 1, totalPages)

  const pageNumbers = []
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }
  
  return (
    <div className="paging-yj">
      <button onClick={() => handlePageClick(currentPage - 1)} 
      disabled={currentPage === 1}
      >
        이전
      </button>

      {pageNumbers.map((page) => (
        page <= totalPages && (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={currentPage === page ? 'active' : 'nonActive'}
          >
            {page}    
          </button>
        )
      ))}

      <button onClick={() => handlePageClick(currentPage + 1)}
      disabled={currentPage === totalPages}
      >
        다음
      </button>
    </div>
  )
}

export default Paging