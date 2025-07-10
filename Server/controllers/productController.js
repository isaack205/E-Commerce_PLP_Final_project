// Imports
const Product = require('../models/product');
const { validationResult } = require('express-validator');

// Create product
exports.createProduct = async (req, res) => {
    // Check for errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({Error: errors.array()})
    };

    try {
        const product = await Product.create(...req.body);
        res.status(201).json({ message: "Product created successfully", post });
    } catch (error) {
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
    const updates = req.body;
    try {
        const product = await Product.findByIdAndUpdate(id, updates, { new: true }).populate('category', 'name');
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Error updating product", Error: error.message });
    }
};
// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
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
        res.status(200).json({ message: "Products fetched successfully", products });
    } catch (error) {
        res.status(500).json({ message: "Error fetching products by category", Error: error.message });
    }
};
