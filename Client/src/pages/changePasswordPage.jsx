// Imports
import React, { useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { authService } from '../services/authApi';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function ChangePasswordPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error('New password and confirm password do not match.');
      setIsSubmitting(false);
      return;
    }

    if (passwordData.newPassword.length < 8) { // Basic password length validation
      toast.error('New password must be at least 8 characters long.');
      setIsSubmitting(false);
      return;
    }

    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' }); // Clear form
      navigate('/profile/update'); // Redirect to profile page or dashboard
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
      console.error('Error changing password:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <p className="text-lg text-gray-700">Loading...</p>
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
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Change Password</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handleChange}
              className="mt-1 block w-full"
              required
            />
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handleChange}
              className="mt-1 block w-full"
              required
            />
          </div>
          <div>
            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
            <Input
              id="confirmNewPassword"
              name="confirmNewPassword"
              type="password"
              value={passwordData.confirmNewPassword}
              onChange={handleChange}
              className="mt-1 block w-full"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md" disabled={isSubmitting}>
            {isSubmitting ? 'Changing...' : 'Change Password'}
          </Button>
        </form>
      </div>
    </div>
  );
}
