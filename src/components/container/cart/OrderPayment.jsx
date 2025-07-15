import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { removePaidItems } from '../../../slices/cartSlice';
import KakaoMapModal from './KakaoMap/KakaoMapModal';
import { addPayment } from '../../../slices/paymentSlice';
import KakaoMap from '../../../API/kakaoApITest'
import KakaoMapCustom from './KakaoMap/KakaoMapCustom';
import { getMemberSelectorApi, getOrdersSeletorApi } from '../../../API/authAPI';

const today = new Date(); // 현재 날짜
const two = (num) => String(num).padStart(2, '0')
const formattedDate = `${today.getFullYear()}.${two(today.getMonth() + 1)}.${two(today.getDate())} ${two(today.getHours())}:${two(today.getMinutes())}:${two(today.getSeconds())}`

// const accountData = {
//   shop:payData.shop,
//   paymentMethod: payData.paymentMethod,
//   member: loginUser[0].id,
//   orderAddress: loginUser[0].address,
//   paymentResult: cartItems,
//   paymentAmount: totalPrice,
//   time: formattedDate
// }
const paymentPre = {
  id: "",
  shop: "",
  paymentMethod: "",
  member: '',
  orderAddress: '',
  paymentResult: [],
  paymentAmount: ''
}



const OrderPayment = () => {

  useEffect(() => {
    window.scrollTo(0,0)
  },[])

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const paymentItems = useSelector(state => state.cart.paymentItems)
  const loginUser = useSelector(state => state.auth.isUser)
  console.log('OrderPayment에서 로그인 유저:', loginUser)
  const isLogin = useSelector(state => state.auth.isLogin)
  const isState = useSelector(state => state.auth.isState)
  const payment = useSelector(state => state.payment)

  const [payData, setPayData] = useState(paymentPre)

  let totalPrice = 0
  paymentItems.forEach((item) => {
    totalPrice += item.price * item.count
  })

  let totalAmount = 0;
  paymentItems.forEach((item) => {
    totalAmount += item.count
  })

  const paymentMethodChange = (e) => {
    setPayData({
      ...payData,
      paymentMethod: e.target.value
    })
  }


  // 주문자 정보 입력 칸
  const [sameAsUser, setSameAsUser] = useState(false)
  const [ordererInfo, setOrdererInfo] = useState({
    userName: '',
    userEmail: '',
    address: ''
  })

  useEffect(() => {
    if (sameAsUser && loginUser) {
      setOrdererInfo({
        userName: loginUser.userName || '',
        userEmail: loginUser.userEmail || '',
        address: loginUser.address || '',
      })
    } else if (!sameAsUser) {
      setOrdererInfo({
        userName: '',
        userEmail: '',
        address: '',
      })
    }
  }, [sameAsUser, loginUser])

  const userChange = (e) => {
    const { name, value } = e.target
    setOrdererInfo(el => ({ ...el, [name]: value }))
  }

  console.log('loginUser:', loginUser)

  // const isSameAsUser = (e) => {
  //   const checked = e.target.checked
  //   setSameAsUser(checked)
  //   if (checked && loginUser) {
  //     setOredererInfo({
  //       name:loginUser.userName,
  //       email:loginUser.userEmail,
  //       address:loginUser.address
  //     })
  //   } else {
  //     setOredererInfo({
  //       name:'',
  //       email:'',
  //       address:''
  //     })
  //   }
  // }


  // 주문처 선택
  const [shopList, setShopList] = useState([])
  const [selectStore, setSelectStore] = useState()
  const [mapVisibleId, setMapVisibleId] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedShop, setSelectedShop] = useState(null)

  useEffect(() => {
    const fetchShopList = async () => {
      try {
        const res = await axios.get('http://localhost:3001/shopList')
        setShopList(res.data)
      } catch (error) {
        console.error('매장 리스트 로딩 실패: ', error)
      }
    }
    fetchShopList()
  }, [])

  const selectedStore = (id) => {
    setSelectStore(id)
  }

  const showMap = (store) => {
    setSelectedShop(store)
    setIsOpen(true)
  }

  // 결제하기 버튼 함수
  const paymentBtn = async (e) => {
    e.preventDefault();

    if (!loginUser || !isLogin) {
      alert('로그인이 필요합니다.')
      return
    }

    if (!payData.paymentMethod) {
      alert('결제 수단을 선택해주세요.')
      return
    }

    if (!payData.shop) {
      alert('주문처를 선택해주세요.')
      return
    }

    if (!sameAsUser) {
      const { userName, userEmail, address } = ordererInfo

      if (
        userName.trim() === "" ||
        userEmail.trim() === "" ||
        address.trim() === ''
      ) {
        alert('주문자 정보를 모두 입력해 주세요.')
        return
      }
    }
    const selectedStoreData = shopList.find(store => store.id === selectStore)

    const newOrder = {
      userId: loginUser.id,
      userName: loginUser.userName,
      userEmail: loginUser.userEmail,
      paymentMethod: payData.paymentMethod,
      paymentResult: paymentItems,
      paymentAmount: totalPrice,
      shop: payData.shop,
      date: formattedDate,
      orderer: ordererInfo
    }

    try {


      const dataURL = `http://localhost:3001/orders`
      const resAPI = await getOrdersSeletorApi()


      // 숫자인 ID만 모아서 max 계산
      const numericIds = resAPI
        .map(item => parseInt(item.id, 10))
        .filter(id => !isNaN(id));
      const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
      const newId = (maxId + 1).toString();

      const newOrder = {
        id: newId,
        userId: loginUser.id,
        userName: loginUser.userName,
        userEmail: loginUser.userEmail,
        paymentMethod: payData.paymentMethod,
        paymentResult: paymentItems,
        paymentAmount: totalPrice,
        shop: payData.shop,
        date: formattedDate,
        orderer: ordererInfo
      };

      await axios.post('http://localhost:3001/orders', newOrder)


      dispatch(removePaidItems(), newId);

      alert('결제가 완료되었습니다.')
      dispatch(addPayment(newOrder))
      navigate('/paymentresult')

    } catch (error) {
      console.error('주문실패:', error)
      alert('결제 처리 중 오류가 발생했습니다.')
    }

  }
  const monthRevenue = useSelector(state => state.payment.monthlyRevenue)
  console.log(monthRevenue)

  return (
    
    <div className="paymentList">
      <div className="paymentList-left">
        <h3 className="title">주문 상품</h3>

        <div className="paymentItem-con">
          <div className="paymentItemList">
            <ul>
              {paymentItems.map((el, idx) => {
                console.log(el.img);
                return (
                  <li key={idx}>
                    <div className="paymentItem" >
                      <div className="top">
                        <img src={`/images/${el.img}`} alt={el.img} />
                        <div className="top-con">
                          <span> {el.title}</span>
                          <span className="top-price">{el.price}원</span>
                        </div>
                      </div>
                      <div className="bottom">
                        <div className="paymentCount">
                          <span>{el.count * el.price}원</span>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="payment">
            <div className="payment-sub">
              <div className="pricej">
                <span className="sum-price">총 상품금액:</span>
                <span className='sum-price'> {totalPrice} 원</span>
              </div>
              <span className='sum-count'>상품수량: {totalAmount} 개</span>
            </div>
          </div>
        </div>
        <div className="paymentInfo">
          <div className="paymentMethod">
            <h3>결제 방법</h3>
            <div className="paymentMethod-con">
              <label>
                <input
                  type="radio"
                  name='paymentMehod'
                  value='계좌이체'
                  checked={payData.paymentMethod === '계좌이체'}
                  onChange={paymentMethodChange}
                />
                계좌이체
              </label>
              <label>
                <input
                  type="radio"
                  name='paymentMehod'
                  value='신용/체크카드'
                  checked={payData.paymentMethod === '신용/체크카드'}
                  onChange={paymentMethodChange}
                />
                신용/체크카드
              </label>
              <label>
                <input
                  type="radio"
                  name='paymentMehod'
                  value='카카오페이'
                  checked={payData.paymentMethod === '카카오페이'}
                  onChange={paymentMethodChange}
                />
                카카오페이
              </label>
              <label>
                <input
                  type="radio"
                  name='paymentMehod'
                  value='휴대폰'
                  checked={payData.paymentMethod === '휴대폰'}
                  onChange={paymentMethodChange}
                />
                휴대폰
              </label>
              <label>
                <input
                  type="radio"
                  name='paymentMehod'
                  value='무통장입금'
                  checked={payData.paymentMethod === '무통장입금'}
                  onChange={paymentMethodChange}
                />
                무통장입금
              </label>
            </div>
          </div>
          <div className="paymentMember">
            <h3>주문자 정보</h3>
            {isLogin && (
              <label>
                <input
                  type="checkbox"
                  checked={sameAsUser}
                  onChange={(e) => setSameAsUser(e.target.checked)}
                />
                회원 정보와 동일
              </label>
            )}
            <div className="paymentMember-con">
              <div>
                <label>이름</label>
                <input
                  type="text"
                  name="userName"
                  value={ordererInfo.userName}
                  onChange={userChange}
                  disabled={sameAsUser} />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="text"
                  name="userEmail"
                  value={ordererInfo.userEmail}
                  onChange={userChange}
                  disabled={sameAsUser} />
              </div>
              <div>
                <label>주소</label>
                <input
                  type="text"
                  name="address"
                  value={ordererInfo.address}
                  onChange={userChange}
                  disabled={sameAsUser} />
              </div>
            </div>
          </div>
          <div className="orderShopInfo">
            <div className="orderShopInfo-con">
              <h3>주문처</h3>
              <ul>
                {shopList.map(store => (
                  <li key={store.id}>
                    <label>
                      <input
                        type="radio"
                        name='store'
                        checked={selectStore === store.id}
                        onChange={() => {
                          setSelectStore(store.id)
                          setPayData(prev => ({
                            ...prev,
                            shop: store.name
                          }))
                        }}
                      />
                      {store.name}
                    </label>
                    <button onClick={() => showMap(store)}>
                      지도 보기
                    </button>
                    
                  </li>
                ))}
              </ul>
              {selectedShop && (
                <>
                  <KakaoMapModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    lat={selectedShop.x}
                    lng={selectedShop.y}
                    address={selectedShop.address}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div> 
      <div className="paymentList-right">
        <div className="paymentList-right-con">
          <h3>상세 주문 정보</h3>
          <div className="paymentResult"
          >
            <div className="ordererInfo">
              <h4>주문자 정보</h4>
              <span><strong>이름: </strong>{ordererInfo.userName}</span>
              <span><strong>이메일: </strong>{ordererInfo.userEmail}</span>
              <span><strong>주소: </strong>{ordererInfo.address}</span>
            </div>
            <div className="paymentInfo">
              <h4>결제 정보</h4>
              <span><strong>결제 방법: </strong>{payData.paymentMethod}</span>
              <span><strong>주문처: </strong>{payData.shop}</span>
            </div>
            <span className="sum-price"><strong>총 결제 금액: </strong>{totalPrice} 원</span>
            <div className="order-result">
              <button onClick={paymentBtn}>결제하기</button>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}


export default OrderPayment