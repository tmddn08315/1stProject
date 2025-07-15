import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addCart, setPaymentItems } from '../../../slices/cartSlice';

function FashionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [item, setItem] = useState(null);
  const [mainImg, setMainImg] = useState('');

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

  return (
    <div className="fashion-detail-page">
      <div className="fashion-detail-header">
        <h1 className="fashion-title">{item.title}</h1>
      </div>

      <div className="fashion-detail-body">
        <div className="fashion-image-gallery">
          <img className="fashion-image" src={`/images/${mainImg}`} alt={item.title} />
        </div>

        <div className="fashion-info">
          <p className="fashion-price">
            가격: <strong>{item.price.toLocaleString()}원</strong>
          </p>
          <p className="fashion-size">사이즈: {item.size || '정보 없음'}</p>
          <p className="fashion-description">
            {item.description ||
              '우리 아이들이 안전하게 생활할 수 있도록 최대한 불필요한 요소들은 제거하고 제작했습니다. 많은 관심 부탁드립니다~'}
          </p>
        </div>
      </div>

      <div className="detail-actions">
        <button
          onClick={() => {
            dispatch(addCart({ ...item, count: 1 }));
            alert('장바구니에 추가되었습니다.');
          }}
          className="btn-cart"
        >
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

      <FashionDetailTabs item={item} />
    </div>
  );
}

// ✅ React 컴포넌트로 변경: 함수 이름 대문자 시작
function FashionDetailTabs({ item }) {
  const [activeTab, setActiveTab] = useState('detail');
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ author: '', content: '', rating: 0, type: 'review' });
  const [Search, setSearch] = useState('');

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const currentUser = useSelector((state) => state.auth.isUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setNewReview((prev) => ({
        ...prev,
        author: currentUser.userName || currentUser.userEmail || '',
      }));
    } else {
      setNewReview((prev) => ({
        ...prev,
        author: '',
      }));
    }
  }, [currentUser]);

  useEffect(() => {
    if (!item) return;

    fetch(`http://localhost:3001/reviews?productId=${item.id}`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error('후기 로딩 실패:', err));
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
        time: new Date().toISOString(),
      }),
    })
      .then((res) => res.json())
      .then((savedReview) => {
        setReviews((prev) => [...prev, savedReview]);
        setNewReview((prev) => ({
          author: currentUser ? currentUser.userName || currentUser.userEmail : '',
          content: '',
          rating: 0,
          type: prev.type,
        }));
      })
      .catch(() => alert('후기 등록 실패'));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setNewReview((prev) => ({
      ...prev,
      type: tab,
      rating: 0,
      content: '',
      author: currentUser ? currentUser.userName || currentUser.userEmail : '',
    }));
  };

  return (
    <div className="detail-tabs-container">
      <ul className="tabs">
        <li className={`tab-item ${activeTab === 'detail' ? 'active' : ''}`} onClick={() => setActiveTab('detail')}>
          상품 상세 정보
        </li>
        <li className={`tab-item ${activeTab === 'review' ? 'active' : ''}`} onClick={() => handleTabChange('review')}>
          상품 후기
        </li>
        <li className={`tab-item ${activeTab === 'qna' ? 'active' : ''}`} onClick={() => handleTabChange('qna')}>
          상품 문의
        </li>
        <li className={`tab-item ${activeTab === 'exchange' ? 'active' : ''}`} onClick={() => setActiveTab('exchange')}>
          교환/반품/배송
        </li>
      </ul>

      <div className="tab-content">
        {/* 상품 상세 정보 */}
        {activeTab === 'detail' && (
          <>
            <p>{item.detailText}</p>
            <div className="detail-images">
              {[1, 2, 3, 4, 5].map((num) => (
                <img key={num} src={`/images/PetDetail${num}.png`} alt={`detail${num}`} />
              ))}
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
                  <h4>상품문의 작성</h4>
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

export default FashionDetail;