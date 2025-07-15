import React, { useState, useEffect } from 'react';
import KakaoMap from '../../../API/kakaoApITest'; // KakaoMap 컴포넌트 경로 확인 필요

function AdminOrderList() {
  const [orders, setOrders] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);


  // AdminOrdreList 가 아니라 ShopOrderList? 
  useEffect(() => {
    fetch('http://localhost:3001/shoplist2')
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error('데이터 불러오기 실패:', error));
  }, []);

  const openMap = (item) => {
    if (!item.lat || !item.lng) {
      alert('위치 정보가 없습니다.');
      return;
    }
    setSelectedItem(item);
  };

  return (
    <div className="OrderTableContainer" style={{ padding: '2rem' }}>
      <h2>📦 주문처 정보</h2>
      <table className="order-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>상호명</th>
            <th>주소</th>
            <th>지하철</th>
            <th>전화번호</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((item) => (
            <tr
              key={item.id}
              onClick={() => openMap(item)}
              style={{
                cursor: 'pointer',
                backgroundColor: selectedItem?.id === item.id ? '#f0f8ff' : 'white',
              }}
            >
              <td>{item.name}</td>
              <td>{item.address}</td>
              <td>{item.subway}</td>
              <td>{item.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedItem && (
        <div className="map-container">
          <h2>🗺️지도보기</h2>
          <KakaoMap lat={selectedItem.lat} lng={selectedItem.lng} />
        </div>
      )}
    </div>
  );
}

export default AdminOrderList;