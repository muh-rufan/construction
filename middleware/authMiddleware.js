const db = require('../config/db');

function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect('/login');
}

function isAdmin(req, res, next) {
  if (req.session && req.session.admin) {
    return next();
  }
  return res.redirect('/admin/login');
}

// Attach current user/admin and notification count to views
async function attachUser(req, res, next) {
  res.locals.currentUser = req.session.user || null;
  res.locals.adminUser = req.session.admin || null;
  res.locals.notificationCount = 0;

  if (req.session.user) {
    try {
      const [rows] = await db.query(
        'SELECT COUNT(*) AS cnt FROM user_notifications WHERE user_id = ? AND is_read = 0',
        [req.session.user.id]
      );
      res.locals.notificationCount = rows[0].cnt || 0;
    } catch (err) {
      console.error('Error loading notification count:', err);
    }
  }

  next();
}

module.exports = {
  isAuthenticated,
  isAdmin,
  attachUser
};
