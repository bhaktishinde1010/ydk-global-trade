const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    productName: String,
    quantity: {
        type: String
    },
    message: {
        type: String,
        required: true
    },
    shippingTerms: {
        type: String,
        enum: ['FOB', 'CIF', 'CNF', 'EXW']
    },
    destinationPort: String,
    status: {
        type: String,
        enum: ['New', 'In Progress', 'Quoted', 'Converted', 'Closed'],
        default: 'New'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: [{
        content: String,
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Inquiry', inquirySchema);