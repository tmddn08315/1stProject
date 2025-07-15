import React, { useState } from 'react';

const sampleOrders = [
  {
    id: 'tmddn1',
    orderSource: '노원역점',
    orderMethod: '일반 주문',
    paymentMethod: '카드 결제',
    payerName: '천승우',
    payerAddress: '서울시 노원역',
    paymentDetails: '강아지용사료 및 간식',
    amount: 120000,
    paymentTime: '2025-06-26T14:00',
  },
  {
    id: 'tmddn2',
    orderSource: '노원역점',
    orderMethod: '일반 주문',
    paymentMethod: '카드 결제',
    payerName: '천승우',
    payerAddress: '서울시 노원역',
    paymentDetails: '강아지용사료 및 간식',
    amount: 230000,
    paymentTime: '2025-06-26T14:00',
  },
  {
    id: 'tmddn3',
    orderSource: '노원역점',
    orderMethod: '일반 주문',
    paymentMethod: '카드 결제',
    payerName: '천승우',
    payerAddress: '서울시 노원역',
    paymentDetails: '강아지용사료 및 간식',
    amount: 450000,
    paymentTime: '2025-06-26T14:00',
  },
  {
    id: 'tmddn4',
    orderSource: '노원역점',
    orderMethod: '일반 주문',
    paymentMethod: '카드 결제',
    payerName: '천승우',
    payerAddress: '서울시 노원역',
    paymentDetails: '강아지용사료 및 간식',
    amount: 670000,
    paymentTime: '2025-06-26T14:00',
  },
   {
    id: 'tmddn5',
    orderSource: '노원역점',
    orderMethod: '일반 주문',
    paymentMethod: '카드 결제',
    payerName: '천승우',
    payerAddress: '서울시 노원역',
    paymentDetails: '강아지용사료 및 간식',
    amount: 890000,
    paymentTime: '2025-06-26T14:00',
  },

];

const paymentMethods = ['카드 결제', '계좌 이체', '휴대폰 결제', '카카오페이'];

const CheckoutPage = () => {
  const [orders, setOrders] = useState(sampleOrders);
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id || null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    orders[0]?.paymentMethod || paymentMethods[0]
  );

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  const handleRowClick = (orderId, paymentMethod) => {
    setSelectedOrderId(orderId);
    setSelectedPaymentMethod(paymentMethod);
  };

  const handleDelete = (e, orderId) => {
    e.stopPropagation();
    const newOrders = orders.filter((order) => order.id !== orderId);
    setOrders(newOrders);

    if (orderId === selectedOrderId) {
      if (newOrders.length > 0) {
        setSelectedOrderId(newOrders[0].id);
        setSelectedPaymentMethod(newOrders[0].paymentMethod);
      } else {
        setSelectedOrderId(null);
        setSelectedPaymentMethod(paymentMethods[0]);
      }
    }
  };

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const handleSubmit = () => {
    if (!selectedOrder) {
      alert('주문을 선택해주세요.');
      return;
    }
    alert(`결제 완료: ${selectedOrder.id} (${selectedPaymentMethod})`);
    console.log('결제 정보:', {
      ...selectedOrder,
      paymentMethod: selectedPaymentMethod,
    });
  };

  return (
    <div className="checkout-container">
      <div className="order-table-section">
        <h2>📦 주문 내역</h2>
        <table className="order-table">
          <thead>
            <tr>
              <th>삭제</th>
              <th>주문번호</th>
              <th>주문처</th>
              <th>주문방식</th>
              <th>결제방식</th>
              <th>결제자</th>
              <th>주소</th>
              <th>내역</th>
              <th>금액</th>
              <th>시간</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className={selectedOrderId === order.id ? 'selected-row' : ''}
                onClick={() => handleRowClick(order.id, order.paymentMethod)}
              >
                 <td>
                  <button
                    className="delete-btn"
                    onClick={(e) => handleDelete(e, order.id)}
                    title="삭제"
                  >
                    ×
                  </button>
                </td>
                <td>{order.id}</td>
                <td>{order.orderSource}</td>
                <td>{order.orderMethod}</td>
                <td>{order.paymentMethod}</td>
                <td>{order.payerName}</td>
                <td>{order.payerAddress}</td>
                <td>{order.paymentDetails}</td>
                <td>{order.amount.toLocaleString()}원</td>
                <td>{order.paymentTime}</td>
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="payment-box">
        <h3>💳 결제창</h3>
        {selectedOrder ? (
          <>
            <p>주문번호: {selectedOrder.id}</p>
            <p>결제자: {selectedOrder.payerName}</p>
            <p>금액: {selectedOrder.amount.toLocaleString()}원</p>
            <label htmlFor="paymentMethod"><strong></strong></label>
            <select
              id="paymentMethod"
              className="payment-method-select"
              value={selectedPaymentMethod}
              onChange={handlePaymentMethodChange}
            >
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
            <button onClick={handleSubmit}>결제하기</button>
          </>
        ) : (
          <p>주문을 선택해주세요</p>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;