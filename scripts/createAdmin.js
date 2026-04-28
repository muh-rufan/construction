const bcrypt = require('bcrypt');
const db = require('../config/db');

async function createAdmin() {
  const [, , username, password] = process.argv;

  if (!username || !password) {
    console.error('Usage: npm run create-admin -- <username> <password>');
    process.exit(1);
  }

  try {
    const [existing] = await db.query('SELECT id FROM admins WHERE username = ?', [username]);
    if (existing.length > 0) {
      console.error('Admin username already exists.');
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO admins (username, password) VALUES (?, ?)', [username, hashedPassword]);

    console.log(`Admin user "${username}" created successfully.`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to create admin:', error.message);
    process.exit(1);
  }
}

createAdmin();
