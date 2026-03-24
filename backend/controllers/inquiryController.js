const Inquiry = require('../models/Inquiry');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

// @desc    Create inquiry
// @route   POST /api/inquiries
// @access  Public
const createInquiry = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const inquiry = await Inquiry.create(req.body);

        // Send email notification to admin
        await sendInquiryNotification(inquiry);

        res.status(201).json({
            message: 'Inquiry submitted successfully',
            inquiry
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private/Admin
const getInquiries = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const query = {};

        if (status) query.status = status;

        const inquiries = await Inquiry.find(query)
            .populate('product', 'name')
            .populate('assignedTo', 'name email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Inquiry.countDocuments(query);

        res.json({
            inquiries,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single inquiry
// @route   GET /api/inquiries/:id
// @access  Private/Admin
const getInquiryById = async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id)
            .populate('product', 'name')
            .populate('assignedTo', 'name email')
            .populate('notes.addedBy', 'name');

        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        res.json(inquiry);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id
// @access  Private/Admin
const updateInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id);
        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        const updatedInquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedInquiry);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Add note to inquiry
// @route   POST /api/inquiries/:id/notes
// @access  Private/Admin
const addNote = async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id);
        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        inquiry.notes.push({
            content: req.body.content,
            addedBy: req.user._id
        });

        await inquiry.save();
        res.json(inquiry);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Email notification function
const sendInquiryNotification = async (inquiry) => {
    // Configure nodemailer
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.ADMIN_EMAIL,
        subject: 'New Inquiry Received - YDK Global Trade',
        html: `
            <h2>New Inquiry Details</h2>
            <p><strong>Name:</strong> ${inquiry.name}</p>
            <p><strong>Email:</strong> ${inquiry.email}</p>
            <p><strong>Phone:</strong> ${inquiry.phone || 'Not provided'}</p>
            <p><strong>Country:</strong> ${inquiry.country}</p>
            <p><strong>Product:</strong> ${inquiry.productName || 'Not specified'}</p>
            <p><strong>Message:</strong> ${inquiry.message}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Email sending failed:', error);
    }
};

module.exports = {
    createInquiry,
    getInquiries,
    getInquiryById,
    updateInquiry,
    addNote
};
