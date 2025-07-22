// Imports
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  PhotoIcon, // For image input
  XMarkIcon // For closing modal
} from '@heroicons/react/24/outline'; // Heroicons

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Services
import { productService } from '../../services/productApi';
import { categoryService } from '../../services/categoryApi'; // To get categories for dropdown

export default function ProductManagementPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null); // For editing
  const [productFormData, setProductFormData] = useState({ // For form inputs
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    category: '',
    brand: '',
    variant: '',
    image: null, // For file object
    imageUrl: '' // To display existing image or preview new one
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAllProducts();
      // Backend now returns full Cloudinary URL directly in product.image
      // And handles returning an empty array if no products found (200 OK)
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products.');
      console.error('Error fetching products:', err);
      toast.error('Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories.');
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductFormData(prevState => ({
        ...prevState,
        image: file,
        imageUrl: URL.createObjectURL(file) // Create a preview URL for the new file
      }));
    } else {
      setProductFormData(prevState => ({
        ...prevState,
        image: null,
        // If no new file selected, revert to the existing product's image URL
        // product.image is already the full Cloudinary URL
        imageUrl: isEditing && currentProduct && currentProduct.image
                    ? currentProduct.image
                    : ''
      }));
    }
  };

  // Open modal for creating a new product
  const handleCreateNewProduct = () => {
    setIsEditing(false);
    setCurrentProduct(null);
    setProductFormData({
      name: '', description: '', price: '', stockQuantity: '', category: '',
      brand: '', variant: '',
      image: null, imageUrl: ''
    });
    setIsModalOpen(true);
  };

  // Open modal for editing an existing product
  const handleEditProduct = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setProductFormData({
      name: product.name, description: product.description, price: product.price,
      stockQuantity: product.stockQuantity,
      category: product.category ? (product.category._id || product.category) : '',
      brand: product.brand || '',
      variant: product.variant || '',
      image: null, // Always null initially for editing, as user might upload new one
      // Display current product image directly from its stored URL
      imageUrl: product.image || ''
    });
    setIsModalOpen(true);
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!productFormData.name || !productFormData.description || !productFormData.price ||
        !productFormData.stockQuantity || !productFormData.category ||
        !productFormData.brand || !productFormData.variant) {
      toast.error('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }
    if (parseFloat(productFormData.price) <= 0 || parseInt(productFormData.stockQuantity) < 0) {
      toast.error('Price must be positive, Stock Quantity cannot be negative.');
      setIsSubmitting(false);
      return;
    }
    // Check for image on new product creation only if a file isn't already selected for preview.
    // The backend should return an error if no image is supplied and required.
    if (!isEditing && !productFormData.image) {
      toast.error('Please select an image for the new product.');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', productFormData.name);
    formData.append('description', productFormData.description);
    formData.append('price', productFormData.price);
    formData.append('stockQuantity', productFormData.stockQuantity);
    formData.append('category', productFormData.category);
    formData.append('brand', productFormData.brand);
    formData.append('variant', productFormData.variant);
    if (productFormData.image) {
      // THIS IS THE CRITICAL FIX: The field name MUST match Multer config on backend ('productImage')
      formData.append('productImage', productFormData.image);
    }

    try {
      if (isEditing) {
        await productService.updateProduct(currentProduct._id, formData);
        toast.success('Product updated successfully!');
      } else {
        await productService.createProduct(formData);
        toast.success('Product created successfully!');
      }
      setIsModalOpen(false);
      fetchProducts(); // Refetch to display updated list
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} product.`);
      console.error(`Error ${isEditing ? 'updating' : 'creating'} product:`, err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }
    try {
      await productService.deleteProduct(productId);
      toast.success('Product deleted successfully!');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product.');
      console.error('Error deleting product:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <p className="text-lg text-gray-700 dark:text-gray-300">Loading products...</p>
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
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Product Management</h1>

      <div className="flex justify-end mb-6">
        <Button onClick={handleCreateNewProduct} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center">
          <PlusCircleIcon className="h-5 w-5 mr-2" /> Add New Product
        </Button>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-lg text-gray-700 dark:text-gray-300">No products found. Add a new product to get started.</p>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Image
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Brand
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Variant
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price (Ksh)
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <img
                      // product.image is the full Cloudinary URL, no prefix needed
                      src={product.image || `https://placehold.co/60x60/E0E0E0/333333?text=No+Img`}
                      alt={product.name}
                      className="h-10 w-10 rounded-md object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/60x60/E0E0E0/333333?text=No+Img`; }}
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {product.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {product.category ? (product.category.name || product.category) : 'N/A'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {product.brand || 'N/A'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {product.variant || 'N/A'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {product.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {product.stockQuantity}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      onClick={() => handleEditProduct(product)}
                      variant="outline"
                      size="sm"
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 mr-1"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteProduct(product._id)}
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
      )}

      {/* Product Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Product' : 'Create New Product'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Make changes to the product here.' : 'Fill in the details for a new product.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                name="name"
                value={productFormData.name}
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
                value={productFormData.description}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={productFormData.price}
                onChange={handleInputChange}
                className="col-span-3"
                required
                min="0.01"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stockQuantity" className="text-right">Stock</Label>
              <Input
                id="stockQuantity"
                name="stockQuantity"
                type="number"
                value={productFormData.stockQuantity}
                onChange={handleInputChange}
                className="col-span-3"
                required
                min="0"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Select
                onValueChange={(value) => setProductFormData(prevState => ({ ...prevState, category: value }))}
                value={productFormData.category}
                name="category"
                required
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Brand Input Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="brand" className="text-right">Brand</Label>
              <Input
                id="brand"
                name="brand"
                value={productFormData.brand}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            {/* Variant Input Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="variant" className="text-right">Variant</Label>
              <Input
                id="variant"
                name="variant"
                value={productFormData.variant}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">Image</Label>
              <div className="col-span-3 flex flex-col items-start space-y-2">
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
                {productFormData.imageUrl && (
                  <img
                    src={productFormData.imageUrl}
                    alt="Product Preview"
                    className="mt-2 h-24 w-24 object-cover rounded-md border dark:border-gray-700"
                  />
                )}
                {!isEditing && !productFormData.image && (
                    <p className="text-sm text-red-500">Image is required for new products.</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isSubmitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create Product')}
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