// Import Lib Package
const mongoose = require('mongoose');

// Create Garment Schema
const garmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    location: {
        type: String,
    },
    contact: {
        type: String,
        required: [true, 'Contact is required']
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ]
});

// Export Garment Schema
const Garment = mongoose.model('Garment', garmentSchema);
module.exports = Garment;