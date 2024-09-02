const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Create a new product
router.post('/', async (req, res) => {
    try {
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: req.body.image 
        });

        await product.save();
        res.status(201).send(product);
    } catch (error) {
        res.status(400).send({ error: 'Failed to create product' });
    }
});

// Retrieve a list of all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send({ error: 'Failed to retrieve products' });
    }
});

// Retrieve details of a single product by ID
router.get('/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const product = await Product.findById(_id);
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }
        res.status(200).send(product);
    } catch (error) {
        res.status(500).send({ error: 'Failed to retrieve product' });
    }
});

// Update an existing product by ID
router.put('/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const product = await Product.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }
        res.status(200).send(product);
    } catch (error) {
        res.status(400).send({ error: 'Failed to update product' });
    }
});

// Delete a product by ID
router.delete('/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const product = await Product.findByIdAndDelete(_id);
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }
        res.status(200).send({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to delete product' });
    }
});

module.exports = router;
