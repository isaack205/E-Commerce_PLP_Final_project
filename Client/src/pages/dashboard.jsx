// // client/src/pages/DashboardPage.jsx
// import React, { useState, useEffect } from 'react';
// import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/authContext';
// import { toast } from 'sonner';
// import {
//   BuildingLibraryIcon,
//   NewspaperIcon,
//   UsersIcon,
//   NumberedListIcon,
//   TruckIcon,
//   TagIcon, // Using TagIcon for categories
//   Bars3Icon, // For mobile menu toggle
//   XMarkIcon // For mobile menu close
// } from '@heroicons/react/24/outline'; // Using Heroicons for dashboard navigation

// export default function DashboardPage() {
//   const { user, loading: authLoading, isAuthenticated, hasRole } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

//   // Redirect if not authorized
//   useEffect(() => {
//     if (!authLoading && (!isAuthenticated || !(hasRole('admin') || hasRole('manager')))) {
//       toast.error('Access Denied: You do not have permission to view the dashboard.');
//       navigate('/login'); // Redirect to login or home
//     }
//   }, [authLoading, isAuthenticated, hasRole, navigate]);

//   // Define navigation items with their paths, icons, and required roles
//   const navItems = [
//     { name: 'Dashboard Overview', path: '/dashboard', icon: BuildingLibraryIcon, roles: ['admin', 'manager'] },
//     { name: 'Product Management', path: '/dashboard/products', icon: NewspaperIcon, roles: ['admin', 'manager'] },
//     { name: 'Order Management', path: '/dashboard/orders', icon: NumberedListIcon, roles: ['admin', 'manager'] },
//     { name: 'User Management', path: '/dashboard/users', icon: UsersIcon, roles: ['admin'] }, // Typically admin only
//     { name: 'Category Management', path: '/dashboard/categories', icon: TagIcon, roles: ['admin', 'manager'] },
//     { name: 'Shipping Management', path: '/dashboard/shipping', icon: TruckIcon, roles: ['admin', 'manager'] },
//     // { name: 'Cart Management', path: '/dashboard/carts', icon: ShoppingCartIcon, roles: ['admin', 'manager'] }, // Added as a placeholder, might be less common for direct management
//     // Add other dashboard sections here as you create them
//   ];

//   if (authLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[calc(100vh-160px)] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
//         <p className="text-lg">Loading dashboard...</p>
//       </div>
//     );
//   }

//   // If not authorized after loading, the useEffect will handle redirection.
//   // This prevents rendering unauthorized content briefly.
//   if (!isAuthenticated || !(hasRole('admin') || hasRole('manager'))) {
//     return null; // Or a small loading spinner while redirecting
//   }

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
//       {/* Mobile Sidebar Toggle Button and Header */}
//       <div className="md:hidden p-4 bg-gray-800 dark:bg-gray-900 w-full flex justify-between items-center fixed top-0 left-0 z-30 shadow-md">
//         <span className="text-white text-lg font-semibold">Dashboard</span>
//         <button
//           onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
//           className="p-2 rounded-md hover:bg-gray-700 transition-colors"
//           aria-label="Toggle sidebar"
//         >
//           {isMobileSidebarOpen ? (
//             <XMarkIcon className="h-7 w-7 text-white" />
//           ) : (
//             <Bars3Icon className="h-7 w-7 text-white" />
//           )}
//         </button>
//       </div>

//       {/* Sidebar */}
//       <aside
//         className={`fixed inset-y-0 left-0 z-20 w-64 bg-gray-800 dark:bg-gray-900 text-white shadow-lg
//           transform md:translate-x-0 transition-transform duration-300 ease-in-out
//           ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:flex-shrink-0 md:pt-0 pt-16`}
//       >
//         <div className="p-6 text-center border-b border-gray-700 dark:border-gray-800">
//           <h2 className="text-2xl font-bold text-blue-400">Admin Panel</h2>
//           <p className="text-sm text-gray-400 mt-1">{user.username || user.email}</p>
//         </div>
//         <nav className="mt-6">
//           <ul className="space-y-2 px-4">
//             {navItems.map((item) => (
//               (hasRole(item.roles)) && ( // Conditionally render based on user role
//                 <li key={item.name}>
//                   <Link
//                     to={item.path}
//                     onClick={() => setIsMobileSidebarOpen(false)} // Close sidebar on click
//                     className={`flex items-center p-3 rounded-lg transition-colors duration-200
//                       ${location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path + '/')) // Added + '/' for better sub-route matching
//                         ? 'bg-blue-700 dark:bg-blue-800 text-white shadow-md'
//                         : 'hover:bg-gray-700 dark:hover:bg-gray-700 text-gray-300 hover:text-white'
//                       }`}
//                   >
//                     <item.icon className="h-6 w-6 mr-3" />
//                     <span className="font-medium">{item.name}</span>
//                   </Link>
//                 </li>
//               )
//             ))}
//           </ul>
//         </nav>
//       </aside>

//       {/* Main Content Area */}
//       <main className="flex-1 p-6 md:ml-0 pt-20 md:pt-6"> {/* Adjusted padding for mobile header */}
//         <Outlet /> {/* This is where sub-dashboard components will render */}
//       </main>
//     </div>
//   );
// }

// client/src/pages/DashboardPage.jsx
import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboardIcon,
  PackageIcon, // For Product Management
  MapPinIcon, // For Address Management
  ClipboardListIcon, // For Order Management
  UsersIcon, // For User Management
  TagIcon, // For Category Management
  TruckIcon, // For Shipping Management
  MenuIcon, // For mobile menu toggle
  XIcon // For close menu toggle
} from 'lucide-react';

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-100 dark:bg-gray-900">
      {/* Mobile Menu Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white shadow-lg"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-md p-4 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:flex md:flex-shrink-0`}
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Admin Panel</h2>
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                <LayoutDashboardIcon className="h-5 w-5 mr-3" /> Dashboard Overview
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/products"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                <PackageIcon className="h-5 w-5 mr-3" /> Product Management
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/addresses"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                <MapPinIcon className="h-5 w-5 mr-3" /> Address Management
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/orders"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                <ClipboardListIcon className="h-5 w-5 mr-3" /> Order Management
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/users"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                <UsersIcon className="h-5 w-5 mr-3" /> User Management
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/categories"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                <TagIcon className="h-5 w-5 mr-3" /> Category Management
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/shipping"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                <TruckIcon className="h-5 w-5 mr-3" /> Shipping Management
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content Area */}
      {/* FIX: Adjust padding-left for mobile and margin-left for desktop */}
      <main className="flex-1 p-6 pt-16 md:pt-6 md:ml-64"> {/* Increased pt for mobile, added md:ml-64 */}
        <Outlet />
      </main>
    </div>
  );
}


