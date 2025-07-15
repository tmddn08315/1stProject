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

function SnackList() {
  const [snacks, setsnacks] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const [Search, setSearch] = useState('');

  const [dogsnackPage, setdogsnackPage] = useState(1);
  const [catsnackPage, setcatsnackPage] = useState(1);

  const itemsPerPage = 4;

  useEffect(() => {
    fetch('http://localhost:3001/products')
      .then(res => res.json())
      .then(data => setsnacks(data))
      .catch(error => console.error('데이터 불러오기 실패:', error));
  }, []);

  const filterBySearch = (list) =>
    list.filter(item =>
      item.title.toLowerCase().includes(Search.toLowerCase())
    )

  const dogSnacks = filterBySearch(snacks.filter(item => item.sub === 'DogDesert'));
  const catSnacks = filterBySearch(snacks.filter(item => item.sub === 'CatDesert'));

  const getPaginatedItems = (items, currentPage) => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  };

  const paginatedDogSnacks = getPaginatedItems(dogSnacks, dogsnackPage);
  const paginatedCatSnacks = getPaginatedItems(catSnacks, catsnackPage);

  const openModal = item => setSelectedItem(item);
  const closeModal = () => setSelectedItem(null);


  return (
    <div className="ShopSnackContainer">
      <div className="ShopSnackSearch">
        <input
          type="text"
          placeholder="상품명 검색"
          value={Search}
          onChange={(e) => {
            setSearch(e.target.value);
            setdogsnackPage(1);
            setcatsnackPage(1);
          }} />
        <button type="submit" className="submit-button">검색
        </button>
      </div>
      <h2>강아지 간식</h2>
      <div className="ShopSnackContainer-top">
        {paginatedDogSnacks.map(item => (
          <div key={item.id} className="Snack-item" onClick={() => openModal(item)} style={{ cursor: 'pointer' }}>
            <img src={`/images/${item.img}`} alt={item.title} />

            <h3>{item.title}</h3>
            <p>가격: {item.price.toLocaleString()}원</p>
          </div>
        ))}
      </div>
      <Pagination currentPage={dogsnackPage} totalItems={dogSnacks.length} onPageChange={setdogsnackPage} />

      <h2>고양이 간식</h2>
      <div className="ShopSnackContainer-middle">

        {paginatedCatSnacks.map(item => (
          <div key={item.id} className="Snack-item" onClick={() => openModal(item)} style={{ cursor: 'pointer' }}>
            <img src={`/images/${item.img}`} alt={item.title} />

            <h3>{item.title}</h3>
            <p>가격: {item.price.toLocaleString()}원</p>
          </div>
        ))}
      </div>
      <Pagination currentPage={catsnackPage} totalItems={catSnacks.length} onPageChange={setcatsnackPage} />

      {/* 모달 */}
      {selectedItem && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <img
              src={`http://localhost:3001/images/${selectedItem.img}`}
              title={`상세보기`}
              alt={selectedItem.title}
              style={{ cursor: 'pointer' }}

              onClick={() => navigate(`/shop/snack/${selectedItem.id}`)}

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

export default SnackList;