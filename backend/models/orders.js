const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    products: [{
        name: String,
        quantity: Number,
        price: Number,
    }],
    totalQuantity: Number,
    totalPrice: Number,
    name: String,
    email: String,
    address: String,
    contactNumber: String,
    dateOfOrder: { type: Date, default: Date.now },
    paymentMethod: String
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
