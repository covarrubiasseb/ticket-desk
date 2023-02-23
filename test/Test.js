const fs = require('fs');
const bcrypt = require('bcrypt');
const mysql = require('../mysql');
const db = require('./db_test');
const process = require('process');
const { config } = require('dotenv').config();

const saltRounds = 10;

// Insert Users
if (process.env.DB_TEST_HAS_USERS === 'false') {

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

    }
  });

}

if (process.env.DB_TEST_HAS_PROJECTS === 'false') {
  
  fs.readFile('./test/data/MOCK_DATA_PROJECTS.json', 'utf-8', (err, stringified) => {
    if (err) { console.log(err); }
    else {
      let data = JSON.parse(stringified);
      data.forEach(project => {

        mysql.connection.query(db.queries.createProject(project.name, project.description), (err, results) => {
          console.log(`Project Added: ${project.name}`);
        });

      });

    }
  });

}