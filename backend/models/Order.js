const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true,
        required: true
    },
    customer: {
        name: String,
        email: String,
        phone: String,
        company: String,
        country: String
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: Number,
        unitPrice: Number,
        totalPrice: Number
    }],
    shippingDetails: {
        address: String,
        city: String,
        country: String,
        port: String,
        terms: String
    },
    totalAmount: Number,
    currency: {
        type: String,
        default: 'USD'
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Partial', 'Paid', 'Refunded'],
        default: 'Pending'
    },
    documents: [{
        type: String,
        url: String
    }],
    notes: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);