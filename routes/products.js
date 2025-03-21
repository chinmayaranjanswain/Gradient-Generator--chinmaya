const express = require('express');
const router = express.Router();

// Sample products data (this would normally come from a database)
const products = [
    {
        id: 1,
        name: "Luxury Chronograph Watch",
        price: 299.99,
        description: "Elegant chronograph watch with leather strap",
        category: "Luxury"
    }
];

router.get('/', (req, res) => {
    res.json(products);
});

router.get('/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
});

module.exports = router; 