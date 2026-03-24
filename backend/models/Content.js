const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    page: {
        type: String,
        required: true,
        unique: true
    },
    sections: [{
        name: String,
        title: String,
        subtitle: String,
        description: String,
        image: String,
        buttonText: String,
        buttonLink: String,
        order: Number,
        isActive: Boolean,
        content: mongoose.Schema.Types.Mixed
    }],
    metaData: {
        title: String,
        description: String,
        keywords: [String]
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Content', contentSchema);
