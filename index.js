const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/shop-db').then(res => {
    console.log('MongoDB is connected');
}).catch(err => {
    console.log(err);
})

app.set('view', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routing
app.get('/', (req, res) => {
    res.send(`Hello World!`);
});

app.listen(3000, () => {
    console.log('Shop App listening on http://localhost:3000');
})