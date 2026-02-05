import { useState } from 'react';

function OrderList({ orders }) {
  const [searchProductId, setSearchProductId] = useState('');

  // 🔍 FILTER THEO PRODUCT ID
  const filteredOrders = orders.filter((o) =>
    searchProductId
      ? o.productId.includes(searchProductId)
      : true
  );

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.heading}>📦 Danh sách đơn hàng</h3>

      {/* 🔎 SEARCH INPUT */}
      <input
        placeholder="🔍 Tìm theo Product ID..."
        value={searchProductId}
        onChange={(e) => setSearchProductId(e.target.value)}
        style={styles.search}
      />

      {filteredOrders.length === 0 && (
        <p style={{ marginTop: 20, color: '#94a3b8' }}>
          ❌ Không tìm thấy đơn hàng
        </p>
      )}

      {filteredOrders.map((o) => (
        <div key={o.orderId} style={styles.card}>
          <h4>📦 Order #{o.orderId}</h4>
          <p>🔧 Product ID: <b>{o.productId}</b></p>
          <p>💰 Giá (VND): {o.amountVND}</p>
          <p>👤 Buyer: {o.buyer}</p>
          <p>🕒 Thời gian: {o.createdAt}</p>
        </div>
      ))}
    </div>
  );
}

/* ================= STYLE ================= */
const styles = {
  wrapper: {
    width: '100%',
    maxWidth: 600,
    marginTop: 30
  },
  heading: {
    color: '#38bdf8',
    marginBottom: 10
  },
  search: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    border: '1px solid #334155',
    background: '#020617',
    color: '#e5e7eb',
    marginBottom: 20
  },
  card: {
    background: '#020617',
    border: '1px solid #334155',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    textAlign: 'left'
  }
};

export default OrderList;