import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/')}
          >
            <span className="text-2xl font-bold font-montserrat text-primary">
              SneakerStore
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
  onClick={() => navigate('/check-payment')}
  className="bg-blue-600 hover:bg-black text-white px-4 py-2 rounded-none font-poppins  hover:shadow-md transition-all duration-300"
>
  Check Payment
</button>
            <button
              onClick={() => navigate('/transactions')}
              className="bg-blue-600 hover:bg-black text-white px-4 py-2 rounded-none font-poppins  hover:shadow-md transition-all duration-300"
            >
              Show Transactions
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;