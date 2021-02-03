const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();
const { env } = process;

///database connection
const connection = mysql.createConnection({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  multipleStatements: true,
});

module.exports = connection;
