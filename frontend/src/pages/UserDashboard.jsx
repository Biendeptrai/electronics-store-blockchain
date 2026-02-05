import OrderList from "../components/OrderList";

const UserDashboard = ({ orders, orderCount }) => {
  return (
    <>
      <h2 style={{ color: "#38bdf8" }}>👤 USER DASHBOARD</h2>

      <p>
        📦 Tổng số đơn hàng: <b>{orderCount}</b>
      </p>

      <OrderList orders={orders} />
    </>
  );
};

export default UserDashboard;