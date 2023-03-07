const fs = require('fs');
const bcrypt = require('bcrypt');
const mysql = require('../mysql');
const db = require('./DB_Test');
const process = require('process');
const { config } = require('dotenv').config();

const saltRounds = 10;

// Insert Users
async function createUsers(users) {

  for (const user of users) {

    await bcrypt.hash(user.password, saltRounds, (err, hash) => {

      mysql.connection.promise().query(db.queries.createUser(user.firstName, user.lastName, user.email, hash))
      .then(() => console.log(`User Added: ${hash}`));

    });

  }

}

function PopulateData() {

  if (process.env.DB_TEST_HAS_USERS === 'false') {

    fs.readFile('./test/data/MOCK_DATA_USERS.json', 'utf-8', (err, stringified) => {
      if (err) { console.log(err); }
      else {
        let data = JSON.parse(stringified);
        
        createUsers(data);

      }
    });

  }

  if (process.env.DB_TEST_HAS_PROJECTS === 'false') {
    
    fs.readFile('./test/data/MOCK_DATA_PROJECTS.json', 'utf-8', (err, stringified) => {
      if (err) { console.log(err); }
      else {
        let data = JSON.parse(stringified);

        createProjects(data);

      }
    });

  }

}



// Insert Projects
async function createProjects(projects) {

  let userID = 1;

  for (const project of projects) {

    let resultID = ( (userID % 10) || (10) );

    userID++;

    await mysql.connection.promise().query(db.queries.createProject(project.name, project.description, resultID))
          .then( () => console.log(`Project Created: ${project.name}`));

  }

}

module.exports = PopulateData;