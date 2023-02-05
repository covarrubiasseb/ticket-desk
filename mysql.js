const mysql = require('mysql2');
const db = require('./db');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootpw'
});

connection.connect(err => {
  if (err) { throw err; }
  else {
    console.log('mySQL server connected');
  }
})
// Create Database and Tables (if not exists)
connection.query(db.queries.createDB);
connection.query(db.queries.useDB);
connection.query(db.queries.createTableUsers);
connection.query(db.queries.createTableProjects);
connection.query(db.queries.createTableUsersProjects);
connection.query(db.queries.createTableTickets);
connection.query(db.queries.createTableUsersTickets);
connection.query(db.queries.createTableProjectsTickets);

module.exports = {  connection  }