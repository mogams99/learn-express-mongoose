// Import Lib Package
const mongoose = require('mongoose');

// Import Models 
const Product = require('./models/product');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/shop-db').then(res => {
    console.log('MongoDB is connected');
}).catch(err => {
    console.log(err);
})

const seedProducts = [
	{
		"name": "Kemeja Flanel",
		"brand": "Hollister",
		"price": 750000,
		"color": "biru muda",
		"size": ["S", "M", "L"],
	},
	{
		"name": "Celana Chino",
		"brand": "Levi's",
		"price": 900000,
		"color": "krem",
		"size": ["28", "30", "32", "34", "36"],
	},
	{
		"name": "Sweater",
		"brand": "Gap",
		"price": 650000,
		"color": "merah muda",
		"size": ["S", "M", "L"],
	},
	{
		"name": "Sepatu Sneakers",
		"brand": "Nike",
		"price": 1200000,
		"color": "putih",
		"size": ["38", "39", "40", "41", "42"],
	},
	{
		"name": "Tas Ransel",
		"brand": "Herschel",
		"price": 1500000,
		"color": "biru",
		"size": ["one size"],
	},
	{
		"name": "Kacamata Aviator",
		"brand": "Ray-Ban",
		"price": 2000000,
		"color": "emas",
		"size": ["one size"],
	},
	{
		"name": "Baju Renang",
		"brand": "Speedo",
		"price": 500000,
		"color": "biru tua",
		"size": ["XS", "S", "M", "L", "XL"],
	},
	{
		"name": "Topi Baseball",
		"brand": "New Era",
		"price": 350000,
		"color": "hitam",
		"size": ["one size"],
	},
	{
		"name": "Rompi",
		"brand": "Zara",
		"price": 850000,
		"color": "abu-abu",
		"size": ["S", "M", "L"],
	},
	{
		"name": "Jas",
		"brand": "Hugo Boss",
		"price": 4500000,
		"color": "hitam",
		"size": ["40R", "42R", "44R"],
	},
	{
		"name": "Sepatu Loafers",
		"brand": "Gucci",
		"price": 8000000,
		"color": "coklat",
		"size": ["40", "41", "42", "43", "44"],
	}
];

Product.insertMany(seedProducts).then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
});