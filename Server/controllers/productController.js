// Imports
const Product = require('../models/product');
const fs = require('fs'); // Import file system module for deleting files
const path = require('path'); // Import path module for path manipulation

// Helper function to get root directory path (for file deletion)
const getRootPath = () => process.cwd();

// Create product
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image, brand, variant, stockQuantity } = req.body;

        // Determine image path: use uploaded file path or default
        const imagePath = req.file ? `/uploads/${req.file.filename}` : 'default-post.jpg';

        const product = await Product.create({
            name, description, price, category,
            image: imagePath, // Save the path relative to the public URL
            brand, variant, stockQuantity
        });
        res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting new file for non-existent product:', err);
            });
        }
        res.status(500).json({message: "Error creating product", Error: error.message})
    }

};
// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category', 'name').sort({ createdAt: -1 });
        if(!products || products.length === 0) {
            return res.status(404).json({message: "Products not found"})
        }
        res.status(200).json({ message: "Products fetched successfully", products });
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", Error: error.message });
    }
};
// Get product by ID
exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id).populate('category', 'name');
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product fetched successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", Error: error.message });
    }
};
// Update product
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const updates = { ...req.body };
    try {
        // Find the existing product to check its current image and if it exists
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            // If new file was uploaded but product not found, delete the new file
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Error deleting new file for non-existent product:', err);
                });
            }
            return res.status(404).json({ message: "Product not found" });
        }

        // If a new image file is uploaded, update the image path in updates object
        if (req.file) {
            updates.image = `/uploads/${req.file.filename}`;

            // If an old image exists and is not the default, delete it
            if (existingProduct.image && existingProduct.image !== 'default-post.jpg') {
                const oldImagePath = path.join(getRootPath(), existingProduct.image);
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error('Error deleting old product image:', err);
                });
            }
        }

        // Perform the update
        const product = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).populate('category', 'name');

        if (!product) {
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Error deleting new file for non-existent product:', err);
                });
            }
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting new file for non-existent product:', err);
            });
        }
        res.status(500).json({ message: "Error updating product", Error: error.message });
    }
};
// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const productToDelete = await Product.findById(req.params.id);
        if (!productToDelete) {
            return res.status(404).json({ message: "Product not found" });
        }
        // Proceed to delete the product from the database
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        // If the product was successfully deleted and has a non-default image, delete the image file
        if (deletedProduct && deletedProduct.image && deletedProduct.image !== 'default-post.jpg') {
            const imagePath = path.join(getRootPath(), deletedProduct.image);
            fs.unlink(imagePath, (err) => { // Use fs.unlink (async) to delete the file
                if (err) console.error('Error deleting product image file:', err);
            });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", Error: error.message });
    }
};
// Get products by category
exports.getProductsByCategory = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const products = await Product.find({ category: categoryId }).populate('category', 'name').sort({ createdAt: -1 });
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found in this category" });
        }
        res.status(200).json({ message: "Products for category fetched successfully", products });
    } catch (error) {
        res.status(500).json({ message: "Error fetching products by category", Error: error.message });
    }
};
