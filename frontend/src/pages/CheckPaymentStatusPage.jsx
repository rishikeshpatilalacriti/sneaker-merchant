import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getPaymentStatus } from '../services/api';

function CheckPaymentStatusPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState('');
  const [paymentRef, setPaymentRef] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentRef.trim()) {
      setError('Please enter a payment reference');
      return;
    }

    setLoading(true);
    setError('');
    setPaymentDetails(null);

    try {
      const response = await getPaymentStatus(paymentRef.trim());
      setPaymentDetails(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Payment not found with reference: ' + paymentRef);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch payment details');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPaymentRef('');
    setPaymentDetails(null);
    setError('');
  };

  const maskCardNumber = (cardNumber) => {
    if (!cardNumber) return '';
    return `**** **** **** ${cardNumber.slice(-4)}`;
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return '';
    return new Date(dateTime).toLocaleString();
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
          Check Payment Status
        </h2>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold font-poppins text-gray-800 mb-4">
            Enter Payment Reference
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-noto mb-2">
                Payment Reference
              </label>
              <input
                type="text"
                value={paymentRef}
                onChange={(e) => {
                  setPaymentRef(e.target.value);
                  setError('');
                }}
                placeholder="e.g., PAY-ABC12345"
                className="w-full px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the payment reference received after payment
              </p>
            </div>

            {error && (
              <div className="mb-4 bg-red-100 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || !paymentRef.trim()}
                className="flex-1 bg-blue-600 hover:bg-black text-white py-3 rounded-none font-poppins font-semibold  hover:shadow-lg transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Checking...' : 'Check Status'}
              </button>

              {(paymentDetails || error) && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-6 bg-white text-gray-700 border border-gray-300 py-3 rounded-lg font-poppins font-semibold hover:bg-gray-100 transition-all duration-300"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        {paymentDetails && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 ${
                paymentDetails.status === 'SUCCESS' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className="text-3xl">
                  {paymentDetails.status === 'SUCCESS' ? '✓' : '✕'}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold font-poppins text-gray-800">
                  Payment Details
                </h3>
                <p className={`text-lg font-semibold ${
                  paymentDetails.status === 'SUCCESS' ? 'text-green-600' : 'text-red-600'
                }`}>
                  Status: {paymentDetails.status}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-noto mb-1">Payment Reference</p>
                  <p className="font-semibold font-mono text-primary">
                    {paymentDetails.paymentRef}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-noto mb-1">Order ID</p>
                  <p className="font-semibold font-mono">
                    {paymentDetails.orderId}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-noto mb-1">Amount</p>
                  <p className="font-semibold text-xl text-primary">
                    {paymentDetails.currency} ₹{paymentDetails.amount?.toLocaleString()}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-noto mb-1">Card Number</p>
                  <p className="font-semibold">
                    {maskCardNumber(paymentDetails.cardNumber)}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-noto mb-1">Created At</p>
                  <p className="font-semibold text-sm">
                    {formatDateTime(paymentDetails.createdAt)}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-noto mb-1">Updated At</p>
                  <p className="font-semibold text-sm">
                    {formatDateTime(paymentDetails.updatedAt)}
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-primary">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> This payment reference can be used to track your transaction. 
                  Save it for future reference.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckPaymentStatusPage;