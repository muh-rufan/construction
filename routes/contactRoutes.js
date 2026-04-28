const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/contactController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

router.get('/contact', isAuthenticated, ContactController.showContact);
router.post('/contact', isAuthenticated, ContactController.submitContact);

// Admin view messages
router.get('/admin/messages', isAdmin, ContactController.listMessages);

module.exports = router;
