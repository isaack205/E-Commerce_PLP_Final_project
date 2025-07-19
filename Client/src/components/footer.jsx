// // Imports
// import React from 'react';

// function Footer() {
//   return (
//     <footer className="bg-gray-800 text-white p-4 mt-8 shadow-inner">
//       <div className="container mx-auto text-center">
//         <p>&copy; {new Date().getFullYear()} Urban Spree Mart. All rights reserved.</p>
//       </div>
//     </footer>
//   );
// }

// export default Footer;


// Imports
import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 py-10 mt-12 shadow-inner dark:bg-gray-950 dark:text-gray-400">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border-b border-gray-700 dark:border-gray-800 pb-8 mb-8">

          {/* Column 1: Company Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="text-3xl font-bold text-blue-400 hover:text-blue-300 transition-colors mb-2">
              UrbanSpree Mart
            </Link>
            <p className="text-sm mb-4 max-w-xs">
              Your one-stop shop for all your needs. Quality products, unbeatable prices, delivered to your door.
            </p>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                {/* <InstagramIcon className="h-6 w-6" /> */}
                Instagram
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                {/* <LinkedinIcon className="h-6 w-6" /> */}
                LinkedIn
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white transition-colors text-sm">Home</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors text-sm">Shop All Products</Link></li>
              <li><Link to="/carts" className="hover:text-white transition-colors text-sm">View Cart</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors text-sm">My Orders</Link></li>
              <li><Link to="/track-shipping" className="hover:text-white transition-colors text-sm">Track My Order</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Service & Policies */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold text-white mb-4">Customer Service</h3>
            {/* <ul className="space-y-2 mb-6">
              <li><Link to="/faq" className="hover:text-white transition-colors text-sm">FAQ</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors text-sm">Returns & Exchanges</Link></li>
              <li><Link to="/shipping-info" className="hover:text-white transition-colors text-sm">Shipping Information</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-white transition-colors text-sm">Terms of Service</Link></li>
            </ul> */}

            <h3 className="text-xl font-semibold text-white mb-4">Accepted Payments</h3>
            <div className="flex justify-center md:justify-start space-x-3 text-2xl">
              {/* Placeholder for payment icons - replace with actual icons/images if available */}
              <span className="text-gray-400" title="M-Pesa">📱</span> {/* Mobile money icon */}
              <span className="text-gray-400" title="Cash on Delivery">💰</span>
            </div>
          </div>

          {/* Column 4: Contact Info */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold text-white mb-4">Contact Us</h3>
            <p className="text-sm mb-2">
              Email: <a href="mailto:support@urbanspreemart.com" className="hover:text-white transition-colors">kahuraisaac30@gmail.com</a>
            </p>
            <p className="text-sm mb-2">
              Phone: <a href="tel:+254712345678" className="hover:text-white transition-colors">+254 742 328 330</a>
            </p>
            <p className="text-sm mb-2">
              Address: 123 E-Commerce Lane, <br />
              Nairobi, 00100, Kenya
            </p>
            <p className="text-sm">
              Working Hours: Mon - Fri, 9 AM - 5 PM (EAT)
            </p>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-600">
          <p>&copy; {currentYear} UrbanSpree Mart. All rights reserved.</p>
          <p>Designed with ❤️ by Isaac</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
