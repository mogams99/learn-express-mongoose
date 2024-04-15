// Import Lib Package
const mongoose = require('mongoose');
const Product = require('./product');

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

garmentSchema.post('findOneAndDelete', async function (garment) {
    if (garment.products.length) {
        const res = await Product.deleteMany({ _id: {$in: garment.products} })
        console.log(res);
    }
});

// Export Garment Schema
const Garment = mongoose.model('Garment', garmentSchema);
module.exports = Garment;