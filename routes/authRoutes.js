const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

router.get('/login', AuthController.showLogin);
router.post('/login', AuthController.login);

router.get('/register', AuthController.showRegister);
router.post('/register', AuthController.register);

router.get('/logout', AuthController.logout);

router.get('/admin/login', AuthController.showAdminLogin);
router.post('/admin/login', AuthController.adminLogin);
router.get('/admin/logout', AuthController.adminLogout);

// Email verification routes
router.get('/auth/verify-email/:token', AuthController.verifyEmail);
router.post('/auth/resend-verification', AuthController.resendVerification);

module.exports = router;
