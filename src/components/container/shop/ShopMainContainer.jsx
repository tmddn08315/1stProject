import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const ShopMainContainer = () => {
  const isLogin = useSelector(state => state.auth.isLogin)
  const loginUser = useSelector(state => state.auth.isUser)

  useEffect(() => {
    console.log('로그인 상태:', isLogin)
    console.log('로그인 유저 정보:', loginUser)
  }, [isLogin, loginUser])
  return (
    <main className="shopContent">
      <div>
        <img src="/images/bg2.png" alt="bg1" />
      </div>
      <div>
        <img src="/images/bg.png" alt="bg1" />
      </div>
      <section className="shopSection">
        <h2>🔥 인기 상품</h2>
        <div className="productGrid">
          <div className="productCard">
            <img src="/images/petsnack.png" alt="강아지 간식" />
            <h3>강아지 간식 세트</h3>
            <p className="price">₩15,000</p>
          </div>
          <div className="productCard">
            <img src="/images/catoy.png" alt="고양이 장난감" />
            <h3>고양이 장난감 패키지</h3>
            <p className="price">₩12,000</p>
          </div>
          <div className="productCard">
            <img src="/images/petshamp.png" alt="펫 샴푸" />
            <h3>펫 전용 샴푸</h3>
            <p className="price">₩9,900</p>
          </div>
        </div>
      </section>

      <section className="announcement">
        <h2>📢 공지사항</h2>
        <ul>
          <li>7월 한정 전 제품 10% 할인!</li>
          <li>신규 가입 시 무료 배송 쿠폰 지급</li>
        </ul>
      </section>
    </main>
  );
};

export default ShopMainContainer;
