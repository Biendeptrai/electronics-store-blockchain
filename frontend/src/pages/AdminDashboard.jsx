import OrderForm from "../components/OrderForm";
import OrderList from "../components/OrderList";

const AdminDashboard = ({
  orders,
  orderCount,
  productId,
  setProductId,
  amountVND,
  setAmountVND,
  buyer,
  setBuyer,
  onCreateOrder,
  loading,
  txHash
}) => {
  return (
    <>
      <h2 style={{ color: "#22c55e" }}>🛠 ADMIN DASHBOARD</h2>

      <p>
        📊 Tổng số đơn hàng: <b>{orderCount}</b>
      </p>

      <OrderForm
        productId={productId}
        setProductId={setProductId}
        amountVND={amountVND}
        setAmountVND={setAmountVND}
        buyer={buyer}
        setBuyer={setBuyer}
        onSubmit={onCreateOrder}
        loading={loading}
      />

      {txHash && (
        <p style={{ fontSize: 12 }}>
          Tx:{" "}
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {txHash.slice(0, 20)}...
          </a>
        </p>
      )}

      <OrderList orders={orders} />
    </>
  );
};

export default AdminDashboard;