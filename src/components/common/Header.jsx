import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logOutUserFn, loginUserFn } from "../../slices/authSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // 현재 URL 경로 가져오기

  const isLogin = useSelector((state) => state.auth.isLogin);
  const user = useSelector((state) => state.auth.isUser);
  const admin = useSelector((state) => state.auth.admin);

  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn") === "1";
    const savedUser = localStorage.getItem("isUser");
    if (storedLogin && !isLogin) {
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;
      dispatch(loginUserFn(parsedUser));
    }
  }, [dispatch, isLogin]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logOutUserFn());
    localStorage.removeItem("isLoggedIn");
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  const items = useSelector((state) => state.cart.items);

  let cartAmount = 0;
  items.forEach((item) => {
    cartAmount += item.count;
  });

  return (
    <div className="header">
      <div className="nav-top">
        <div className="nav-top-con">
          <h1 className="logo">
            <Link to={"/"}>HOME</Link>
          </h1>
          <div className="top-gnb">
            <ul>
            {isLogin ? (
            <>
            <li>
            <Link to="#" onClick={handleLogout}>
              LOGOUT
            </Link>
         </li>
         <li>
                <Link to={"/paymentresult"}>주문내역</Link>
              </li>
          {user?.role?.toLowerCase() === "admin" && (
             <li>
            <Link to={"/admin"}>관리자페이지</Link>
            </li>
         )}
  </>
              ) : (
                <li>
                  <Link to={"/auth"}>LOGIN / 회원가입</Link>
                </li>
              )}
              <li className="headerCart">
                {items.length > 0 && <span className="cart">{items.length}</span>}
                <Link to={"/cart"}>
                  <img src="/images/shoppingCart.png" alt="cart" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="nav-middle">
        <div className="nav-middle-con">
          <h1 className="logo2">
            <Link to={"/shop"}>
              <img src="/images/logo.png" alt="LOGO" width="200" height="200" />
            </Link>
          </h1>
        </div>
      </div>

      <div className="nav-bottom">
        <div className="nav-bottom-con">
          <div className="main-gnb">
            <ul>
              <li>
                <Link
                  to="/shop/food"
                  className={location.pathname.startsWith("/shop/food") ? "active" : ""}
                >
                  사료
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/snack"
                  className={location.pathname.startsWith("/shop/snack") ? "active" : ""}
                >
                  간식
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/toy"
                  className={location.pathname.startsWith("/shop/toy") ? "active" : ""}
                >
                  장난감
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/bath"
                  className={location.pathname.startsWith("/shop/bath") ? "active" : ""}
                >
                  목욕
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/house"
                  className={location.pathname.startsWith("/shop/house") ? "active" : ""}
                >
                  하우스
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/fashion"
                  className={location.pathname.startsWith("/shop/fashion") ? "active" : ""}
                >
                  패션
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;