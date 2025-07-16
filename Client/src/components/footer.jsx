// Imports
import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-8 shadow-inner">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Urban Spree Mart. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
