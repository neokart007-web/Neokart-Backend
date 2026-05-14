"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContact = exports.markContactAsRead = exports.getContacts = exports.submitContactForm = void 0;
const Contact_1 = require("../models/Contact");
const asyncHandler_1 = require("../utils/asyncHandler");
const responseHandler_1 = require("../utils/responseHandler");
// @desc    Submit a contact form
// @route   POST /api/v1/contacts
// @access  Public
exports.submitContactForm = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
        return (0, responseHandler_1.errorResponse)(res, 400, 'Please provide name, email and message');
    }
    const contact = await Contact_1.Contact.create({
        name,
        email,
        phone,
        subject,
        message
    });
    (0, responseHandler_1.successResponse)(res, 201, 'Message sent successfully', contact);
});
// @desc    Get all contacts
// @route   GET /api/v1/contacts
// @access  Private/Admin
exports.getContacts = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const contacts = await Contact_1.Contact.find().sort({ createdAt: -1 });
    (0, responseHandler_1.successResponse)(res, 200, 'Contacts fetched successfully', contacts);
});
// @desc    Mark contact as read
// @route   PUT /api/v1/contacts/:id/read
// @access  Private/Admin
exports.markContactAsRead = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const contact = await Contact_1.Contact.findById(req.params.id);
    if (!contact) {
        return (0, responseHandler_1.errorResponse)(res, 404, 'Contact not found');
    }
    contact.isRead = true;
    await contact.save();
    (0, responseHandler_1.successResponse)(res, 200, 'Contact marked as read', contact);
});
// @desc    Delete contact
// @route   DELETE /api/v1/contacts/:id
// @access  Private/Admin
exports.deleteContact = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const contact = await Contact_1.Contact.findById(req.params.id);
    if (!contact) {
        return (0, responseHandler_1.errorResponse)(res, 404, 'Contact not found');
    }
    await contact.deleteOne();
    (0, responseHandler_1.successResponse)(res, 200, 'Contact deleted successfully', {});
});
//# sourceMappingURL=contactController.js.map