const db = require('../config/db');

const User = {
  async create(name, email, hashedPassword, verificationToken, tokenExpiresAt) {
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, is_verified, verification_token, verification_token_expires) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, false, verificationToken, tokenExpiresAt]
    );
    return result.insertId;
  },

  async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async findByVerificationToken(token) {
    const [rows] = await db.query('SELECT * FROM users WHERE verification_token = ?', [token]);
    return rows[0] || null;
  },

  async markVerified(userId) {
    await db.query(
      'UPDATE users SET is_verified = ?, verification_token = NULL, verification_token_expires = NULL WHERE id = ?',
      [true, userId]
    );
  },

  async updateVerificationToken(userId, verificationToken, tokenExpiresAt) {
    await db.query(
      'UPDATE users SET verification_token = ?, verification_token_expires = ? WHERE id = ?',
      [verificationToken, tokenExpiresAt, userId]
    );
  },

  async getAll() {
    const [rows] = await db.query('SELECT * FROM users');
    return rows;
  }
};

module.exports = User;

