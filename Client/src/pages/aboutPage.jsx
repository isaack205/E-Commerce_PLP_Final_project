// client/src/pages/AboutPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, StarIcon, ShieldCheckIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[calc(100vh-200px)]">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 mb-4 animate-fade-in-down">
          About UrbanSpree Mart
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in-up">
          Your trusted destination for quality products and an unparalleled shopping experience.
        </p>
      </header>

      {/* Our Story/Mission Section */}
      <section className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 mb-12 animate-slide-in-left">
        <div className="flex flex-col md:flex-row items-center md:space-x-8">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <img
              src="https://placehold.co/600x400/A0D9F0/000000?text=Our+Story" // Placeholder image
              alt="Our Story"
              className="rounded-lg shadow-md w-full h-auto object-cover"
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">Our Story & Mission</h2>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              At UrbanSpree Mart, we believe that online shopping should be more than just a transaction – it should be an experience. Born from a passion for bringing convenience, variety, and quality directly to your fingertips, we set out to create a marketplace that truly understands and caters to your everyday needs.
            </p>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mt-4">
              Our mission is simple: **To empower your lifestyle by providing easy access to a diverse range of high-quality products, backed by exceptional service and a commitment to your satisfaction.**
            </p>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="mb-12 text-center animate-fade-in-up">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
            <StarIcon className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Quality Assurance</h3>
            <p className="text-gray-700 dark:text-gray-300 text-center">
              We meticulously select products to ensure they meet the highest standards of quality and durability.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
            <ShieldCheckIcon className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Customer Trust</h3>
            <p className="text-gray-700 dark:text-gray-300 text-center">
              Your trust is our top priority. We operate with transparency, integrity, and a focus on secure transactions.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
            <ShoppingBagIcon className="h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Diverse Selection</h3>
            <p className="text-gray-700 dark:text-gray-300 text-center">
              From electronics to fashion, home essentials to unique gifts, discover a world of choices.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
            <HeartIcon className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community Focus</h3>
            <p className="text-gray-700 dark:text-gray-300 text-center">
              We aim to build a strong community around our brand, fostering connections and shared experiences.
            </p>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="bg-blue-50 dark:bg-blue-950 rounded-lg shadow-xl p-8 mb-12 animate-slide-in-right">
        <div className="flex flex-col md:flex-row-reverse items-center md:space-x-reverse md:space-x-8">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <img
              src="https://placehold.co/600x400/ADD8E6/000000?text=What+We+Offer" // Placeholder image
              alt="What We Offer"
              className="rounded-lg shadow-md w-full h-auto object-cover"
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">What We Offer</h2>
            <ul className="list-disc list-inside text-lg leading-relaxed text-gray-700 dark:text-gray-300 space-y-2">
              <li>**Vast Product Range:** Explore thousands of products across various categories.</li>
              <li>**Competitive Pricing:** Get the best value for your money with our fair and transparent pricing.</li>
              <li>**Seamless Shopping:** Enjoy an intuitive and user-friendly website designed for your convenience.</li>
              <li>**Secure Payments:** Shop with confidence using our secure and diverse payment options.</li>
              <li>**Reliable Delivery:** Fast and dependable shipping services to get your orders to you on time.</li>
              <li>**Dedicated Support:** Our friendly customer service team is always ready to assist you.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center bg-blue-600 dark:bg-blue-800 text-white p-8 rounded-lg shadow-lg animate-fade-in-up">
        <h2 className="text-3xl font-bold mb-4">Join the UrbanSpree Family!</h2>
        <p className="text-lg mb-6">
          Experience the future of online shopping. Discover, shop, and enjoy with UrbanSpree Mart.
        </p>
        <Link
          to="/products"
          className="inline-block bg-white text-blue-600 dark:text-blue-800 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-transform duration-300"
        >
          Start Shopping Now
        </Link>
      </section>

      {/* Simple CSS for animations (add to your global CSS or a style tag if not using a CSS-in-JS solution) */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .animate-fade-in-down { animation: fadeInDown 1s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 1s ease-out forwards; }
        .animate-slide-in-left { animation: slideInLeft 1s ease-out forwards; }
        .animate-slide-in-right { animation: slideInRight 1s ease-out forwards; }

        /* Delay animations */
        .animate-fade-in-up:nth-child(2) { animation-delay: 0.3s; }
        section:nth-of-type(1) { animation-delay: 0.5s; }
        section:nth-of-type(2) { animation-delay: 0.7s; }
        section:nth-of-type(3) { animation-delay: 0.9s; }
        section:nth-of-type(4) { animation-delay: 1.1s; }
      `}</style>
    </div>
  );
}
