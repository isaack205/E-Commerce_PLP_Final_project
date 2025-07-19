// Imports
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { authService } from '../services/authApi';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function UpdateProfilePage() {
  const { user, updateUser, loading: authLoading } = useAuth();
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    // Add other fields you expect to update
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authLoading && user) {
        try {
          setLoading(true);
          const fetchedProfile = await authService.getProfile();
          setProfileData({
            username: fetchedProfile.username || '',
            email: fetchedProfile.email || '',
            phoneNumber: fetchedProfile.phoneNumber || '',
            // Initialize other fields from fetchedProfile
          });
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to load profile data.');
          console.error('Error fetching profile:', err);
        } finally {
          setLoading(false);
        }
      } else if (!authLoading && !user) {
        setLoading(false); // No user to fetch profile for
      }
    };

    fetchProfile();
  }, [user, authLoading]); // Re-fetch when user or authLoading changes

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updatedUser = await authService.updateProfile(profileData);
      updateUser(updatedUser.user); // Update user in AuthContext
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
      console.error('Error updating profile:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <p className="text-lg text-gray-700">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)] text-red-600">
        <p className="text-lg">You must be logged in to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-md">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Update Profile</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              value={profileData.username}
              onChange={handleChange}
              className="mt-1 block w-full"
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={profileData.email}
              onChange={handleChange}
              className="mt-1 block w-full"
              required
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={profileData.phoneNumber}
              onChange={handleChange}
              className="mt-1 block w-full"
            />
          </div>
          {/* Add more fields as needed */}
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </div>
    </div>
  );
}
