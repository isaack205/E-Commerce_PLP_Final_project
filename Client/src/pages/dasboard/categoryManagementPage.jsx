// Imports
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  TagIcon, // For category icon
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'; // Heroicons

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // For description
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';

// Services
import { categoryService } from '../../services/categoryApi'; // To get categories

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null); // For editing
  const [categoryFormData, setCategoryFormData] = useState({ // For form inputs
    name: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getAllCategories();
      setCategories(Array.isArray(data) ? data : []); // Confirm `data` is an array
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories.');
      console.error('CategoryManagementPage: Error fetching categories:', err);
      toast.error('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Open modal for creating a new category
  const handleCreateNewCategory = () => {
    setIsEditing(false);
    setCurrentCategory(null);
    setCategoryFormData({
      name: '',
      description: '',
    });
    setIsModalOpen(true);
  };

  // Open modal for editing an existing category
  const handleEditCategory = (category) => {
    setIsEditing(true);
    setCurrentCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description || '',
    });
    setIsModalOpen(true);
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!categoryFormData.name) {
      toast.error('Category name is required.');
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEditing) {
        await categoryService.updateCategory(currentCategory._id, categoryFormData);
        toast.success('Category updated successfully!');
      } else {
        await categoryService.createCategory(categoryFormData);
        toast.success('Category created successfully!');
      }
      setIsModalOpen(false); // Close modal
      fetchCategories(); // Re-fetch categories to update the list
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} category.`);
      console.error(`Error ${isEditing ? 'updating' : 'creating'} category:`, err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle category deletion
  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }
    try {
      // Correctly calling deleteCategoryById from categoryService
      await categoryService.deleteCategoryById(categoryId);
      toast.success('Category deleted successfully!');
      fetchCategories(); // Re-fetch categories
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category.');
      console.error('Error deleting category:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <p className="text-lg text-gray-700 dark:text-gray-300">Loading categories...</p>
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
        <TagIcon className="h-7 w-7 mr-3 text-blue-500" /> Category Management
      </h1>

      <div className="flex justify-end mb-6">
        <Button onClick={handleCreateNewCategory} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center">
          <PlusCircleIcon className="h-5 w-5 mr-2" /> Add New Category
        </Button>
      </div>

      {/* Conditional rendering: Render table only if categories.length > 0 */}
      {categories.length > 0 ? (
        <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {categories.map((category) => (
                <tr key={category._id}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {category.name}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">
                    {category.description || 'N/A'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      onClick={() => handleEditCategory(category)}
                      variant="outline"
                      size="sm"
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 mr-1"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteCategory(category._id)}
                      variant="destructive"
                      size="sm"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-lg text-gray-700 dark:text-gray-300">No categories found. Add a new category to get started.</p>
      )}

      {/* Category Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Category' : 'Create New Category'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Make changes to the category here.' : 'Fill in the details for a new category.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                name="name"
                value={categoryFormData.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={categoryFormData.description}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3} // Provide some rows for better UX
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isSubmitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create Category')}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
