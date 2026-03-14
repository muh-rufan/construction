const db = require('../config/db');

const Project = {
  async getAll() {
    const [rows] = await db.query(
      'SELECT * FROM projects ORDER BY created_at DESC'
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create(title, description, imagePath) {
    const [result] = await db.query(
      'INSERT INTO projects (title, description, image) VALUES (?, ?, ?)',
      [title, description, imagePath]
    );
    return result.insertId;
  },

  async update(id, title, description, imagePath) {
    if (imagePath) {
      await db.query(
        'UPDATE projects SET title = ?, description = ?, image = ? WHERE id = ?',
        [title, description, imagePath, id]
      );
    } else {
      await db.query(
        'UPDATE projects SET title = ?, description = ? WHERE id = ?',
        [title, description, id]
      );
    }
  },

  async delete(id) {
    await db.query('DELETE FROM projects WHERE id = ?', [id]);
  }
};

module.exports = Project;
