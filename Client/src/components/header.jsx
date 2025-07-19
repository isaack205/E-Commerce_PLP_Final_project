// // Imports
// import React, { useState, useEffect, useCallback } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/authContext';

// // Import icons from heroicons
// import {
//   ShoppingBagIcon,
//   UserCircleIcon,
//   BellIcon,
//   MapPinIcon,
//   TruckIcon,
//   SunIcon,
//   MoonIcon,
//   Bars3Icon,
//   XMarkIcon
// } from '@heroicons/react/24/outline';

// import { cartService } from '../services/cartApi';
// import { categoryService } from '../services/categoryApi';
// import { toast } from 'sonner';

// // Shadcn UI DropdownMenu components
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
//   DropdownMenuSub,
//   DropdownMenuSubContent,
//   DropdownMenuSubTrigger,
// } from '@/components/ui/dropdown-menu';


// function Header() {
//   const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
//   const navigate = useNavigate();

//   const [cartItemCount, setCartItemCount] = useState(0);
//   const [categories, setCategories] = useState([]);
//   const [theme, setTheme] = useState(() => {
//     const savedTheme = localStorage.getItem('theme');
//     return savedTheme ? savedTheme : 'light';
//   });
//   // NEW: State for mobile menu open/close
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   // Effect to apply theme class to body and save to localStorage
//   useEffect(() => {
//     const root = window.document.documentElement;
//     root.classList.remove('light', 'dark');
//     root.classList.add(theme);
//     localStorage.setItem('theme', theme);
//   }, [theme]);

//   // Function to toggle theme
//   const toggleTheme = () => {
//     setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
//   };


//   // Fetch cart item count
//   useEffect(() => {
//     const getCartCount = async () => {
//       if (!authLoading && isAuthenticated && user) {
//         try {
//           const cart = await cartService.getCartByUserId(user._id);
//           setCartItemCount(cart.items.reduce((total, item) => total + item.quantity, 0));
//         } catch (err) {
//           console.error('Error fetching cart count:', err);
//           setCartItemCount(0); // Reset count on error
//         }
//       } else if (!authLoading && !isAuthenticated) {
//         setCartItemCount(0);
//       }
//     };
//     getCartCount();
//   }, [isAuthenticated, user, authLoading]);

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const data = await categoryService.getAllCategories();
//         setCategories(data);
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//       }
//     };
//     fetchCategories();
//   }, []);


//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//     setIsMobileMenuOpen(false); // Close mobile menu on logout
//   };

//   const handleNotificationClick = () => {
//     toast.info('Feature coming soon!', {
//       description: 'Notifications will appear here in a future update.',
//     });
//     setIsMobileMenuOpen(false); // Close mobile menu on notification click
//   };

//   // Function to close mobile menu after navigation
//   const handleMobileNavLinkClick = (path) => {
//     navigate(path);
//     setIsMobileMenuOpen(false);
//   };


//   return (
//     <header className="bg-blue-600 text-white p-4 shadow-md z-50 relative"> {/* Added z-50, relative for mobile menu */}
//       <nav className="container mx-auto flex justify-between items-center">
//         <Link to="/" className="text-2xl font-bold rounded-md px-2 py-1 hover:bg-blue-700 transition-colors">
//           UrbanSpree Mart
//         </Link>

//         {/* Desktop Navigation */}
//         <ul className="hidden md:flex space-x-4 items-center"> {/* <--- HIDDEN ON SMALL SCREENS */}
//           <li>
//             <Link to="/products" className="hover:underline rounded-md px-3 py-2 hover:bg-blue-700 transition-colors">
//               Products
//             </Link>
//           </li>
//           {categories.length > 0 && (
//             <li className="relative group">
//               <button className="hover:underline rounded-md px-3 py-2 hover:bg-blue-700 transition-colors cursor-pointer">
//                 Categories
//               </button>
//               <ul className="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
//                 <li>
//                   <Link to="/products" className="block px-4 py-2 hover:bg-gray-100">
//                     All Categories
//                   </Link>
//                 </li>
//                 {categories.map((category) => (
//                   <li key={category._id}>
//                     <Link to={`/products?category=${category._id}`} className="block px-4 py-2 hover:bg-gray-100">
//                       {category.name}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </li>
//           )}

//           <li>
//             <Link to="/carts" className="relative flex items-center hover:underline rounded-md px-3 py-2 hover:bg-blue-700 transition-colors">
//               <ShoppingBagIcon className="h-6 w-6" />
//               {cartItemCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                   {cartItemCount}
//                 </span>
//               )}
//             </Link>
//           </li>

//           {/* Theme Switcher - remains visible on desktop */}
//           <li>
//             <button
//               onClick={toggleTheme}
//               className="p-2 rounded-full hover:bg-blue-700 transition-colors"
//               aria-label="Toggle theme"
//             >
//               {theme === 'light' ? (
//                 <MoonIcon className="h-6 w-6" />
//               ) : (
//                 <SunIcon className="h-6 w-6" />
//               )}
//             </button>
//           </li>

//           {isAuthenticated && (
//             <>
//               {/* Notification Bell Icon - remains visible on desktop */}
//               <li>
//                 <button
//                   onClick={handleNotificationClick}
//                   className="relative p-2 rounded-full hover:bg-blue-700 transition-colors"
//                   aria-label="Notifications"
//                 >
//                   <BellIcon className="h-6 w-6" />
//                 </button>
//               </li>

//               {/* User Avatar/Icon with Dropdown Menu - remains visible on desktop */}
//               <li>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <button
//                       className="flex items-center p-2 rounded-full hover:bg-blue-700 transition-colors cursor-pointer"
//                       aria-label="User menu"
//                     >
//                       <UserCircleIcon className="h-7 w-7" />
//                       <span className="ml-2 text-sm font-medium hidden md:block">
//                         {user.username || user.email || 'User'}
//                       </span>
//                     </button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent className="w-56 bg-white text-gray-800 rounded-md shadow-lg">
//                     <DropdownMenuLabel>My Account</DropdownMenuLabel>
//                     <DropdownMenuSeparator />

//                     <DropdownMenuSub>
//                       <DropdownMenuSubTrigger className="cursor-pointer hover:bg-gray-100">
//                         Profile Settings
//                       </DropdownMenuSubTrigger>
//                       <DropdownMenuSubContent>
//                         <DropdownMenuItem onClick={() => navigate('/profile/update')} className="cursor-pointer hover:bg-gray-100">
//                           Update Profile
//                         </DropdownMenuItem>
//                         <DropdownMenuItem onClick={() => navigate('/profile/change-password')} className="cursor-pointer hover:bg-gray-100">
//                           Update Password
//                         </DropdownMenuItem>
//                       </DropdownMenuSubContent>
//                     </DropdownMenuSub>

//                     <DropdownMenuSub>
//                       <DropdownMenuSubTrigger className="cursor-pointer hover:bg-gray-100">
//                         My Addresses <MapPinIcon className="ml-auto h-4 w-4" />
//                       </DropdownMenuSubTrigger>
//                       <DropdownMenuSubContent>
//                         <DropdownMenuItem onClick={() => navigate('/addresses')} className="cursor-pointer hover:bg-gray-100">
//                           View/Manage Addresses
//                         </DropdownMenuItem>
//                         <DropdownMenuItem onClick={() => navigate('/addresses/add')} className="cursor-pointer hover:bg-gray-100">
//                           Add New Address
//                         </DropdownMenuItem>
//                       </DropdownMenuSubContent>
//                     </DropdownMenuSub>

//                     <DropdownMenuItem onClick={() => navigate('/orders')} className="cursor-pointer hover:bg-gray-100">
//                       My Orders
//                     </DropdownMenuItem>

//                     <DropdownMenuItem onClick={() => navigate('/track-shipping')} className="cursor-pointer hover:bg-gray-100">
//                       Track Shipping <TruckIcon className="ml-auto h-4 w-4" />
//                     </DropdownMenuItem>

//                     {(user.role === 'admin' || user.role === 'manager') && (
//                       <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer hover:bg-gray-100">
//                         Dashboard
//                       </DropdownMenuItem>
//                     )}
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-red-100 text-red-600">
//                       Logout
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </li>
//             </>
//           )}

//           {!isAuthenticated && (
//             <>
//               <li>
//                 <Link to="/login" className="hover:underline rounded-md px-3 py-2 hover:bg-blue-700 transition-colors">
//                   Login
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/register" className="hover:underline rounded-md px-3 py-2 hover:bg-blue-700 transition-colors">
//                   Register
//                 </Link>
//               </li>
//             </>
//           )}
//         </ul>

//         {/* Mobile Menu Button (Hamburger) */}
//         <div className="md:hidden flex items-center space-x-2"> {/* Only visible on small screens */}
//           {/* Theme Switcher - also visible on mobile */}
//           <button
//             onClick={toggleTheme}
//             className="p-2 rounded-full hover:bg-blue-700 transition-colors"
//             aria-label="Toggle theme"
//           >
//             {theme === 'light' ? (
//               <MoonIcon className="h-6 w-6" />
//             ) : (
//               <SunIcon className="h-6 w-6" />
//             )}
//           </button>

//           {/* Notification Bell Icon - also visible on mobile */}
//           {isAuthenticated && (
//             <button
//               onClick={handleNotificationClick}
//               className="relative p-2 rounded-full hover:bg-blue-700 transition-colors"
//               aria-label="Notifications"
//             >
//               <BellIcon className="h-6 w-6" />
//             </button>
//           )}

//           <button
//             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             className="p-2 rounded-md hover:bg-blue-700 transition-colors"
//             aria-label="Open mobile menu"
//           >
//             {isMobileMenuOpen ? (
//               <XMarkIcon className="h-7 w-7 text-white" />
//             ) : (
//               <Bars3Icon className="h-7 w-7 text-white" />
//             )}
//           </button>
//         </div>
//       </nav>

//       {/* Mobile Menu Content (Off-canvas/Dropdown) */}
//       <div
//         className={`fixed inset-0 bg-gray-800 bg-opacity-95 z-40 transform ${
//           isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
//         } transition-transform duration-300 ease-in-out md:hidden`}
//       >
//         <div className="flex justify-end p-4">
//           <button
//             onClick={() => setIsMobileMenuOpen(false)}
//             className="p-2 rounded-md hover:bg-blue-700 transition-colors"
//             aria-label="Close mobile menu"
//           >
//             <XMarkIcon className="h-8 w-8 text-white" />
//           </button>
//         </div>
//         <ul className="flex flex-col items-center space-y-6 text-xl p-8">
//           <li>
//             <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-blue-200 transition-colors">
//               Products
//             </Link>
//           </li>
//           {categories.length > 0 && (
//             <li>
//               <DropdownMenu> {/* Re-using DropdownMenu for categories in mobile */}
//                 <DropdownMenuTrigger asChild>
//                   <button className="block py-2 hover:text-blue-200 transition-colors">
//                     Categories
//                   </button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent className="w-48 bg-white text-gray-800 rounded-md shadow-lg">
//                   <DropdownMenuItem onClick={() => handleMobileNavLinkClick('/products')}>
//                     All Categories
//                   </DropdownMenuItem>
//                   {categories.map((category) => (
//                     <DropdownMenuItem key={category._id} onClick={() => handleMobileNavLinkClick(`/products?category=${category._id}`)}>
//                       {category.name}
//                     </DropdownMenuItem>
//                   ))}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </li>
//           )}
//           <li>
//             <Link to="/carts" onClick={() => setIsMobileMenuOpen(false)} className="relative flex items-center py-2 hover:text-blue-200 transition-colors">
//               <ShoppingBagIcon className="h-7 w-7 mr-2" />
//               Cart
//               {cartItemCount > 0 && (
//                 <span className="ml-2 bg-red-500 text-white text-sm font-bold rounded-full h-6 w-6 flex items-center justify-center">
//                   {cartItemCount}
//                 </span>
//               )}
//             </Link>
//           </li>

//           {isAuthenticated ? (
//             <>
//               <li className="w-full text-center">
//                 <DropdownMenu> {/* Re-using DropdownMenu for user profile in mobile */}
//                   <DropdownMenuTrigger asChild>
//                     <button className="flex items-center justify-center w-full py-2 hover:text-blue-200 transition-colors">
//                       <UserCircleIcon className="h-8 w-8 mr-2" />
//                       {user.username || user.email || 'User'}
//                     </button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent className="w-56 bg-white text-gray-800 rounded-md shadow-lg">
//                     <DropdownMenuLabel>My Account</DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem onClick={() => handleMobileNavLinkClick('/profile/update')}>
//                       Update Profile
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={() => handleMobileNavLinkClick('/profile/change-password')}>
//                       Update Password
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={() => handleMobileNavLinkClick('/addresses')}>
//                       View/Manage Addresses
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={() => handleMobileNavLinkClick('/addresses/add')}>
//                       Add New Address
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={() => handleMobileNavLinkClick('/orders')}>
//                       My Orders
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={() => handleMobileNavLinkClick('/track-shipping')}>
//                       Track Shipping
//                     </DropdownMenuItem>
//                     {(user.role === 'admin' || user.role === 'manager') && (
//                       <DropdownMenuItem onClick={() => handleMobileNavLinkClick('/dashboard')}>
//                         Dashboard
//                       </DropdownMenuItem>
//                     )}
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem onClick={handleLogout} className="text-red-600">
//                       Logout
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </li>
//             </>
//           ) : (
//             <>
//               <li>
//                 <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-blue-200 transition-colors">
//                   Login
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-blue-200 transition-colors">
//                   Register
//                 </Link>
//               </li>
//             </>
//           )}
//         </ul>
//       </div>
//     </header>
//   );
// }

// export default Header;

// Imports
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext'; // Ensure this path is correct

// Import icons from heroicons
import {
  ShoppingBagIcon,
  UserCircleIcon,
  BellIcon,
  MapPinIcon,
  TruckIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  BuildingLibraryIcon 
} from '@heroicons/react/24/outline';

import { cartService } from '../services/cartApi';
import { categoryService } from '../services/categoryApi';
import { toast } from 'sonner';

// Shadcn UI DropdownMenu components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';


function Header() {
  // MODIFIED: Added hasRole to destructuring
  const { user, logout, isAuthenticated, loading: authLoading, hasRole } = useAuth();
  const navigate = useNavigate();

  const [cartItemCount, setCartItemCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Effect to apply theme class to body and save to localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };


  // Fetch cart item count
  useEffect(() => {
    const getCartCount = async () => {
      if (!authLoading && isAuthenticated && user) {
        try {
          const cart = await cartService.getCartByUserId(user._id);
          // FIX: Ensure cart and cart.items are valid before reducing
          if (cart && Array.isArray(cart.items)) {
            setCartItemCount(cart.items.reduce((total, item) => total + item.quantity, 0));
          } else {
            setCartItemCount(0); // If cart or items is not an array, treat as empty
          }
        } catch (err) {
          console.error('Error fetching cart count:', err);
          setCartItemCount(0); // Reset count on error
        }
      } else if (!authLoading && !isAuthenticated) {
        setCartItemCount(0);
      }
    };
    getCartCount();
  }, [isAuthenticated, user, authLoading]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);


  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const handleNotificationClick = () => {
    toast.info('Feature coming soon!', {
      description: 'Notifications will appear here in a future update.',
    });
    setIsMobileMenuOpen(false);
  };

  const handleMobileNavLinkClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };


  return (
    <header className="bg-blue-600 text-white p-4 shadow-md z-50 relative">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold rounded-md px-2 py-1 hover:bg-blue-700 transition-colors">
          UrbanSpree Mart
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-4 items-center">
          <li>
            <Link to="/products" className="hover:underline rounded-md px-3 py-2 hover:bg-blue-700 transition-colors">
              Products
            </Link>
          </li>
          {categories.length > 0 && (
            <li className="relative group">
              <button className="hover:underline rounded-md px-3 py-2 hover:bg-blue-700 transition-colors cursor-pointer">
                Categories
              </button>
              <ul className="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
                <li>
                  <Link to="/products" className="block px-4 py-2 hover:bg-gray-100">
                    All Categories
                  </Link>
                </li>
                {categories.map((category) => (
                  <li key={category._id}>
                    <Link to={`/products?category=${category._id}`} className="block px-4 py-2 hover:bg-gray-100">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          )}

          <li>
            <Link to="/carts" className="relative flex items-center hover:underline rounded-md px-3 py-2 hover:bg-blue-700 transition-colors">
              <ShoppingBagIcon className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </li>

          {/* Theme Switcher - remains visible on desktop */}
          <li>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-blue-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <MoonIcon className="h-6 w-6" />
              ) : (
                <SunIcon className="h-6 w-6" />
              )}
            </button>
          </li>

          {isAuthenticated && (
            <>
              {/* NEW: Dashboard Link for Admin/Manager (Desktop) */}
              {(hasRole('admin') || hasRole('manager')) && (
                <li>
                  <Link to="/dashboard" className="hover:underline rounded-md px-3 py-2 hover:bg-blue-700 transition-colors flex items-center">
                    <BuildingLibraryIcon className="h-6 w-6 mr-1" /> Dashboard
                  </Link>
                </li>
              )}

              {/* Notification Bell Icon - remains visible on desktop */}
              <li>
                <button
                  onClick={handleNotificationClick}
                  className="relative p-2 rounded-full hover:bg-blue-700 transition-colors"
                  aria-label="Notifications"
                >
                  <BellIcon className="h-6 w-6" />
                </button>
              </li>

              {/* User Avatar/Icon with Dropdown Menu - remains visible on desktop */}
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center p-2 rounded-full hover:bg-blue-700 transition-colors cursor-pointer"
                      aria-label="User menu"
                    >
                      <UserCircleIcon className="h-7 w-7" />
                      <span className="ml-2 text-sm font-medium hidden md:block">
                        {user.username || user.email || 'User'}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white text-gray-800 rounded-md shadow-lg">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="cursor-pointer hover:bg-gray-100">
                        Profile Settings
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => navigate('/profile/update')} className="cursor-pointer hover:bg-gray-100">
                          Update Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/profile/change-password')} className="cursor-pointer hover:bg-gray-100">
                          Update Password
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="cursor-pointer hover:bg-gray-100">
                        My Addresses <MapPinIcon className="ml-auto h-4 w-4" />
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => navigate('/addresses')} className="cursor-pointer hover:bg-gray-100">
                          View/Manage Addresses
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/addresses/add')} className="cursor-pointer hover:bg-gray-100">
                          Add New Address
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuItem onClick={() => navigate('/orders')} className="cursor-pointer hover:bg-gray-100">
                      My Orders
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => navigate('/track-shipping')} className="cursor-pointer hover:bg-gray-100">
                      Track Shipping <TruckIcon className="ml-auto h-4 w-4" />
                    </DropdownMenuItem>

                    {/* Dashboard link within user dropdown (redundant but can be kept for consistency) */}
                    {(hasRole('admin') || hasRole('manager')) && (
                      <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer hover:bg-gray-100">
                        Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-red-100 text-red-600">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </>
          )}

          {!isAuthenticated && (
            <>
              <li>
                <Link to="/login" className="hover:underline rounded-md px-3 py-2 hover:bg-blue-700 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:underline rounded-md px-3 py-2 hover:bg-blue-700 transition-colors">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Menu Button (Hamburger) */}
        <div className="md:hidden flex items-center space-x-2">
          {/* Theme Switcher - also visible on mobile */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-blue-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <MoonIcon className="h-6 w-6" />
            ) : (
              <SunIcon className="h-6 w-6" />
            )}
          </button>

          {/* Notification Bell Icon - also visible on mobile */}
          {isAuthenticated && (
            <button
              onClick={handleNotificationClick}
              className="relative p-2 rounded-full hover:bg-blue-700 transition-colors"
              aria-label="Notifications"
            >
              <BellIcon className="h-6 w-6" />
            </button>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md hover:bg-blue-700 transition-colors"
            aria-label="Open mobile menu"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-7 w-7 text-white" />
            ) : (
              <Bars3Icon className="h-7 w-7 text-white" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Content (Off-canvas/Dropdown) */}
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-95 z-40 transform ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-md hover:bg-blue-700 transition-colors"
            aria-label="Close mobile menu"
          >
            <XMarkIcon className="h-8 w-8 text-white" />
          </button>
        </div>
        <ul className="flex flex-col items-center space-y-6 text-xl p-8">
          <li>
            <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-blue-200 transition-colors">
              Products
            </Link>
          </li>
          {categories.length > 0 && (
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="block py-2 hover:text-blue-200 transition-colors">
                    Categories
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white text-gray-800 rounded-md shadow-lg">
                  <DropdownMenuItem onClick={() => handleMobileNavLinkClick('/products')}>
                    All Categories
                  </DropdownMenuItem>
                  {categories.map((category) => (
                    <DropdownMenuItem key={category._id} onClick={() => handleMobileNavLinkClick(`/products?category=${category._id}`)}>
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          )}
          <li>
            <Link to="/carts" onClick={() => setIsMobileMenuOpen(false)} className="relative flex items-center py-2 hover:text-blue-200 transition-colors">
              <ShoppingBagIcon className="h-7 w-7 mr-2" />
              Cart
              {cartItemCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-sm font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              {/* NEW: Dashboard Link for Admin/Manager (Mobile) */}
              {(hasRole('admin') || hasRole('manager')) && (
                <li>
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-blue-200 transition-colors flex items-center justify-center">
                    <BuildingLibraryIcon className="h-7 w-7 mr-2" /> Dashboard
                  </Link>
                </li>
              )}

              <li className="w-full text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center justify-center w-full py-2 hover:text-blue-200 transition-colors">
                      <UserCircleIcon className="h-8 w-8 mr-2" />
                      {user.username || user.email || 'User'}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white text-gray-800 rounded-md shadow-lg">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleMobileNavLinkClick('/profile/update')}>
                      Update Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleMobileNavLinkClick('/profile/change-password')}>
                      Update Password
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleMobileNavLinkClick('/addresses')}>
                      View/Manage Addresses
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleMobileNavLinkClick('/addresses/add')}>
                      Add New Address
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleMobileNavLinkClick('/orders')}>
                      My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleMobileNavLinkClick('/track-shipping')}>
                      Track Shipping
                    </DropdownMenuItem>
                    {/* Dashboard link within user dropdown (redundant but can be kept for consistency) */}
                    {(user.role === 'admin' || user.role === 'manager') && (
                      <DropdownMenuItem onClick={() => handleMobileNavLinkClick('/dashboard')}>
                        Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-blue-200 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-blue-200 transition-colors">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Header;

