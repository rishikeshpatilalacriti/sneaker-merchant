import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { makePayment } from '../services/api';

function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sneaker, setSneaker] = useState(null);
  const [loading, setLoading] = useState(false);

  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    if (!location.state || !location.state.sneaker) {
      navigate('/');
      return;
    }
    setSneaker(location.state.sneaker);
  }, [navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: value,
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (loading) return;

    setLoading(true);

    try {
      const orderId = `ORD-${Date.now()}`;

      const paymentRequest = {
        cardNumber: cardDetails.cardNumber,
        cardholderName: cardDetails.cardholderName,
        expiryDate: cardDetails.expiryDate,
        cvv: cardDetails.cvv,
        amount: sneaker.price,
        currency: 'INR',
        orderId: orderId,
      };

      const response = await makePayment(paymentRequest);

      navigate('/payment-result', {
        state: {
          status: response.data.status,
          paymentRef: response.data.paymentRef,
          message: response.data.message,
          amount: sneaker.price,
          orderId: orderId,
          sneaker: sneaker,
          cardNumber: cardDetails.cardNumber,
        },
      });
    } catch (err) {
      navigate('/payment-result', {
        state: {
          status: 'failed',
          message: err.response?.data?.message || 'Payment failed!',
          amount: sneaker.price,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  if (!sneaker) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-primary font-noto hover:underline flex items-center"
        >
          ← Back
        </button>

        <h2 className="text-3xl font-bold font-montserrat text-gray-800 mb-8">
          Checkout
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold font-poppins text-gray-800 mb-4">
              Order Summary
            </h3>

            <div className="flex items-center mb-4">
              <img
                src={sneaker.imageUrl}
                alt={sneaker.name}
                className="w-20 h-20 object-cover rounded-md mr-4"
              />
              <div>
                <p className="font-noto text-gray-800 font-semibold">{sneaker.name}</p>
                <p className="text-sm text-gray-500">{sneaker.brand}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-poppins text-xl font-bold">Total Amount:</span>
                <span className="font-poppins text-2xl font-bold text-primary">
                  ₹{sneaker.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold font-poppins text-gray-800 mb-4">
              Payment Details
            </h3>

            <form onSubmit={handlePayment}>
              <div className="mb-4">
                <label className="block text-gray-700 font-noto mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleChange}
                  required
                  maxLength="16"
                  placeholder="1234567890123456"
                  className="w-full px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-noto mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  name="cardholderName"
                  value={cardDetails.cardholderName}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-noto mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={cardDetails.expiryDate}
                    onChange={handleChange}
                    required
                    placeholder="MM/YY"
                    maxLength="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-noto mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleChange}
                    required
                    maxLength="3"
                    placeholder="123"
                    className="w-full px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-none font-poppins font-semibold hover:bg-black hover:shadow-md transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `Pay ₹${sneaker.price.toLocaleString()}`}
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                disabled={loading}
                className="w-full mt-3 bg-white text-gray-700 border border-gray-300 py-3 rounded-none font-poppins font-semibold hover:bg-gray-100 transition-all duration-300 disabled:opacity-50"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;