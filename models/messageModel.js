const db = require('../config/db');

const Message = {
  async create(name, email, message) {
    const [result] = await db.query(
      'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );
    return result.insertId;
  },

  async getAll() {
    const [rows] = await db.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );
    return rows;
  }
};

module.exports = Message;
