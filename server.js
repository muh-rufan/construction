require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const db = require('./config/db');
const { attachUser } = require('./middleware/authMiddleware');

const app = express();

// Test DB connection
db.getConnection()
  .then(conn => {
    console.log('Connected to MySQL database.');
    conn.release();
  })
  .catch(err => {
    console.error('MySQL connection error:', err);
  });

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));

// Session
app.use(
  session({
    secret: 'change_this_secret_key',
    resave: false,
    saveUninitialized: false
  })
);

// Attach user/admin + notification count to all views
app.use(attachUser);

// Routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const teamRoutes = require('./routes/teamRoutes');
const contactRoutes = require('./routes/contactRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use(authRoutes);
app.use(projectRoutes);
app.use(teamRoutes);
app.use(contactRoutes);
app.use(notificationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

