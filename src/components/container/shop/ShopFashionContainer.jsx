import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 공통 페이징 컴포넌트
const Pagination = ({ currentPage, totalItems, onPageChange }) => {
  const itemsPerPage = 4;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <button onClick={() => onPageChange(Math.max(currentPage - 1, 1))}>이전</button>
      {pageNumbers.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={page === currentPage ? 'active' : ''}
        >
          {page}
        </button>
      ))}
      <button onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}>다음</button>
    </div>
  );
};

function FashionList() {
  const [fashions, setfashions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const [Search, setSearch] = useState('');

  const [clothPage, setclothPage] = useState(1);
  const [hatPage, sethatPage] = useState(1);
  const [sunglassPage, setsunglassPage] = useState(1);
  const [tiePage, settiePage] = useState(1);

  const itemsPerPage = 4;

  useEffect(() => {
    fetch('http://localhost:3001/products')
      .then(res => res.json())
      .then(data => setfashions(data))
      .catch(error => console.error('데이터 불러오기 실패:', error));
  }, []);

  const filterBySearch = (list) =>
    list.filter(item =>
      item.title.toLowerCase().includes(Search.toLowerCase())
    )

  const cloths = filterBySearch(fashions.filter(item => item.sub === '의상'));
  const hats = filterBySearch(fashions.filter(item => item.sub === '모자'));
  const sunglasses = filterBySearch(fashions.filter(item => item.sub === '안경'));
  const ties = filterBySearch(fashions.filter(item => item.sub === '타이'));


  const getPaginatedItems = (items, currentPage) => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  };

  const paginatedcloths = getPaginatedItems(cloths, clothPage);
  const paginatedhats = getPaginatedItems(hats, hatPage);
  const paginatedsunglasses = getPaginatedItems(sunglasses, sunglassPage);
  const paginatedties = getPaginatedItems(ties, tiePage);

  const openModal = item => setSelectedItem(item);
  const closeModal = () => setSelectedItem(null);


  return (
    <div className="ShopFashionContainer">
      <div className="ShopFashionSearch">
        <input
          type="text"
          placeholder="상품명 검색"
          value={Search}
          onChange={(e) => {
            setSearch(e.target.value);
            setclothPage(1);
            sethatPage(1);
            setsunglassPage(1);
            settiePage(1);
          }} />
        <button type="submit" className="submit-button">검색
        </button>
      </div>
      <h2>펫 의상</h2>
      <div className="ShopFashionContainer-top">
        {paginatedcloths.map(item => (
          <div key={item.id} className="fashion-item" onClick={() => openModal(item)} style={{ cursor: 'pointer' }}>
            <img src={`/images/${item.img}`} alt={item.title} />
            <h3>{item.title}</h3>
            <p>가격: {item.price.toLocaleString()}원</p>
          </div>
        ))}
      </div>
      <Pagination currentPage={clothPage} totalItems={cloths.length} onPageChange={setclothPage} />

      <h2>펫 모자</h2>
      <div className="ShopFashionContainer-middle">
        {paginatedhats.map(item => (
          <div key={item.id} className="fashion-item" onClick={() => openModal(item)} style={{ cursor: 'pointer' }}>
            <img src={`/images/${item.img}`} alt={item.title} />
            <h3>{item.title}</h3>
            <p>가격: {item.price.toLocaleString()}원</p>
          </div>
        ))}
      </div>
      <Pagination currentPage={hatPage} totalItems={hats.length} onPageChange={sethatPage} />

      <h2>펫 선글라스</h2>
      <div className="ShopFashionContainer-bottom">
        {paginatedsunglasses.map(item => (
          <div key={item.id} className="fashion-item" onClick={() => openModal(item)} style={{ cursor: 'pointer' }}>
            <img src={`/images/${item.img}`} alt={item.title} />
            <h3>{item.title}</h3>
            <p>가격: {item.price.toLocaleString()}원</p>
          </div>
        ))}
      </div>
      <Pagination currentPage={sunglassPage} totalItems={sunglasses.length} onPageChange={setsunglassPage} />

      <h2>펫 타이</h2>
      <div className="ShopFashionContainer-bottom">
        {paginatedties.map(item => (
          <div key={item.id} className="fashion-item" onClick={() => openModal(item)} style={{ cursor: 'pointer' }}>
            <img src={`/images/${item.img}`} alt={item.title} />
            <h3>{item.title}</h3>
            <p>가격: {item.price.toLocaleString()}원</p>
          </div>
        ))}
      </div>
      <Pagination currentPage={tiePage} totalItems={ties.length} onPageChange={settiePage} />

      {/* 모달 */}
      {selectedItem && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <img
              src={`http://localhost:3001/images/${selectedItem.img}`}
              title={`상세보기`}
              alt={selectedItem.title}
              style={{ cursor: 'pointer' }}

              onClick={() => navigate(`/shop/house/${selectedItem.id}`)}

            />
            <h2>{selectedItem.title}</h2>
            <p>{selectedItem.size?.toLocaleString()}</p>
            <p>가격: {selectedItem.price.toLocaleString()}원</p>

            <div className="modal-bottom-right">
              <div
                className="see"
                onClick={() => navigate(`/shop/food/${selectedItem.id}`)}
                style={{ cursor: 'pointer' }}>
                <img src="/images/see.png" alt="상세보기로 이동" />

              </div>
            </div>
            <button onClick={closeModal} className="modal-close">
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FashionList;