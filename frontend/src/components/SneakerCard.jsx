import { useNavigate } from 'react-router-dom';

function SneakerCard({ sneaker }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/sneaker/${sneaker.id}`);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    navigate('/checkout', { state: { sneaker } });
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden mb-4"
      onClick={handleCardClick}
    >
      <div className="h-48 overflow-hidden bg-gray-100">
        <img
          src={sneaker.imageUrl}
          alt={sneaker.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold font-poppins text-gray-800 mb-1">
          {sneaker.name}
        </h3>
        <p className="text-sm text-gray-500 font-noto mb-2">{sneaker.brand}</p>
        <p className="text-xl font-bold text-primary mb-3">
          ₹{sneaker.price.toLocaleString()}
        </p>

        <p className="text-xs text-gray-500 mb-3">
          Stock: {sneaker.stockQuantity} available
        </p>

        <button
          onClick={handleBuyNow}
          disabled={sneaker.stockQuantity === 0}
          className="w-full bg-primary text-white py-2 rounded-none font-poppins hover:bg-black hover:shadow-md transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {sneaker.stockQuantity === 0 ? 'Out of Stock' : 'Buy Now'}
        </button>
      </div>
    </div>
  );
}

export default SneakerCard;