// Imports
const Category = require('../models/category');

// Create category
exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json({message: "Category created successfully", category})
    } catch (error) {
        res.status(500).json({message: "Error creating category", error: error.message})
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        if(!categories || categories.length === 0) {
            return res.status(404).json({message: "Categories not found"})
        }
        res.status(200).json({message: "Categories fetched successfully", categories});
    } catch (error) {
        res.status(500).json({message: "Error fetching categories"})
    }
};

// Get category by id
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
        if(!category) {
            return res.status(404).json({message: "Category not found"})
        }
        res.status(200).json({message: "Category fetched successfully", category});
    } catch (error) {
        res.status(500).json({message: "Error fetching category", category});
    }
};

// Update category by Id
exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        // Update fields if provided
        if (req.body.name) category.name = req.body.name;
        if (req.body.description) category.description = req.body.description;

        await category.save(); // This will trigger the pre-save hook and update the slug if name changed

        res.status(200).json({ message: 'Category updated', category });
    } catch (error) {
        res.status(400).json({ message: 'Error updating category', error: error.message });
    }
};

// Delete category by id
exports.deleteCategoryById = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        };
        res.status(200).json({message: "Category created successfully"});
    } catch (error) {
        res.status(500).json({message: "Error deleting category", message: error.message});
    }
};
