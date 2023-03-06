const mysql = require('mysql2');
const db = require('./db');
const { config } = require('dotenv');

config();

const DB_Host = process.env.JAWSDB_HOST || process.env.DB_HOST;
const DB_User = process.env.JAWSDB_USER || process.env.DB_USER;
const DB_Pass = process.env.JAWSDB_PASS || process.env.DB_PASS;

const connection = mysql.createConnection({
  host: DB_Host,
  user: DB_User,
  password: DB_Pass,
  database: process.env.JAWSDB_DB || 'TicketDesk' 
});

connection.connect(err => {
  if (err) { throw err; }
  else {
    console.log('mySQL server connected');
  }
})
// Create Database and Tables (if not exists)
// connection.query(db.queries.createDB);
connection.query(db.queries.useDB);
connection.query(db.queries.createTableUsers);
connection.query(db.queries.createTableProjects);
connection.query(db.queries.createTableUsersProjects);
connection.query(db.queries.createTableTickets);
connection.query(db.queries.createTableComments);
connection.query(db.queries.createTableUsersTickets);
connection.query(db.queries.createTableProjectsTickets);

module.exports = {  connection  }