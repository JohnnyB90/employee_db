const mysql = require('mysql2/promise');
// This is used to load environment variables from a .env file 
require('dotenv').config();

// This is a connection to local server setup with the variables data being tucked away in a .env file.
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
},
console.log(`Connected to the employees_db.`)
);

module.exports = db;