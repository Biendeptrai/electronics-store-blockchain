const OrderCard = ({ order }) => {
  return (
    <div className="glass-card order-card">
      <h3>📦 Order #{order.orderId}</h3>

      <p>🔧 Product ID: <b>{order.productId}</b></p>
      <p>💰 Giá (VND): <b>{order.amountVND}</b></p>
      <p className="mono">👤 Buyer: {order.buyer}</p>
      <p>🕒 {order.createdAt}</p>
    </div>
  );
};

export default OrderCard;