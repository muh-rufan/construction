const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/contactController');
const { isAdmin } = require('../middleware/authMiddleware');

router.get('/contact', ContactController.showContact);
router.post('/contact', ContactController.submitContact);

// Admin view messages
router.get('/admin/messages', isAdmin, ContactController.listMessages);

module.exports = router;
