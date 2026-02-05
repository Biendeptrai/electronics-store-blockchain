import './App.css';
import { useState, useEffect } from 'react';
import { connectWallet } from './services/wallet';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import {
  getOrderCount,
  getOrderByIndex,
  createOrder
} from './services/blockchain';

const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111

function App() {
  const [wallet, setWallet] = useState('');
  const [orders, setOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ===== FORM STATE =====
  const [productId, setProductId] = useState('');
  const [amountVND, setAmountVND] = useState('');
  const [txHash, setTxHash] = useState('');

  /* ================= AUTO RELOAD KHI ĐỔI MẠNG ================= */
  useEffect(() => {
    if (!window.ethereum) return;

    const handleChainChanged = () => window.location.reload();
    window.ethereum.on('chainChanged', handleChainChanged);

    return () =>
      window.ethereum.removeListener('chainChanged', handleChainChanged);
  }, []);

  /* ================= LOAD ORDERS ================= */
  const loadOrders = async () => {
    const countBN = await getOrderCount();
    const total = Number(countBN);
    setOrderCount(total);

    if (total === 0) {
      setOrders([]);
      return;
    }

    const list = [];
    for (let i = 1; i <= total; i++) {
      const o = await getOrderByIndex(i);
      list.push({
        orderId: o.orderId.toString(),
        productId: o.productId.toString(),
        amountVND: o.amountVND.toString(),
        buyer: o.buyer,
        createdAt: new Date(
          Number(o.createdAt) * 1000
        ).toLocaleString('vi-VN')
      });
    }

    setOrders(list);
  };

  /* ================= CONNECT WALLET ================= */
  const handleConnectWallet = async () => {
    try {
      setLoading(true);
      setError('');

      // 1️⃣ Kết nối MetaMask
      const address = await connectWallet();
      if (!address) return;
      setWallet(address);

      // 2️⃣ Kiểm tra mạng Sepolia
      const chainId = await window.ethereum.request({
        method: 'eth_chainId'
      });

      if (chainId !== SEPOLIA_CHAIN_ID) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SEPOLIA_CHAIN_ID }]
        });
        return; // reload lại app
      }

      // 3️⃣ Load order
      await loadOrders();
    } catch (err) {
      console.error(err);
      setError('❌ Không đọc được dữ liệu từ blockchain');
    } finally {
      setLoading(false);
    }
  };

  /* ================= CREATE ORDER ================= */
  const handleCreateOrder = async () => {
    if (!productId || !amountVND) {
      alert('Nhập đầy đủ Product ID và Giá');
      return;
    }

    try {
      setLoading(true);
      setTxHash('');

      const hash = await createOrder(
        Number(productId),
        Number(amountVND)
      );

      setTxHash(hash);
      setProductId('');
      setAmountVND('');

      await loadOrders();
    } catch (err) {
      console.error(err);
      alert('❌ Tạo order thất bại');
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        🔐 HỆ THỐNG ĐƠN HÀNG / BẢO HÀNH BLOCKCHAIN
      </h1>

      <p style={styles.subtitle}>
        Minh bạch dữ liệu đơn hàng bằng Smart Contract
      </p>

      <button style={styles.button} onClick={handleConnectWallet}>
        {wallet
          ? `Đã kết nối: ${wallet.slice(0, 6)}...${wallet.slice(-4)}`
          : 'Kết nối MetaMask'}
      </button>

      {loading && <p>⏳ Đang xử lý...</p>}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}

      {wallet && (
        <p style={{ marginTop: 10 }}>
          📊 Tổng số đơn hàng: <b>{orderCount}</b>
        </p>
      )}

      {/* ===== FORM CREATE ORDER ===== */}
      {wallet && (
        <OrderForm
          productId={productId}
          setProductId={setProductId}
          amountVND={amountVND}
          setAmountVND={setAmountVND}
          onSubmit={handleCreateOrder}
          loading={loading}
        />
      )}

      {txHash && (
        <p style={{ fontSize: 12 }}>
          Tx:{' '}
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {txHash.slice(0, 20)}...
          </a>
        </p>
      )}

      {/* ===== ORDER LIST ===== */}
      <OrderList orders={orders} />
    </div>
  );
}

/* ================= STYLE ================= */
const styles = {
  container: {
    minHeight: '100vh',
    background: '#0f172a',
    color: '#e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '40px'
  },
  title: { fontSize: '32px', color: '#38bdf8' },
  subtitle: { color: '#94a3b8', marginBottom: 20 },
  button: {
    padding: '10px 20px',
    borderRadius: 8,
    background: '#22c55e',
    border: 'none',
    cursor: 'pointer'
  }
};

export default App;