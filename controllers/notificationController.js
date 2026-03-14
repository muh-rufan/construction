const Notification = require('../models/notificationModel');

const NotificationController = {
  async listUserNotifications(req, res) {
    try {
      const userId = req.session.user.id;
      const notifications = await Notification.getForUser(userId);
      res.render('user/notifications', { notifications });
    } catch (err) {
      console.error(err);
      res.render('user/notifications', { notifications: [] });
    }
  },

  async markAsRead(req, res) {
    try {
      const userId = req.session.user.id;
      const id = req.params.id;
      await Notification.markAsRead(id, userId);
      res.redirect('/notifications');
    } catch (err) {
      console.error(err);
      res.redirect('/notifications');
    }
  }
};

module.exports = NotificationController;
