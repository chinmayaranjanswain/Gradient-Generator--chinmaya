const express = require('express');
const router = express.Router();

// Basic routes for now
router.post('/register', (req, res) => {
    res.json({ message: 'Register endpoint' });
});

router.post('/login', (req, res) => {
    res.json({ message: 'Login endpoint' });
});

router.get('/me', (req, res) => {
    res.json({ message: 'Get user profile endpoint' });
});

module.exports = router; 