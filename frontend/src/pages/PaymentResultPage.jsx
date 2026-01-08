import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

function PaymentResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    if (!location.state) {
      navigate('/');
      return;
    }
    setPaymentDetails(location.state);
  }, [navigate, location]);

  if (!paymentDetails) {
    return null;
  }

  const isSuccess = paymentDetails.status === 'success';

  const maskCardNumber = (cardNumber) => {
    if (!cardNumber) return '';
    return `**** **** **** ${cardNumber.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            {isSuccess ? (
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-5xl">✓</span>
              </div>
            ) : (
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-5xl">✕</span>
              </div>
            )}
          </div>

          <h2
            className={`text-3xl font-bold font-montserrat mb-4 ${
              isSuccess ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isSuccess ? 'Payment Successful!' : 'Payment Failed!'}
          </h2>

          <p className="text-gray-600 font-noto mb-8">
            {paymentDetails.message || (isSuccess ? 'Your order has been placed successfully.' : 'Something went wrong. Please try again.')}
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h3 className="text-lg font-semibold font-poppins text-gray-800 mb-4">
              Payment Details
            </h3>

            {paymentDetails.paymentRef && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 font-noto">Payment Reference</p>
                <p className="font-semibold font-mono text-primary">
                  {paymentDetails.paymentRef}
                </p>
              </div>
            )}

            {paymentDetails.orderId && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 font-noto">Order ID</p>
                <p className="font-semibold font-mono">{paymentDetails.orderId}</p>
              </div>
            )}

            <div className="mb-3">
              <p className="text-sm text-gray-600 font-noto">Amount</p>
              <p className="font-semibold text-xl">
                ₹{paymentDetails.amount?.toLocaleString()}
              </p>
            </div>

            {paymentDetails.cardNumber && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 font-noto">Card Number</p>
                <p className="font-semibold">{maskCardNumber(paymentDetails.cardNumber)}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-600 font-noto">Status</p>
              <p
                className={`font-semibold uppercase ${
                  isSuccess ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {paymentDetails.status}
              </p>
            </div>
          </div>

          {isSuccess && paymentDetails.sneaker && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="text-lg font-semibold font-poppins text-gray-800 mb-4">
                Order Item
              </h3>
              <div className="flex items-center">
                <img
                  src={paymentDetails.sneaker.imageUrl}
                  alt={paymentDetails.sneaker.name}
                  className="w-20 h-20 object-cover rounded-md mr-4"
                />
                <div>
                  <p className="font-noto text-gray-800 font-semibold">
                    {paymentDetails.sneaker.name}
                  </p>
                  <p className="text-sm text-gray-500">{paymentDetails.sneaker.brand}</p>
                  <p className="font-semibold text-primary">
                    ₹{paymentDetails.sneaker.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-5">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-primary text-white py-5 rounded-none font-poppins font-semibold hover:bg-black hover:shadow-md transition-all duration-300"
            >
              {isSuccess ? 'Continue Shopping' : 'Back to Home'}
            </button>

            {!isSuccess && (
              <button
                onClick={() => navigate(-2)}
                className="w-full bg-white text-gray-700 border border-gray-300 py-5 rounded-none font-poppins font-semibold hover:bg-gray-100 transition-all duration-300"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentResultPage;