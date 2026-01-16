import { useState } from 'react';
import Navbar from '../components/Navbar';
import SneakerCard from '../components/SneakerCard';
import sneakersData from '../data/sneakers.json';

function HomePage() {
  const [sneakers] = useState(sneakersData);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold font-montserrat text-gray-800 mb-6">
          Our Collection
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sneakers.map((sneaker) => (
            <SneakerCard key={sneaker.id} sneaker={sneaker} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;