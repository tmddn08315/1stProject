import React from 'react'

const AddToCartModal = ({onCart, onClose}) => {
  return (
    <div className="addCartModal">
      <div className="addCartModal-con">
        <h4>장바구니에 상품이 담겼습니다.</h4>
        <div className="modalBtn">
          <p>장바구니로 이동하시겠습니까?</p>
          <div className="modalBtn-con">
            <button onClick={onCart}>장바구니 가기</button>
            <button onClick={onClose}>계속 쇼핑하기</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddToCartModal