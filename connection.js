const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'employees_db',
},
console.log(`Connected to the employees_db.`)
);

module.exports = db;