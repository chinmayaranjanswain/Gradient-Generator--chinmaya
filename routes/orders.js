const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Get all orders endpoint' });
});

router.post('/', (req, res) => {
    res.json({ message: 'Create order endpoint' });
});

router.get('/:id', (req, res) => {
    res.json({ message: 'Get single order endpoint' });
});

module.exports = router; 