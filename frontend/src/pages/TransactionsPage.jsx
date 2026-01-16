import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getTransactions } from '../services/api';

function TransactionsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    cardholderName: '',
    cardNumber: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTransactions([]);

    try {
      const response = await getTransactions(formData);
      setTransactions(response.data);
      
      if (response.data.length === 0) {
        setError('No transactions found for this account.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch transactions. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const maskCardNumber = (cardNumber) => {
    if (!cardNumber) return '';
    return `**** **** **** ${cardNumber.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-primary font-noto hover:underline flex items-center"
        >
          ← Back to Home
        </button>

        <h2 className="text-3xl font-bold font-montserrat text-gray-800 mb-8">
          Transaction History
        </h2>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold font-poppins text-gray-800 mb-4">
            Enter Your Details
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-noto mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                name="cardholderName"
                value={formData.cardholderName}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-noto mb-2">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                required
                maxLength="16"
                placeholder="1234567890123456"
                className="w-full px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-noto mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
                className="w-full px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {error && (
              <div className="mb-4 bg-red-100 text-red-600 p-3 rounded-none text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-black text-white py-3 rounded-none font-poppins font-semibold  hover:shadow-md transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'View Transactions'}
            </button>
          </form>
        </div>

        {transactions.length > 0 && (
          <div className="bg-white rounded-none shadow-md p-6">
            <h3 className="text-xl font-semibold font-poppins text-gray-800 mb-4">
              Your Transactions
            </h3>

            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border border-gray-200 rounded-none p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold font-poppins text-gray-800">
                        {transaction.paymentRef}
                      </p>
                      <p className="text-sm text-gray-500 font-noto">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        transaction.status === 'SUCCESS'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="font-semibold text-primary">
                        ₹{transaction.amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Card</p>
                      <p className="font-semibold text-sm">
                        {maskCardNumber(transaction.cardNumber)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionsPage;