import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, ShieldCheck, Clock } from 'lucide-react';

const Home = () => {
  const categories = [
    { name: 'Plumber', icon: '🔧' },
    { name: 'Electrician', icon: '⚡' },
    { name: 'Painter', icon: '🎨' },
    { name: 'Carpenter', icon: '🪚' },
    { name: 'Cleaner', icon: '🧹' },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-blue-700 py-20 px-4 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Find Trusted Local Help Instantly</h1>
        <p className="text-xl mb-10 text-blue-100 max-w-3xl mx-auto">
          Connecting you with verified plumbers, electricians, and more in your neighborhood.
        </p>
        <div className="max-w-2xl mx-auto flex flex-col md:flex-row shadow-2xl rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="What service do you need?"
            className="flex-grow p-4 text-gray-800 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Pincode"
            className="md:w-32 p-4 text-gray-800 border-t md:border-t-0 md:border-l border-gray-200 focus:outline-none"
          />
          <button className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold px-8 py-4 transition duration-300">
            Search
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/search?category=${cat.name}`}
              className="flex flex-col items-center p-8 bg-gray-50 rounded-xl hover:bg-blue-50 transition duration-300 transform hover:-translate-y-1 shadow-sm"
            >
              <span className="text-4xl mb-4">{cat.icon}</span>
              <span className="font-semibold text-gray-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">Why LocalHelper?</h2>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Verified Professionals</h3>
              <p className="text-gray-600">Every provider is manually verified by our team for quality and trust.</p>
            </div>
            <div className="p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                <Star size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Top Rated Services</h3>
              <p className="text-gray-600">Read reviews from real neighbors to choose the best professional.</p>
            </div>
            <div className="p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Quick Response</h3>
              <p className="text-gray-600">Connect via WhatsApp or call instantly to get your job done.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
