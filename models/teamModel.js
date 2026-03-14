const db = require('../config/db');

const Team = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM team');
    return rows;
  },

  async getById(id) {
    const [rows] = await db.query('SELECT * FROM team WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create(name, position, email, photoPath) {
    const [result] = await db.query(
      'INSERT INTO team (name, position, email, photo) VALUES (?, ?, ?, ?)',
      [name, position, email, photoPath]
    );
    return result.insertId;
  },

  async update(id, name, position, email, photoPath) {
    if (photoPath) {
      await db.query(
        'UPDATE team SET name = ?, position = ?, email = ?, photo = ? WHERE id = ?',
        [name, position, email, photoPath, id]
      );
    } else {
      await db.query(
        'UPDATE team SET name = ?, position = ?, email = ? WHERE id = ?',
        [name, position, email, id]
      );
    }
  },

  async delete(id) {
    await db.query('DELETE FROM team WHERE id = ?', [id]);
  }
};

module.exports = Team;
