import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import sneakersData from '../data/sneakers.json';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sneaker, setSneaker] = useState(null);

  useEffect(() => {
    const foundSneaker = sneakersData.find(s => s.id === parseInt(id));
    setSneaker(foundSneaker);
  }, [id]);

  const handleBuyNow = () => {
    if (sneaker.stockQuantity === 0) {
      alert('This sneaker is out of stock!');
      return;
    }
    navigate('/checkout', { state: { sneaker } });
  };

  if (!sneaker) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-gray-600">Sneaker not found!</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-primary text-white px-6 py-2 rounded-lg font-poppins hover:bg-black hover:shadow-md transition-all duration-300 mx-auto block"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-primary font-noto hover:underline flex items-center"
        >
          ← Back to Collection
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <img
              src={sneaker.imageUrl}
              alt={sneaker.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-4xl font-bold font-montserrat text-gray-800 mb-2">
              {sneaker.name}
            </h1>
            <p className="text-xl text-gray-500 font-noto mb-6">{sneaker.brand}</p>

            <div className="mb-6">
              <p className="text-4xl font-bold text-primary mb-4">
                ₹{sneaker.price.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 font-noto">
                Stock: {sneaker.stockQuantity} available
              </p>
            </div>

            {sneaker.description && (
              <div className="mb-15">
                <h3 className="text-lg font-semibold font-poppins text-gray-800 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 font-noto leading-relaxed">
                  {sneaker.description}
                </p>
              </div>
            )}

            <button
              onClick={handleBuyNow}
              disabled={sneaker.stockQuantity === 0}
              className="w-full bg-primary text-white py-4 rounded-none font-poppins font-semibold text-lg hover:bg-black hover:shadow-md transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {sneaker.stockQuantity === 0 ? 'Out of Stock' : 'Buy Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;