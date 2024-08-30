const express = require('express');
const router = express.Router();
const Order = require('../models/orders');

// Create a new order
router.post('/', async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).send(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(400).send({ error: 'Failed to create order' });
    }
});

// Get orders by user email
router.get('/user/:email', async (req, res) => {
    try {
        const orders = await Order.find({ email: req.params.email });
        res.status(200).send({ orders });
    } catch (error) {
        console.error('Error retrieving orders:', error);
        res.status(500).send({ error: 'Failed to retrieve orders' });
    }
});

// Get all orders (for admin)
router.get('/all', async (req, res) => {
    try {
        const orders = await Order.find(); // Retrieve all orders
        res.status(200).send({ orders });
    } catch (error) {
        console.error('Error retrieving all orders:', error);
        res.status(500).send({ error: 'Failed to retrieve all orders' });
    }
});


module.exports = router;
