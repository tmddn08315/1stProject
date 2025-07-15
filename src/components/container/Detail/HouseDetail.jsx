import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addCart, setPaymentItems } from '../../../slices/cartSlice';

function HouseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [item, setItem] = useState(null);
  const [mainImg, setMainImg] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3001/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('데이터를 불러오는 데 실패했습니다.');
        return res.json();
      })
      .then((data) => {
        setItem(data);
        setMainImg(`${data.img}`);
      })
      .catch((err) => {
        console.error(err);
        alert('존재하지 않는 상품입니다.');
        navigate('/');
      });
  }, [id, navigate]);

  if (!item) return <div className="loading">로딩 중...</div>;

  // 장바구니 담기 클릭 시 모달 표시
  const handleAddCart = () => {
    dispatch(addCart({ ...item, count: 1 }));
    setModalVisible(true);
  };

  // 모달에서 장바구니 가기
  const goToCart = () => {
    setModalVisible(false);
    navigate('/cart');
  };

  // 모달 닫기
  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="house-detail-page">
      <div className="house-detail-header">
        <h1 className="house-title">{item.title}</h1>
      </div>

      <div className="house-detail-body">
        <div className="house-image-gallery">
          <img className="main-image" src={`/images/${mainImg}`} alt={item.title} />
        </div>

        <div className="house-info">
          <p className="house-price">
            가격: <strong>{item.price.toLocaleString()}원</strong>
          </p>
          <p className="house-size">사이즈: {item.size || '정보 없음'}</p>

          <p className="house-description">
            {item.description ||
              '1. 우리 아이를 위한 가장 포근한 공간, 펫 하우스에서 시작하세요.'} <br />
            {item.description ||
              '2. 내 반려동물의 작은 세상, 사랑을 담은 펫 하우스'} <br />
            {item.description ||
              '3. 집처럼 편안하고 품처럼 따뜻한, 단 하나의 하우스'}
          </p>
        </div>
      </div>

      {/* 장바구니 / 결제 버튼 */}
      <div className="detail-actions">
        <button onClick={handleAddCart} className="btn-cart">
          장바구니 담기
        </button>

        <button
          onClick={() => {
            dispatch(setPaymentItems([{ ...item, count: 1 }]));
            navigate('/payment');
          }}
          className="btn-pay"
        >
          바로 결제하기
        </button>
      </div>

      {/* AddToCartModal 모달 */}
      {modalVisible && <AddToCartModal onCart={goToCart} onClose={closeModal} />}

      {/* 하단 탭 컴포넌트 */}
      <HouseDetailTabs item={item} />
    </div>
  );
}

// AddToCartModal 컴포넌트
const AddToCartModal = ({ onCart, onClose }) => {
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
  );
};

// Detail Page Tabs
function HouseDetailTabs({ item }) {
  const [activeTab, setActiveTab] = useState('detail');
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ author: '', content: '', rating: 0, type: 'review' });
  const [Search, setSearch] = useState('');

  // 리덕스에서 로그인 상태, 사용자 정보 가져오기
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const currentUser = useSelector(state => state.auth.isUser);

  const navigate = useNavigate();

  // 로그인 사용자 정보가 바뀌면 newReview.author 업데이트
  useEffect(() => {
    if (currentUser) {
      setNewReview(prev => ({
        ...prev,
        author: currentUser.userName || currentUser.userEmail || '',
      }));
    } else {
      setNewReview(prev => ({
        ...prev,
        author: '',
      }));
    }
  }, [currentUser]);

  useEffect(() => {
    if (!item) return;

    fetch(`http://localhost:3001/reviews?productId=${item.id}`)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error('후기 로딩 실패:', err));
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      navigate('/auth/login');
      return;
    }

    if (newReview.rating === 0 && newReview.type === 'review') {
      alert('평점을 선택해주세요.');
      return;
    }

    fetch(`http://localhost:3001/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newReview,
        productId: item.id,
        time: new Date().toISOString()
      }),
    })
      .then(res => res.json())
      .then((savedReview) => {
        setReviews(prev => [...prev, savedReview]);
        // 작성 후 초기화 (type 유지)
        setNewReview(prev => ({ author: currentUser ? (currentUser.userName || currentUser.userEmail) : '', content: '', rating: 0, type: prev.type }));
      })
      .catch(err => alert('후기 등록 실패'));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'review') {
      setNewReview(prev => ({ ...prev, type: 'review', rating: 0, content: '', author: currentUser ? (currentUser.userName || currentUser.userEmail) : '' }));
    } else if (tab === 'qna') {
      setNewReview(prev => ({ ...prev, type: 'qna', rating: 0, content: '', author: currentUser ? (currentUser.userName || currentUser.userEmail) : '' }));
    }
  };

  return (
    <div className="detail-tabs-container">
      <ul className="tabs">
        <li
          className={`tab-item ${activeTab === 'detail' ? 'active' : ''}`}
          onClick={() => setActiveTab('detail')}
        >
          상품 상세 정보
        </li>
        <li
          className={`tab-item ${activeTab === 'review' ? 'active' : ''}`}
          onClick={() => handleTabChange('review')}
        >
          상품 후기
        </li>
        <li
          className={`tab-item ${activeTab === 'qna' ? 'active' : ''}`}
          onClick={() => handleTabChange('qna')}
        >
          상품 문의
        </li>
        <li
          className={`tab-item ${activeTab === 'exchange' ? 'active' : ''}`}
          onClick={() => setActiveTab('exchange')}
        >
          교환/반품/배송
        </li>
      </ul>

      <div className="tab-content">
        {/* 상품 상세 정보 탭 */}
        {activeTab === 'detail' && (
          <>
            <p>{item.detailText}</p>
            <div className="detail-images">
              <img src="/images/PetDetail1.png" alt="detail1" />
              <img src="/images/PetDetail2.png" alt="detail2" />
              <img src="/images/PetDetail3.png" alt="detail3" />
              <img src="/images/PetDetail4.png" alt="detail4" />
              <img src="/images/PetDetail5.png" alt="detail5" />
            </div>
          </>
        )}

        {/* 후기 탭 */}
        {activeTab === 'review' && (
          <>
            <div className="review-con">
            <h4>후기 작성</h4>
              <div className="review-star">
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                  required>
                  <option value={0}>-평점선택-</option>
                  <option value={1}>★</option>
                  <option value={2}>★★</option>
                  <option value={3}>★★★</option>
                  <option value={4}>★★★★</option>
                  <option value={5}>★★★★★</option>
                </select>


                <div className="review-search">
                  <input
                    type="text"
                    placeholder="후기 검색 (작성자/내용)"
                    value={Search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button
                    type="button"
                    className="search-submit-button"
                    onClick={() => alert(`검색어: ${Search}`)}
                  >
                    검색
                  </button>
                </div>
              </div>

              {isLoggedIn ? (
                <>
                  <form onSubmit={handleSubmit}>
                    <div className="review-con-top">
                      <input
                        type="text"
                        placeholder="작성자"
                        value={newReview.author}
                        onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                        required
                      />
                      <textarea
                        className="review-textarea"
                        placeholder="내용을 입력하세요"
                        value={newReview.content}
                        onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                        required
                      />
                      <button type="submit" className="submit-button">
                        등록
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <p style={{ color: 'red', marginTop: '10px' }}>
                  ※ 후기를 작성하려면 로그인이 필요합니다.
                </p>
              )}

              <div className="review-con-bottom">
                <div className="reviews">
                  <h4>후기 목록</h4>
                  {reviews.filter(r => r.type === 'review').length === 0 ? (
                    <p>등록된 후기가 없습니다.</p>
                  ) : (
                    <ul>
                      {reviews
                        .filter(r => r.type === 'review')
                        .filter(r =>
                          r.author.toLowerCase().includes(Search.toLowerCase()) ||
                          r.content.toLowerCase().includes(Search.toLowerCase())
                        )
                        .map((review) => {
                          const date = review.time ? new Date(review.time) : null;
                          return (
                            <li key={review.id} className="review-item">
                              <strong>{review.author}</strong>
                              <p>{review.rating ? '★'.repeat(review.rating) : '평점 없음'}</p>
                              <p>{review.content}</p>
                              <small>{date && !isNaN(date) ? date.toLocaleString() : '날짜 정보 없음'}</small>
                            </li>
                          );
                        })}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* 문의 탭 */}
        {activeTab === 'qna' && (
          <>
            <div className="review-con">
            <h4>상품문의 작성</h4>
              <div className="review-star">
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                  required>
                  <option value={0}>-전체-</option>
                  <option value={1}>불량상품 문의</option>
                  <option value={2}>사이즈 문의</option>
                  <option value={3}>색상 문의</option>
                  <option value={4}>재고 문의</option>
                  <option value={5}>기타 문의</option>
                </select>

                <div className="review-search">
                  <input
                    type="text"
                    placeholder="문의 검색 (작성자/내용)"
                    value={Search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button
                    type="button"
                    className="search-submit-button"
                    onClick={() => alert(`검색어: ${Search}`)}
                  >
                    검색
                  </button>
                </div>
              </div>

              {isLoggedIn ? (
                <>
                  <form onSubmit={handleSubmit}>
                    <div className="review-con-top">
                      <input
                        type="text"
                        placeholder="작성자"
                        value={newReview.author}
                        onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                        required
                      />
                      <textarea
                        className="review-textarea"
                        placeholder="내용을 입력하세요"
                        value={newReview.content}
                        onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                        required
                      />
                      <button type="submit" className="submit-button">
                        등록
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <p style={{ color: 'red', marginTop: '10px' }}>
                  ※ 문의를 작성하려면 로그인이 필요합니다.
                </p>
              )}

              <div className="review-con-bottom">
                <div className="reviews">
                  <h4>문의 목록</h4>
                  {reviews.filter(r => r.type === 'qna').length === 0 ? (
                    <p>등록된 문의가 없습니다.</p>
                  ) : (
                    <ul>
                      {reviews
                        .filter(r => r.type === 'qna')
                        .filter(r =>
                          r.author.toLowerCase().includes(Search.toLowerCase()) ||
                          r.content.toLowerCase().includes(Search.toLowerCase())
                        )
                        .map((qna) => {
                          const date = qna.time ? new Date(qna.time) : null;
                          return (
                            <li key={qna.id} className="review-item">
                              <strong>{qna.author}</strong>
                              <p>문의 유형: {(() => {
                                switch (qna.rating) {
                                  case 1: return '불량상품 문의';
                                  case 2: return '사이즈 문의';
                                  case 3: return '색상 문의';
                                  case 4: return '재고 문의';
                                  case 5: return '기타 문의';
                                  default: return '미분류';
                                }
                              })()}</p>
                              <p>{qna.content}</p>
                              <small>{date && !isNaN(date) ? date.toLocaleString() : '날짜 정보 없음'}</small>
                            </li>
                          );
                        })}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* 교환/반품/배송 탭 */}
        {activeTab === 'exchange' && (
          <div className="exchange-info">
            <img src="/images/PetDetail6.png" alt="Detail" />
            {/* 여기에 교환/반품/배송 정보 작성 */}
          </div>
        )}
      </div>
    </div>
  );
}

export default HouseDetail;