import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { allCheckedFalse, allCheckedTrue, checkedChange, decreaseCount, deleteCart, increaseCount,setPaymentItems } from '../../../slices/cartSlice'
import { useNavigate } from 'react-router-dom'

const CartList = () => {

  useEffect(() => {
    window.scrollTo(0,0)
  },[])

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const cartItems = useSelector(state => state.cart.items)
  console.log(Array.isArray(cartItems)); // true여야 함

  console.log(cartItems)
  
  const checkedList = 
  cartItems.filter((item) => item.checked === true)

  // const isAllCheck = (checked) => {
  //   if(checked) {
  //     cartItems.forEach((item) => dispatch(allCheckedTrue(cartItems.id)))
  //   } else {
  //     cartItems.forEach((item) => dispatch(allCheckedFalse(cartItems.id)))
  //   }
  // }

  useEffect(() => {
    dispatch(allCheckedTrue())
  }, [dispatch])

  let totalSelectedPrice = 0;
  cartItems.forEach(item => {
    if (item.checked) {
      totalSelectedPrice += item.price * item.count
    }
  })

  let allChecked = true
  cartItems.forEach(item => {
    if (!item.checked) {
      allChecked = false;
    }
  })

  const deleteSelected = () => {
    cartItems.forEach(item => {
      if (item.checked) {
        dispatch(deleteCart(item.id))
      }
    })
  }

  // 총상품금액
  let totalPrice = 0;
  cartItems.forEach((item) => {
    totalPrice += item.price * item.count
  })

  // 수량
  let totalAmount = 0;
  cartItems.forEach((item) => {
    totalAmount += item.count
  })

  let totalSelectedAmount = 0;
  checkedList.forEach((item) => {
    totalSelectedAmount += item.count
  })

  // 로그인 여부
  const isLogin = useSelector(state => state.auth.isLogin)

  const payBtn = () => {
    // if (!isLogin) {
    //   setLoginModal(true)
    //   return
    // }
    if (!isLogin) {
      alert('로그인이 필요합니다.')
      navigate('/auth/login')
      return
    }
    if (checkedList.length === 0) {
      alert('선택된 상품이 없습니다.')
      return
    }
      if(window.confirm('주문을 진행하겠습니까?') ){
        dispatch(setPaymentItems(checkedList))
        navigate('/payment')

      }
    }
    
    
    console.log(setPaymentItems(checkedList))
  
  return (
    <div className="cartList">
      <div className="cartList-con">
        <h3 className="title">Shopping Cart</h3>
        <div className="cartItem-con">
          {cartItems.length > 0 &&
          <>            
            <div className="cartItemList">
              <ul>
                {cartItems && cartItems.map((el,idx) => {
                  return (
                    <li key={el.id}>
                      <div className="cartItem" key={idx}>
                        <div className="top">
                          <div className="id">
                            <input 
                            type="checkbox"
                            checked={el.checked} 
                            onChange={() => 
                            dispatch(checkedChange(el.id))}
                            />
                          </div>
                          <img src={`/images/${el.img}`} alt={el.img} />
                          <div className="top-con">
                            <p> {el.title}</p>
                            <span className="top-price">{el.price}원</span>
                          </div>
                        </div>
                        <div className="bottom">
                          <div className="cartCount">
                            <div className="cartCountBtn">
                              <button onClick={() => {
                                dispatch(decreaseCount(el.id))
                              }}>－</button>
                              <span className="count"> {el.count} </span>
                              <button onClick={() => {
                                dispatch(increaseCount(el.id))
                              }}>＋</button>
                            </div>
                            <span>{el.count * el.price}원</span>
                          </div>
                          <div className="delete-cart">
                            <span onClick={() => {
                            dispatch(deleteCart(el.id))
                            }} ><img src='/images/delete.png'/></span>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
                <div className="select-all">
                  <button className='all' onClick={() => allChecked ? dispatch(allCheckedFalse()) : dispatch(allCheckedTrue())}>전체 선택</button>
                  <button className='delete' onClick={deleteSelected}>선택 삭제</button>
                </div>
              </ul>
            </div>
            <div className="payment">
              <div className="payment-sub">
                <div className="sum-price">
                  <div className="sum-price-con">
                  총 상품금액: 
                  </div>
                  <div className="sum-price-num">
                  {checkedList.length > 0 ? totalSelectedPrice : totalPrice } 원
                  </div>  
                </div>
                <div className="payment-amount">
                  <span>상품수량: </span>
                  <span>
                    {checkedList.length > 0 ? totalSelectedAmount : totalAmount} 개
                  </span>
                </div>
              </div>
              <div className="order-result">
                <button onClick={payBtn}>주문하기</button>
              </div>
            </div>
          </>
          }
          {cartItems.length === 0 &&
            <div className='cart-empty'>
              <h4>장바구니가 비어 있습니다.</h4>
              <button onClick={() => {
                navigate('/shop')
              }}>쇼핑 계속 하기</button>
            </div>
          }
        </div>
      </div>
      {/* {loginModal && <LoginModalYyj onClose={() => setLoginModal(false)}/>} */}
    </div>
  )
}

export default CartList