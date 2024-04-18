// ? Import Lib Package
const path = require('path');
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();

// ? Import Model
const Product = require('./models/product');
const Garment = require('./models/garment');

// ? Import Class
const ErrorHandler = require('./ErrorHandler');

// ? Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/shop-db').then(res => {
    console.log('MongoDB is connected');
}).catch(err => {
    console.log(err);
})

// ! Config
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'lakadpatata',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash('flashMessages');
    next();
});

// ? Helper Try Catch
function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(err => next(err));
    }
}

// ? Root Route
app.get('/', (req, res) => {
    res.send(`Hello World!`);
});

// * Garment Route
app.get('/garments', wrapAsync(async (req, res, next) => {
    const garments = await Garment.find({});
    res.render('garments/index', { garments });
}));
app.get('/garments/create', (req, res) => {
    res.render('garments/create');
});
app.post('/garments', wrapAsync(async (req, res) => {
    const garment = new Garment(req.body);
    await garment.save();
    req.flash('flashMessages', 'Garment was successfully added.');
    res.redirect('/garments');
}));
app.get('/garments/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const garment = await Garment.findById(id).populate('products');
    res.render('garments/show', { garment });
}));
app.get('/garments/:garment_id/products/create', (req, res, next) => {
    const { garment_id } = req.params;
    res.render('products/create', { garment_id });
});
app.post('/garments/:garment_id/products', wrapAsync(async (req, res) => {
    const { garment_id } = req.params;
    const garment = await Garment.findById(garment_id);
    const product = new Product(req.body);
    garment.products.push(product);
    product.garment = garment;
    await garment.save();
    await product.save();
    res.redirect(`/garments/${garment_id}`);
}));
app.delete('/garments/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    await Garment.findOneAndDelete({ _id: id });
    res.redirect('/garments');
}));

// * Product Route
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
    const product = new Product(req.body);
    await product.save();
    res.redirect('/products');
}));
app.get('/products/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('garment');
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

// ! Mapping Error Message
app.use((err, req, res, next) => {
    console.dir(err);
    if (err.name === 'ValidationError') err = validatorHandler(err);
    if (err.name === 'CastError') {
        err.status = 404;
        err.message = 'Data product not found.';
    }
    next(err);
});
// ! Middleware Error Handling
app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err;
    res.status(status).send(message);
});

// ! Connect to App
app.listen(3000, () => {
    console.log('Shop App listening on http://localhost:3000');
})