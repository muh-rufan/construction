const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root', // change as needed
  database: 'construction_db',
  connectionLimit: 10
});

module.exports = pool.promise();
