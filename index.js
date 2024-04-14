// Import Lib Package
const path = require('path');
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const app = express();

// Import Model
const Product = require('./models/product');

// Import Class
const ErrorHandler = require('./ErrorHandler');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/shop-db').then(res => {
    console.log('MongoDB is connected');
}).catch(err => {
    console.log(err);
})

// Config
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Routing
app.get('/', (req, res) => {
    res.send(`Hello World!`);
});
app.get('/products', async (req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category });
        res.render('products/index', { products, category });
    } else {
        const products = await Product.find({});
        res.render('products/index', { products, category: 'All' });
    }
});
app.get('/products/create', (req, res) => {
    res.render('products/create');
});
app.post('/products', async (req, res) => {
    const request = req.body;
    const product = new Product(req.body);
    await product.save();
    res.redirect('/products');
});
app.get('/products/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        res.render('products/show', { product });
    } catch (error) {
        next(new ErrorHandler('Product data not found.', 404));
    }
});
app.get('/products/:id/edit', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        res.render('products/edit', { product });
    } catch (error) {
        next(new ErrorHandler('Product data not found.', 404));
    }
});
app.put('/products/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true });
        res.redirect('/products');
    } catch (error) {
        next(new ErrorHandler('Product data cannot be updated.', 412));
    }
});
app.delete('/products/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        res.redirect('/products');
    } catch (error) {
        next(new ErrorHandler('Product data cannot be updated.', 412));
    }
});
// Middleware Error Handling
app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err;
    res.status(status).send(message);
});

// Connect to App
app.listen(3000, () => {
    console.log('Shop App listening on http://localhost:3000');
})