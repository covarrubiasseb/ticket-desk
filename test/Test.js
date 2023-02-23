const fs = require('fs');
const bcrypt = require('bcrypt');
const mysql = require('../mysql');
const db = require('./DB_Test');

const saltRounds = 10;

const hasUsers = true;

// Insert Users

if (!hasUsers) {

  fs.readFile('./test/data/MOCK_DATA_USERS.json', 'utf-8', (err, stringified) => {
    if (err) { console.log(err); }
    else {
      let data = JSON.parse(stringified);
      data.forEach(user => {

        bcrypt.hash(user.password, saltRounds, (err, hash) => {

          mysql.connection.query(db.queries.createUser(user.firstName, user.lastName, user.email, hash), (err, results) => {
            console.log(`User Added: ${hash}`);
          });

        });

      });

      hasUsers = true;

    }
  });

}

