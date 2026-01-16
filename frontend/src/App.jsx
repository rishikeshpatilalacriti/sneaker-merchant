import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentResultPage from './pages/PaymentResultPage';
import TransactionsPage from './pages/TransactionsPage';
import CheckPaymentStatusPage from './pages/CheckPaymentStatusPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sneaker/:id" element={<ProductDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment-result" element={<PaymentResultPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/check-payment" element={<CheckPaymentStatusPage />} />
      </Routes>
    </Router>
  );
}

export default App;