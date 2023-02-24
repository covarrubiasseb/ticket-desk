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

// GET Project USERS ////////////////////
router.get('/api/project/users', (req, res) => {
  const token = req.headers['jwt-token'];

  let projectID = req.query.projectID;

  if (token) {
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
      } else {
        if (decoded) {

          console.log('Token Validated! - GET /api/project/users');

          mysql.connection.query(db.queries.findProjectUsers(projectID), (err, results) => {
            if (err) {
              res.sendStatus(404);
            } else {
              res.status(200).send(results);
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

// UPDATE (ADD) PROJECT USERS ////////////////////
router.post('/api/project/users', (req, res) => {
  const token = req.headers['jwt-token'];

  let userID = req.body.userID;
  let projectID = req.body.projectID;
  let projectUserID = req.body.projectUserID;


  if (token) {
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
      } else {
        if (decoded) {

          console.log('Token Validated! - POST /api/project/users');

          mysql.connection.query(db.queries.findUserById(userID), (err, results) => {
            if (err) {
              res.sendStatus(401);
            } else {

              let user = results[0];

              if (user.role === 'Admin') {

                mysql.connection.query(db.queries.findProjectUser(projectUserID, projectID), (err, results) => {
                  if (err) {
                    res.sendStatus(401);
                  } else {
                    
                    if (results.length === 0) {

                      mysql.connection.query(db.queries.addUserToProject(projectUserID, projectID), (err, results) => {
                        if (err) {
                          res.sendStatus(401);
                        } else {
                          res.status(200).send({valid: true});
                        }
                      });  

                    } else {
                      res.sendStatus(200);
                    }

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
      }
    });
  } else {
    res.sendStatus(401);
  }

});

// DELETE PROJECT USER ////////////////////
router.delete('/api/project/users', (req, res) => {
  const token = req.headers['jwt-token'];

  let projectID = req.query.projectID;
  let projectUserID = req.query.projectUserID;
  let userID = req.query.userID;

  if (token) {
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
      } else {
        if (decoded) {

          console.log('Token Validated! - DELETE /api/project/users');

          mysql.connection.query(db.queries.findUserById(userID), (err, results) => {
            if (err) {
              res.sendStatus(401);
            } else {

              let user = results[0];

              if (user.role === 'Admin') {

                mysql.connection.query(db.queries.findProjectUser(projectUserID, projectID), (err, results) => {
                  if (err) {
                    res.sendStatus(401);
                  } else {
                    
                    if (results.length === 1) {

                      mysql.connection.query(db.queries.removeUserFromProject(projectUserID, projectID), (err, results) => {
                        if (err) {
                          res.sendStatus(401);
                        } else {
                          res.status(200).send({valid: true});
                        }
                      });  

                    } else {
                      res.sendStatus(200);
                    }

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
      }
    });
  } else {
    res.sendStatus(401);
  }

});

module.exports = router;