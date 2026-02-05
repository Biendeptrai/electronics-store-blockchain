import './App.css';
import { useState, useEffect } from 'react';
import { connectWallet } from './services/wallet';
import {
  getOrderCount,
  getOrderByIndex,
  createOrder,
  getOwner
} from './services/blockchain';

// 👇 DASHBOARD
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';

const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111

function App() {
  const [wallet, setWallet] = useState('');
  const [role, setRole] = useState('');
  const [orders, setOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ===== FORM STATE (ADMIN) =====
  const [productId, setProductId] = useState('');
  const [amountVND, setAmountVND] = useState('');
  const [buyer, setBuyer] = useState('');
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
    const total = await getOrderCount();
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

      const address = await connectWallet();
      if (!address) return;
      setWallet(address);

      const chainId = await window.ethereum.request({
        method: 'eth_chainId'
      });

      if (chainId !== SEPOLIA_CHAIN_ID) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SEPOLIA_CHAIN_ID }]
        });
        return;
      }

      // 🔐 CHECK ROLE
      const owner = await getOwner();
      if (owner.toLowerCase() === address.toLowerCase()) {
        setRole('ADMIN');
      } else {
        setRole('USER');
      }

      await loadOrders();
    } catch (err) {
      console.error(err);
      setError('❌ Không đọc được dữ liệu từ blockchain');
    } finally {
      setLoading(false);
    }
  };

  /* ================= CREATE ORDER (ADMIN) ================= */
  const handleCreateOrder = async () => {
    if (!productId || !amountVND || !buyer) {
      alert('Nhập đầy đủ Product ID, Giá và Buyer');
      return;
    }

    try {
      setLoading(true);
      setTxHash('');

      const hash = await createOrder(
        Number(productId),
        Number(amountVND),
        buyer
      );

      setTxHash(hash);
      setProductId('');
      setAmountVND('');
      setBuyer('');

      await loadOrders();
    } catch (err) {
      console.error(err);
      alert('❌ Tạo order thất bại (chỉ ADMIN được phép)');
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

      <button style={styles.button} onClick={handleConnectWallet}>
        {wallet
          ? `👛 ${wallet.slice(0, 6)}...${wallet.slice(-4)} (${role})`
          : 'Kết nối MetaMask'}
      </button>

      {loading && <p>⏳ Đang xử lý...</p>}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}

      {/* ===== DASHBOARD THEO ROLE ===== */}
      {wallet && role === 'ADMIN' && (
        <AdminDashboard
          orders={orders}
          orderCount={orderCount}
          productId={productId}
          setProductId={setProductId}
          amountVND={amountVND}
          setAmountVND={setAmountVND}
          buyer={buyer}
          setBuyer={setBuyer}
          onCreateOrder={handleCreateOrder}
          loading={loading}
          txHash={txHash}
        />
      )}

      {wallet && role === 'USER' && (
        <UserDashboard
          orders={orders}
          orderCount={orderCount}
        />
      )}
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
  title: {
    fontSize: '32px',
    color: '#38bdf8',
    marginBottom: '16px'
  },
  button: {
    padding: '10px 20px',
    borderRadius: '8px',
    background: '#22c55e',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default App;