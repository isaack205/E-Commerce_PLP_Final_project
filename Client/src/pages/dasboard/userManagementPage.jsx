// // client/src/pages/dashboard/UserManagementPage.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { toast } from 'sonner';
// import {
//   UsersIcon, // For user icon
//   EyeIcon,    // For view details
//   ShieldCheckIcon // For role management
// } from '@heroicons/react/24/outline'; // Heroicons

// // Shadcn UI Components
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter
// } from '@/components/ui/dialog';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { // <--- Ensure these DropdownMenu imports are present
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';

// // Services
// import { authService } from '../../services/authApi'; // Corrected import path

// export default function UserManagementPage() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null); // For viewing details
//   const [filterRole, setFilterRole] = useState('all'); // For filtering by role

//   const fetchUsers = useCallback(async (role = 'all') => {
//     console.log(`Frontend: Attempting to fetch users with role filter: ${role}`);
//     setLoading(true);
//     setError(null);
//     try {
//       const params = {};
//       // Only add role param if it's not 'all'
//       if (role && role !== 'all') params.role = role;
      
//       const data = await authService.getAllUsers(params); // Pass params to authService
//       console.log("Frontend: Users fetched successfully:", data);
//       setUsers(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to fetch users.');
//       console.error('Frontend: Error fetching users:', err);
//       toast.error('Failed to load users.');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchUsers(filterRole);
//   }, [fetchUsers, filterRole]);

//   const handleViewDetails = (user) => {
//     setCurrentUser(user);
//     setIsModalOpen(true);
//   };

//   const handleFilterRoleChange = (value) => {
//     setFilterRole(value);
//   };

//   const handleUpdateUserRole = async (userId, newRole) => {
//     if (!window.confirm(`Are you sure you want to change user role to "${newRole}"?`)) {
//       return;
//     }
//     try {
//       await authService.updateUserRole(userId, { role: newRole });
//       toast.success(`User ${userId} role updated to ${newRole}!`);
//       fetchUsers(filterRole);
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to update user role.');
//       console.error('Error updating user role:', err);
//     }
//   };


//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
//         <p className="text-lg text-gray-700 dark:text-gray-300">Loading users...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-lg text-red-600">Error: {error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
//       <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
//         <UsersIcon className="h-7 w-7 mr-3 text-blue-500" /> User Management
//       </h1>

//       {/* Filter by Role Section */}
//       <div className="mb-6 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
//         <span className="whitespace-nowrap">Filter by Role:</span>
//         <Select onValueChange={handleFilterRoleChange} value={filterRole}>
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="All Roles" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Roles</SelectItem>
//             <SelectItem value="customer">Customer</SelectItem>
//             <SelectItem value="manager">Manager</SelectItem>
//             <SelectItem value="admin">Admin</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Conditional rendering: Render table if users array is not empty, otherwise show "No users found" */}
//       {users.length > 0 ? ( // <--- CRITICAL FIX: Ensure this condition is correct
//         <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm">
//           <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//             <thead className="bg-gray-50 dark:bg-gray-800">
//               <tr>
//                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   User ID
//                 </th>
//                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Username
//                 </th>
//                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Email
//                 </th>
//                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Role
//                 </th>
//                 <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
//               {users.map((user) => (
//                 <tr key={user._id}>
//                   <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
//                     {user._id}
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
//                     {user.username}
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
//                     {user.email}
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
//                     {user.role}
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <Button
//                       onClick={() => handleViewDetails(user)}
//                       variant="outline"
//                       size="sm"
//                       className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 mr-1"
//                     >
//                       <EyeIcon className="h-4 w-4 mr-1" /> View
//                     </Button>
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="outline" size="sm" className="text-gray-600 dark:text-gray-300">
//                           <ShieldCheckIcon className="h-4 w-4 mr-1" /> Change Role
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent className="w-48 bg-white text-gray-800 rounded-md shadow-lg">
//                         <DropdownMenuLabel>Update Role</DropdownMenuLabel>
//                         <DropdownMenuSeparator />
//                         {['customer', 'manager', 'admin'].map((roleOption) => (
//                           <DropdownMenuItem
//                             key={roleOption}
//                             onClick={() => handleUpdateUserRole(user._id, roleOption)}
//                             className="cursor-pointer hover:bg-gray-100"
//                             disabled={user.role === roleOption}
//                           >
//                             {roleOption}
//                           </DropdownMenuItem>
//                         ))}
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <p className="text-center text-lg text-gray-700 dark:text-gray-300">No users found {filterRole && filterRole !== 'all' && `with role: ${filterRole}`}.</p>
//       )}

//       {/* User Details Modal */}
//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 dark:text-gray-100">
//           <DialogHeader>
//             <DialogTitle>User Details - {currentUser?.username}</DialogTitle>
//             <DialogDescription>Full details of the selected user.</DialogDescription>
//           </DialogHeader>
//           {currentUser && (
//             <div className="grid gap-4 py-4 text-gray-700 dark:text-gray-300">
//               <p><strong>User ID:</strong> {currentUser._id}</p>
//               <p><strong>Username:</strong> {currentUser.username}</p>
//               <p><strong>Email:</strong> {currentUser.email}</p>
//               <p><strong>Role:</strong> {currentUser.role}</p>
//               <p><strong>Created At:</strong> {new Date(currentUser.createdAt).toLocaleString()}</p>
//               <p><strong>Last Updated:</strong> {new Date(currentUser.updatedAt).toLocaleString()}</p>
//             </div>
//           )}
//           <DialogFooter>
//             <Button onClick={() => setIsModalOpen(false)}>Close</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }


// client/src/pages/dashboard/UserManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  UsersIcon, // For user icon
  EyeIcon,    // For view details
  ShieldCheckIcon // For role management
} from '@heroicons/react/24/outline'; // Heroicons

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Services
import { authService } from '../../services/authApi'; // Corrected import path

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // For viewing details
  const [filterRole, setFilterRole] = useState('all'); // For filtering by role

  const fetchUsers = useCallback(async (role = 'all') => {
    console.log(`Frontend: Attempting to fetch users with role filter: ${role}`);
    setLoading(true);
    setError(null);
    try {
      const params = {};
      // Only add role param if it's not 'all'
      if (role && role !== 'all') params.role = role;
      
      const data = await authService.getAllUsers(params); // `data` will be { users: [...] }
      console.log("Frontend: Users fetched successfully:", data);

      // CRITICAL FIX: Access the 'users' property from the data object
      setUsers(Array.isArray(data.users) ? data.users : []); // <--- THIS IS THE FIX
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users.');
      console.error('Frontend: Error fetching users:', err);
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(filterRole);
  }, [fetchUsers, filterRole]);

  const handleViewDetails = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleFilterRoleChange = (value) => {
    setFilterRole(value);
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change user role to "${newRole}"?`)) {
      return;
    }
    try {
      // Assuming authService.updateUserRole(userId, newRole) exists
      await authService.updateUserRole(userId, { role: newRole });
      toast.success(`User ${userId} role updated to ${newRole}!`);
      fetchUsers(filterRole);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user role.');
      console.error('Error updating user role:', err);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <p className="text-lg text-gray-700 dark:text-gray-300">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
        <UsersIcon className="h-7 w-7 mr-3 text-blue-500" /> User Management
      </h1>

      {/* Filter by Role Section */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <span className="whitespace-nowrap">Filter by Role:</span>
        <Select onValueChange={handleFilterRoleChange} value={filterRole}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Conditional rendering: Render table only if users array is not empty, otherwise show "No users found" */}
      {users.length > 0 ? (
        <>
          <p style={{ color: 'green', fontWeight: 'bold' }}>DEBUG: Users array has {users.length} items. Table should render!</p> {/* DEBUG INDICATOR */}
          <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User ID
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Username
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user._id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {user.username}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {user.role}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        onClick={() => handleViewDetails(user)}
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 mr-1"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" /> View
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="text-gray-600 dark:text-gray-300">
                            <ShieldCheckIcon className="h-4 w-4 mr-1" /> Change Role
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48 bg-white text-gray-800 rounded-md shadow-lg">
                          <DropdownMenuLabel>Update Role</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {['customer', 'manager', 'admin'].map((roleOption) => (
                            <DropdownMenuItem
                              key={roleOption}
                              onClick={() => handleUpdateUserRole(user._id, roleOption)}
                              className="cursor-pointer hover:bg-gray-100"
                              disabled={user.role === roleOption}
                            >
                              {roleOption}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <p style={{ color: 'red', fontWeight: 'bold' }}>DEBUG: Users array is empty. "No users found" message should render.</p> {/* DEBUG INDICATOR */}
          <p className="text-center text-lg text-gray-700 dark:text-gray-300">No users found {filterRole && filterRole !== 'all' && `with role: ${filterRole}`}.</p>
        </>
      )}

      {/* User Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>User Details - {currentUser?.username}</DialogTitle>
            <DialogDescription>Full details of the selected user.</DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="grid gap-4 py-4 text-gray-700 dark:text-gray-300">
              <p><strong>User ID:</strong> {currentUser._id}</p>
              <p><strong>Username:</strong> {currentUser.username}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>Role:</strong> {currentUser.role}</p>
              <p><strong>Created At:</strong> {new Date(currentUser.createdAt).toLocaleString()}</p>
              <p><strong>Last Updated:</strong> {new Date(currentUser.updatedAt).toLocaleString()}</p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
