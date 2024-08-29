const express = require('express');
const router = express.Router();
const Order = require('../models/orders'); // Import the Order model

// Create a new order
router.post('/', async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).send(order);
    } catch (error) {
        console.error('Error creating order:', error); // Log error for debugging
        res.status(400).send({ error: 'Failed to create order' });
    }
});

module.exports = router;
