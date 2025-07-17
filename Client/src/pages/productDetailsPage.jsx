// Imports
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductDetailsModal from '../components/productDetailsModal'; // Import the modal component

export default function ProductDetailsPage() {
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/products'); // Navigate back to the products list
  };

  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)] text-red-600">
        <p className="text-lg">Product ID missing from URL.</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <ProductDetailsModal productId={id} onClose={handleClose} />
    </div>
  );
}