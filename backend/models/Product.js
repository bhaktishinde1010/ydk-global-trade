const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Agricultural', 'Organic', 'Herbal']
    },
    subCategory: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    specifications: [{
        title: String,
        value: String
    }],
    images: [{
        url: String,
        alt: String,
        isPrimary: Boolean
    }],
    price: {
        type: Number,
        min: 0
    },
    unit: {
        type: String,
        enum: ['KG', 'TON', 'MT', 'BAG', 'BOX'],
        default: 'KG'
    },
    minOrderQuantity: {
        type: Number,
        default: 1
    },
    availability: {
        type: String,
        enum: ['In Stock', 'Pre-Order', 'Out of Stock'],
        default: 'In Stock'
    },
    packagingOptions: [{
        type: String
    }],
    certifications: [{
        type: String
    }],
    origin: {
        type: String,
        default: 'India'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    metaTitle: String,
    metaDescription: String,
    slug: {
        type: String,
        unique: true,
        required: true
    }
}, {
    timestamps: true
});

// Create index for search
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);