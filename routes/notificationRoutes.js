const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/notifications', isAuthenticated, NotificationController.listUserNotifications);
router.post(
  '/notifications/mark-read/:id',
  isAuthenticated,
  NotificationController.markAsRead
);

module.exports = router;
