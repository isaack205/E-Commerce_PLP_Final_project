// Import mongoose
const mongoose = require('mongoose');

// Category model
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, maxlength: 200 },
    slug: { type: String, unique: true },
}, 
{ timestamps: true } // Info such as created at
);

// Generate slug automaticly from name before saving
categorySchema.pre('save', function(next) {
    if(!this.isModified('name')) return next;
    this.slug = this.name
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
    next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category; // Export model