// // client/src/components/common/Header.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/authContext';
// import { categoryService } from '../services/categoryApi';
// import { cartService } from '../services/cartApi';
// import { ShoppingCartIcon } from '@heroicons/react/20/solid';

// function Header() {
//   const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
//   const navigate = useNavigate();
//   const [categories, setCategories] = useState([]);
//   const [cartItemCount, setCartItemCount] = useState(0);

//   // Effect to fetch categories on component mount
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await categoryService.getAllCategories();
//         setCategories(response.categories || response.data || []);
//       } catch (err) {
//         console.error('Error fetching categories for header:', err);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Effect to fetch cart item count
//   useEffect(() => {
//     const getCartCount = async () => {
//       // Ensure authLoading is false, user is authenticated, and user object is available
//       if (!authLoading && isAuthenticated && user) {
//         try {
//           const response = await cartService.getCartByUserId(user._id);
//           const count = response.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
//           setCartItemCount(count);
//         } catch (err) {
//           console.error('Error fetching cart count:', err);
//           setCartItemCount(0); // Reset count on error
//         }
//       } else if (!authLoading && !isAuthenticated) {
//         // If authentication is done loading but the user is not authenticated,
//         // ensure the cart count is 0.
//         setCartItemCount(0);
//       }
//     };
//     getCartCount();
//     // Re-run this effect when authentication status, user object, or auth loading state changes.
//   }, [isAuthenticated, user, authLoading]);


//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <header className="bg-blue-600 text-white p-4 shadow-md">
//       <nav className="container mx-auto flex justify-between items-center">
//         <Link to="/" className="text-2xl font-bold rounded-md px-2 py-1 hover:bg-blue-700 transition-colors">
//           UrbanSpree Mart
//         </Link>
//         <ul className="flex space-x-4 items-center">
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
//               <ShoppingCartIcon className="h-6 w-6" />
//               {cartItemCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                   {cartItemCount}
//                 </span>
//               )}
//             </Link>
//           </li>

//           {isAuthenticated ? (
//             <>
//               {(user.role === 'admin' || user.role === 'manager') && (
//                 <li>
//                   <Link to="/dashboard" className="hover:underline rounded-md px-3 py-2 hover:bg-blue-700 transition-colors">
//                     Dashboard
//                   </Link>
//                 </li>
//               )}
//               <li>
//                 <Link to="/orders" className="hover:underline rounded-md px-3 py-2 hover:bg-blue-700 transition-colors">
//                   My Orders
//                 </Link>
//               </li>
//               <li>
//                 <button
//                   onClick={handleLogout}
//                   className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors"
//                 >
//                   Logout ({user.username || user.email})
//                 </button>
//               </li>
//             </>
//           ) : (
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
//       </nav>
//     </header>
//   );
// }

// export default Header;




// // Imports
// import React, { useState, useEffect, useCallback } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/authContext';

// // Import icons from heroicons
// import { ShoppingBagIcon, UserCircleIcon, BellIcon } from '@heroicons/react/24/outline';

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
// } from '@/components/ui/dropdown-menu';


// function Header() {
//   const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
//   const navigate = useNavigate();

//   const [cartItemCount, setCartItemCount] = useState(0);
//   const [categories, setCategories] = useState([]);

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
//   };

//   const handleNotificationClick = () => {
//     toast.info('Feature coming soon!', {
//       description: 'Notifications will appear here in a future update.',
//     });
//   };

//   return (
//     <header className="bg-blue-600 text-white p-4 shadow-md">
//       <nav className="container mx-auto flex justify-between items-center">
//         <Link to="/" className="text-2xl font-bold rounded-md px-2 py-1 hover:bg-blue-700 transition-colors">
//           UrbanSpree Mart
//         </Link>
//         <ul className="flex space-x-4 items-center">
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
//               <ShoppingBagIcon className="h-6 w-6" /> {/* <--- CHANGED: Used ShoppingBagIcon */}
//               {cartItemCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                   {cartItemCount}
//                 </span>
//               )}
//             </Link>
//           </li>

//           {isAuthenticated && (
//             <>
//               {/* Notification Bell Icon */}
//               <li>
//                 <button
//                   onClick={handleNotificationClick}
//                   className="relative p-2 rounded-full hover:bg-blue-700 transition-colors"
//                   aria-label="Notifications"
//                 >
//                   <BellIcon className="h-6 w-6" /> {/* <--- CHANGED: Used BellIcon */}
//                   {/* Optional: Add a notification badge if you implement real notifications */}
//                   {/* <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span> */}
//                 </button>
//               </li>

//               {/* User Avatar/Icon with Dropdown Menu */}
//               <li>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <button
//                       className="flex items-center p-2 rounded-full hover:bg-blue-700 transition-colors cursor-pointer"
//                       aria-label="User menu"
//                     >
//                       <UserCircleIcon className="h-7 w-7" /> {/* <--- CHANGED: Used UserCircleIcon */}
//                       <span className="ml-2 text-sm font-medium hidden md:block">
//                         {user.username || user.email || 'User'}
//                       </span>
//                     </button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent className="w-56 bg-white text-gray-800 rounded-md shadow-lg">
//                     <DropdownMenuLabel>My Account</DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem onClick={() => navigate('/profile/update')} className="cursor-pointer hover:bg-gray-100">
//                       Update Profile
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={() => navigate('/profile/change-password')} className="cursor-pointer hover:bg-gray-100">
//                       Update Password
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={() => navigate('/orders')} className="cursor-pointer hover:bg-gray-100">
//                       My Orders
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
//       </nav>
//     </header>
//   );
// }

// export default Header;



// // Imports
// import React, { useState, useEffect, useCallback } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/authContext';

// // Import icons from heroicons
// import { ShoppingBagIcon, UserCircleIcon, BellIcon, MapPinIcon, TruckIcon } from '@heroicons/react/24/outline'; // Added MapPinIcon, TruckIcon

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
//   DropdownMenuSub,          // <--- NEW
//   DropdownMenuSubContent,   // <--- NEW
//   DropdownMenuSubTrigger,   // <--- NEW
// } from '@/components/ui/dropdown-menu';


// function Header() {
//   const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
//   const navigate = useNavigate();

//   const [cartItemCount, setCartItemCount] = useState(0);
//   const [categories, setCategories] = useState([]);

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
//   };

//   const handleNotificationClick = () => {
//     toast.info('Feature coming soon!', {
//       description: 'Notifications will appear here in a future update.',
//     });
//   };

//   return (
//     <header className="bg-blue-600 text-white p-4 shadow-md">
//       <nav className="container mx-auto flex justify-between items-center">
//         <Link to="/" className="text-2xl font-bold rounded-md px-2 py-1 hover:bg-blue-700 transition-colors">
//           UrbanSpree Mart
//         </Link>
//         <ul className="flex space-x-4 items-center">
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

//           {isAuthenticated && (
//             <>
//               {/* Notification Bell Icon */}
//               <li>
//                 <button
//                   onClick={handleNotificationClick}
//                   className="relative p-2 rounded-full hover:bg-blue-700 transition-colors"
//                   aria-label="Notifications"
//                 >
//                   <BellIcon className="h-6 w-6" />
//                   {/* Optional: Add a notification badge if you implement real notifications */}
//                   {/* <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span> */}
//                 </button>
//               </li>

//               {/* User Avatar/Icon with Dropdown Menu */}
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

//                     {/* Profile Settings Sub-menu */}
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

//                     {/* My Addresses Sub-menu */}
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

//                     {/* Track Shipping Link */}
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
//       </nav>
//     </header>
//   );
// }

// export default Header;


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
//   SunIcon,   // <--- NEW: Sun Icon for light mode
//   MoonIcon   // <--- NEW: Moon Icon for dark mode
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
//   // NEW: State for theme, initialized from localStorage or defaults to 'light'
//   const [theme, setTheme] = useState(() => {
//     const savedTheme = localStorage.getItem('theme');
//     return savedTheme ? savedTheme : 'light';
//   });

//   // Effect to apply theme class to body and save to localStorage
//   useEffect(() => {
//     const root = window.document.documentElement;
//     root.classList.remove('light', 'dark'); // Remove existing themes
//     root.classList.add(theme); // Add current theme
//     localStorage.setItem('theme', theme); // Save preference
//   }, [theme]); // Re-run when theme changes

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
//   };

//   const handleNotificationClick = () => {
//     toast.info('Feature coming soon!', {
//       description: 'Notifications will appear here in a future update.',
//     });
//   };

//   return (
//     <header className="bg-blue-600 text-white p-4 shadow-md">
//       <nav className="container mx-auto flex justify-between items-center">
//         <Link to="/" className="text-2xl font-bold rounded-md px-2 py-1 hover:bg-blue-700 transition-colors">
//           UrbanSpree Mart
//         </Link>
//         <ul className="flex space-x-4 items-center">
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

//           {/* Theme Switcher */}
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
//               {/* Notification Bell Icon */}
//               <li>
//                 <button
//                   onClick={handleNotificationClick}
//                   className="relative p-2 rounded-full hover:bg-blue-700 transition-colors"
//                   aria-label="Notifications"
//                 >
//                   <BellIcon className="h-6 w-6" />
//                   {/* Optional: Add a notification badge if you implement real notifications */}
//                   {/* <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span> */}
//                 </button>
//               </li>

//               {/* User Avatar/Icon with Dropdown Menu */}
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

//                     {/* Profile Settings Sub-menu */}
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

//                     {/* My Addresses Sub-menu */}
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

//                     {/* Track Shipping Link */}
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
//       </nav>
//     </header>
//   );
// }

// export default Header;

// Imports
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

// Import icons from heroicons
import {
  ShoppingBagIcon,
  UserCircleIcon,
  BellIcon,
  MapPinIcon,
  TruckIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon, // <--- NEW: Hamburger icon
  XMarkIcon // <--- NEW: Close icon for mobile menu
} from '@heroicons/react/24/outline'; // Using 24/outline for consistency

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
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [cartItemCount, setCartItemCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light';
  });
  // NEW: State for mobile menu open/close
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
          setCartItemCount(cart.items.reduce((total, item) => total + item.quantity, 0));
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
    setIsMobileMenuOpen(false); // Close mobile menu on logout
  };

  const handleNotificationClick = () => {
    toast.info('Feature coming soon!', {
      description: 'Notifications will appear here in a future update.',
    });
    setIsMobileMenuOpen(false); // Close mobile menu on notification click
  };

  // Function to close mobile menu after navigation
  const handleMobileNavLinkClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };


  return (
    <header className="bg-blue-600 text-white p-4 shadow-md z-50 relative"> {/* Added z-50, relative for mobile menu */}
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold rounded-md px-2 py-1 hover:bg-blue-700 transition-colors">
          UrbanSpree Mart
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-4 items-center"> {/* <--- HIDDEN ON SMALL SCREENS */}
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

                    {(user.role === 'admin' || user.role === 'manager') && (
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
        <div className="md:hidden flex items-center space-x-2"> {/* Only visible on small screens */}
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
              <DropdownMenu> {/* Re-using DropdownMenu for categories in mobile */}
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
              <li className="w-full text-center">
                <DropdownMenu> {/* Re-using DropdownMenu for user profile in mobile */}
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


