  const db = require('../config/db');

  const Notification = {
    async create(title, message) {
      const [result] = await db.query(
        'INSERT INTO notifications (title, message) VALUES (?, ?)',
        [title, message]
      );
      return result.insertId;
    },

    async assignToAllUsers(notificationId) {
      const [users] = await db.query('SELECT id FROM users');
      if (users.length === 0) return;
      const values = users.map(u => [u.id, notificationId]);
      await db.query(
        'INSERT INTO user_notifications (user_id, notification_id) VALUES ?',
        [values]
      );
    },

    async getForUser(userId) {
      const [rows] = await db.query(
        `SELECT un.id AS user_notification_id, n.title, n.message, n.created_at, un.is_read
        FROM user_notifications un
        JOIN notifications n ON un.notification_id = n.id
        WHERE un.user_id = ?
        ORDER BY n.created_at DESC`,
        [userId]
      );
      return rows;
    },

    async markAsRead(userNotificationId, userId) {
      await db.query(
        'UPDATE user_notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
        [userNotificationId, userId]
      );
    }
  };

  module.exports = Notification;
