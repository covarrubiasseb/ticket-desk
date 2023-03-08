const express = require('express');
const process = require('process');
const { config } = require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require('../db');
const mysql = require('../mysql');
const bcrypt = require('bcrypt');

let router = express.Router();

const saltRounds = 10;

const jwt_secret_key = process.env.JWT_SECRET_KEY;

// LOGIN ////////////////////
router.post('/api/login', (req, res) => {
  let loginEmail = req.body.email;
  let passwordAttempt = req.body.password;

  // Check if email exists in DB
  mysql.connection.query(db.queries.findUser(loginEmail), (err, results) => {
    let user = results[0];
    // if email exists check password
    if (results && user) {

      let hash = results[0].hash;
      // if password is correct
      bcrypt.compare(passwordAttempt, hash, (err, result) => {

        if (result) {

          const token = jwt.sign(
            { userID: user.userID },
            jwt_secret_key,
            { expiresIn: '1h' }
          );

          res.status(200).json({
            success: true,
            userData: {
              name: {
                firstName: user.firstName,
                lastName: user.lastName
              },
              email: user.email,
              role: user.role,
              userID: user.userID,
              token: token
            }
          });

        } else {
          res.sendStatus(401);
        }

      });

    } else {
      res.sendStatus(404);
    }

  });

});

// REGISTER ////////////////////
router.post('/api/register', (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let registerEmail = req.body.email;
  let registerPassword = req.body.password;

  // Check if email exists in DB
  mysql.connection.query(db.queries.findUser(registerEmail), (err, results) => {
    // if email doesn't exist create new user
    if (!results || results.length === 0) {

      bcrypt.hash(registerPassword, saltRounds, (err, hash) => {

        // add new user to db
        mysql.connection.query(db.queries.createUser(firstName, lastName, registerEmail, hash), (err, results) => {
          if (err) {
            res.sendStatus(500);
          } else {

            // user successfully created in DB
            mysql.connection.query(db.queries.findUser(registerEmail), (err, results) => {
              let user = results[0];

              const token = jwt.sign(
                { userID: user.userID },
                jwt_secret_key,
                { expiresIn: '1h' }
              );

              res.status(200).json({
                success: true,
                userData: {
                  name: {
                    firstName: user.firstName,
                    lastName: user.lastName
                  },
                  email: user.email,
                  role: user.role,
                  userID: user.userID,
                  token: token
                }
              });

            });

            
          }

        });

      });

    } else {
      res.sendStatus(401);
    }

  });

});

// LOGOUT ////////////////////
router.get('/api/logout', (req, res) => {
  // Need to setup sessions/tokenization
  res.redirect('/');
});

module.exports = router;
