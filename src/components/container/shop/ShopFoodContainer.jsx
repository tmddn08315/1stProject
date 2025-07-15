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

function FoodList() {
  const [Foods, setFoods] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const [Search, setSearch] = useState('');

  const [dogFoodPage, setdogFoodPage] = useState(1);
  const [catFoodPage, setcatFoodPage] = useState(1);
  const [petFoodPage, setpetFoodPage] = useState(1);

  const itemsPerPage = 4;

  useEffect(() => {
    fetch('http://localhost:3001/products')
      .then(res => res.json())
      .then(data => setFoods(data))
      .catch(error => console.error('데이터 불러오기 실패:', error));
  }, []);

  const filterBySearch = (list) =>
    list.filter(item =>
      item.title.toLowerCase().includes(Search.toLowerCase())
    )

  const dogFoods = filterBySearch(Foods.filter(item => item.sub === 'dog'));
  const catFoods = filterBySearch(Foods.filter(item => item.sub === 'cat'));
  const petFoods = filterBySearch(Foods.filter(item => item.sub === 'dog&cat'));


  const getPaginatedItems = (items, currentPage) => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  };

  const paginatedDogFoods = getPaginatedItems(dogFoods, dogFoodPage);
  const paginatedCatFoods = getPaginatedItems(catFoods, catFoodPage);
  const paginatedPetFoods = getPaginatedItems(petFoods, petFoodPage);

  const openModal = item => setSelectedItem(item);
  const closeModal = () => setSelectedItem(null);


  return (
    <div className="ShopFoodContainer">
      <div className="ShopFoodSearch">
        <input
          type="text"
          placeholder="상품명 검색"
          value={Search}
          onChange={(e) => {
            setSearch(e.target.value);
            setdogFoodPage(1);
            setcatFoodPage(1);
            setpetFoodPage(1);
          }} />
        <button type="submit" className="submit-button">검색
        </button>
      </div>
      <h2>강아지 사료</h2>
      <div className="ShopFoodContainer-top">
        {paginatedDogFoods.map(item => (
          <div key={item.id} className="Food-item" onClick={() => openModal(item)} style={{ cursor: 'pointer' }}>
            <img src={`/images/${item.img}`} alt={item.title} />

            <h3>{item.title}</h3>
            <p>가격: {item.price.toLocaleString()}원</p>
          </div>
        ))}
      </div>
      <Pagination currentPage={dogFoodPage} totalItems={dogFoods.length} onPageChange={setdogFoodPage} />

      <h2>고양이 사료</h2>
      <div className="ShopFoodContainer-middle">

        {paginatedCatFoods.map(item => (
          <div key={item.id} className="Food-item" onClick={() => openModal(item)} style={{ cursor: 'pointer' }}>
            <img src={`/images/${item.img}`} alt={item.title} />

            <h3>{item.title}</h3>
            <p>가격: {item.price.toLocaleString()}원</p>
          </div>
        ))}
      </div>
      <Pagination currentPage={catFoodPage} totalItems={catFoods.length} onPageChange={setcatFoodPage} />

      <h2>애기용 밀크</h2>
      <div className="ShopFoodContainer-bottom">
        {paginatedPetFoods.map(item => (
          <div key={item.id} className="Food-item" onClick={() => openModal(item)} style={{ cursor: 'pointer' }}>
            <img src={`/images/${item.img}`} alt={item.title} />

            <h3>{item.title}</h3>
            <p>가격: {item.price.toLocaleString()}원</p>
          </div>
        ))}
      </div>
      <Pagination currentPage={petFoodPage} totalItems={petFoods.length} onPageChange={setpetFoodPage} />

      {/* 모달 */}
      {selectedItem && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <img
              src={`http://localhost:3001/images/${selectedItem.img}`}
              title={`상세보기`}
              alt={selectedItem.title}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/shop/food/${selectedItem.id}`)}/>

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

export default FoodList;