// Import Lib Package
const mongoose = require('mongoose');

// Create Product Schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    brand: {
        type: String,
        required: [true, 'Brand is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    color: {
        type: String,
        required: [true, 'Color is required']
    },
    category: {
        type: String,
        enum: ['Baju', 'Celana', 'Jaket', 'Aksesoris'],
        required: [true, 'Category is required']
    },
});

// Export Product Schema
const Product = mongoose.model('Product', productSchema);
module.exports = Product;