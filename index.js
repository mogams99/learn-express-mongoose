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

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(err => next(err));
    }
}

// Routing
app.get('/', (req, res) => {
    res.send(`Hello World!`);
});
app.get('/products', wrapAsync(async (req, res, next) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category });
        res.render('products/index', { products, category });
    } else {
        const products = await Product.find({});
        res.render('products/index', { products, category: 'All' });
    }
}));
app.get('/products/create', (req, res) => {
    res.render('products/create');
});
app.post('/products', wrapAsync(async (req, res) => {
    const request = req.body;
    const product = new Product(req.body);
    await product.save();
    res.redirect('/products');
}));
app.get('/products/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/show', { product });
}));
app.get('/products/:id/edit', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product });
}));
app.put('/products/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true });
    res.redirect('/products');
}));
app.delete('/products/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    res.redirect('/products');
}));
const validatorHandler = err => {
    err.status = 400;
    err.message = Object.values(err.errors).map(item => item.message);
    return new ErrorHandler(err.message, err.status);
}
// Mapping Error Message
app.use((err, req, res, next) => {
    console.dir(err);
    if (err.name === 'ValidationError') err = validatorHandler(err);
    if (err.name === 'CastError') {
        err.status = 404;
        err.message = 'Data product not found.';
    }
    next(err);
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