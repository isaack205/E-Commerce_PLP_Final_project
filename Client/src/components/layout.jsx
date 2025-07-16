// Imports
import React from 'react';
import Header from './header';
import Footer from './footer';

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen font-inter"> {/* flex-col and min-h-screen to ensure footer sticks to the bottom */}
      <Header /> {/* Renders navigation bar */}
      <main className="flex-grow container mx-auto p-4"> {/* flex-grow allows main content to expand and push footer down */}
        {children} {/* THIS IS WHERE YOUR PAGE COMPONENTS (like LoginPage) WILL BE RENDERED */}
      </main>
      <Footer /> {/* Renders page footer */}
    </div>
  );
}

export default Layout;