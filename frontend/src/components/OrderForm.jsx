const OrderForm = ({
  productId,
  setProductId,
  amountVND,
  setAmountVND,
  onSubmit,
  loading
}) => {
  return (
    <div className="glass-card">
      <h3 className="card-title">➕ Tạo đơn hàng mới</h3>

      <input
        className="input"
        placeholder="Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      />

      <input
        className="input"
        placeholder="Giá (VND)"
        value={amountVND}
        onChange={(e) => setAmountVND(e.target.value)}
      />

      <button
        className="primary-btn"
        onClick={onSubmit}
        disabled={loading}
      >
        {loading ? '⏳ Đang ghi...' : 'Ghi Order lên Blockchain'}
      </button>
    </div>
  );
};

export default OrderForm;