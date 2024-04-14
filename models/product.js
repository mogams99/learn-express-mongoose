// Import Lib Package
const mongoose = require('mongoose');

// Create Product Schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    size: {
        type: [String],
        required: true
    },
});

// Export Product Schema
const Product = mongoose.model('Product', productSchema);
module.exports = Product;