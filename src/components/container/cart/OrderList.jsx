import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addCart } from '../../../slices/cartSlice'
import AddToCartModal from './AddToCartModal'
import { useNavigate } from 'react-router-dom'
import Paging from '../../../layout-yyj/Paging'

const OrderList = () => {

  useEffect(() => {
    window.scrollTo(0,0)
  },[])

  const loginUser = useSelector((state) => state.auth.isUser)
  const [myOrders, setMyOrders] = useState([])
  const [openIndex, setOpenIndex] = useState([])

  const [expandedOrders, setExpandedOrders] = useState([])

  const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const start = (currentPage - 1) * itemsPerPage
    const pagedItems = myOrders.slice(start, start + itemsPerPage)
  
  const toggleOrderItems = (orderIdx) => {
    setExpandedOrders(prev => {
      const idx = prev.findIndex(i => i === orderIdx)
      if (idx !== -1) {
        return prev.filter(i => i !== orderIdx)
      } else {
        return [...prev, orderIdx]
      }
    })
  }
  
  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const res = await axios.get('http://localhost:3001/orders')
        let myOrders = res.data.filter(order => order.userId === loginUser.id)

        myOrders = myOrders.sort((a,b) => new Date(b.date) - new Date(a.date))

        setMyOrders(myOrders)
      } catch(error) {
        console.error('결제 내역 불러오기 실패 : ', error)
      }
    }
    if (loginUser) {
      fetchMyOrders()
    }
  }, [loginUser])
  
  const [addCartModal, setAddCartModal] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const addToCart = (item) => {
    const {id, title, price, img, hoverImg} = item
    const orderedItem = {id, title,price, img, hoverImg, count:1}
    dispatch(addCart(orderedItem))
    setAddCartModal(true)
  }
  
  if (!loginUser) {
    return <p>로그인이 필요합니다.</p>
  }

  return (
    <>
      <div className="orderList">
        <div className="orderList-con">
          <h2>{loginUser.userName}님의 주문 내역</h2>
          {myOrders.length === 0 ? (
            <p>주문 내역이 없습니다.</p>
          ): (
            <ul>
              {pagedItems.map((order, idx) => {
                const isOpen = expandedOrders.findIndex(i => i ===idx) !== -1

                return (
                  <li key={order.id}>
                    <div className="order-info">
                      <p><strong>결제일 </strong>: {order.date}</p>
                      <p><strong>결제 방법 </strong>: {order.paymentMethod}</p>
                      <p><strong>결제 금액 </strong>: {order.paymentAmount.toLocaleString()}</p>
                      <p><strong>주문처 </strong>: {order.shop}</p>

                      <p><strong>주문 상품</strong></p>                      
                    </div>
                    <div className="order-items">
                      <ul>
                        {(isOpen ? order.paymentResult : order.paymentResult.slice(0, 1)).map((item, i) => (
                          <li key={i}>
                            <div className="od-img">
                              <img src={`/images/${item.img}`} alt={item.img} />
                            </div>
                              <div className="title">
                                <p className='title'>{item.title}</p>
                                <div className="title-detail">
                                  <div className="title-detail-btn">
                                    <p className='pricej'>{item.price}원</p>  
                                    <p className='count'>{item.count}개</p>
                                  </div>
                                  <button onClick={() => addToCart(item)}>장바구니 담기</button>
                                </div>
                              </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {order.paymentResult.length > 1 && (
                      <button 
                        onClick={() => toggleOrderItems(idx)}>
                        {isOpen ? '접기 ▲' : '더보기 ▼'}
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
        <Paging 
          totalItems={myOrders.length}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)} 
        />
      {addCartModal && (
        <AddToCartModal onCart={() => navigate('/cart')} onClose={() => setAddCartModal(false)}/>
      )}
    </>
  )
}

export default OrderList