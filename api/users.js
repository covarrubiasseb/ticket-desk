const express = require('express');
const process = require('process');
const { config } = require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require('../db');
const mysql = require('../mysql');
const bcrypt = require('bcrypt');
const test = require('../test/test');

let router = express.Router();

const jwt_secret_key = process.env.JWT_SECRET_KEY;

// GET ALL USERS ////////////////////
router.get('/api/users', (req, res) => {
  const token = req.headers['jwt-token'];

  if (token) {
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
      } else {
        if (decoded) {

          console.log('Token Validated! - GET /api/users');

          mysql.connection.query(db.queries.getAllUsers(), (err, results) => {
            if (err) {
              res.sendStatus(401);
            } else {


              res.status(200).send({
                valid: true,
                results: results
              });

            }
          });

        } else {
          res.sendStatus(401);
        }
      }
    });
  } else {
    res.sendStatus(401);
  }

});

// UPDATE USER ROLE ////////////////////
router.post('/api/users', (req, res) => {
  const token = req.headers['jwt-token'];

  let userID = req.query.userID;
  let newRole = req.body.role;

  if (token) {
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
      } else {
        if (decoded) {

          console.log('Token Validated! - POST /api/users');
          
          mysql.connection.query(db.queries.updateUserRole(userID, newRole), (err, results) => {
            if (err) {
              res.status(401).send({valid: false});
            } else {
              res.status(200).send({valid: true});
            }
          });

        } else {
          res.sendStatus(401);
        }
      }
    });
  } else {
    res.sendStatus(401);
  }

});

module.exports = router;