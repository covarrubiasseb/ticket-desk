const express = require('express');
const process = require('process');
const { config } = require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require('../db');
const mysql = require('../mysql');
const bcrypt = require('bcrypt');

let router = express.Router();

const jwt_secret_key = process.env.JWT_SECRET_KEY;

// GET TICKET COMMENTS ////////////////////
router.get('/api/ticket/comments', (req, res) => {
  const token = req.headers['jwt-token'];

  let ticketID = req.query.ticketID;

  if (token) {
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
      } else {
        if (decoded) {

          console.log('Token Validated! - GET /api/ticket/comments');

          mysql.connection.query(db.queries.findComments(ticketID), (err, results) => {
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

// GET TICKET COMMENT USER ////////////////////
router.get('/api/ticket/comment/user', (req, res) => {
  const token = req.headers['jwt-token'];

  let userID = req.query.userID;

  if (token) {
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
      } else {
        if (decoded) {

          console.log('Token Validated! - GET /api/ticket/comment/user');

          mysql.connection.query(db.queries.findUserById(userID), (err, results) => {
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

// CREATE TICKET COMMENT ////////////////////
router.put('/api/ticket/comments', (req, res) => {
  const token = req.headers['jwt-token'];

  let data = req.body;

  if (token) {
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
      } else {
        if (decoded) {

          console.log('Token Validated! - PUT /api/ticket/comments');

          mysql.connection.query(db.queries.createComment(data), (err, results) => {
            if (err) {
              res.send({valid: false});
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

// EDIT TICKET COMMENT ////////////////////
router.post('/api/ticket/comments', (req, res) => {
  const token = req.headers['jwt-token'];

  let userID = req.query.userID;
  let commentUserID = req.body.comment.userID;
  let commentID = req.body.comment.commentID;
  let data = { content: req.body.content };

  if (token) {
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
      } else {
        if (decoded) {

          console.log('Token Validated! - POST /api/ticket/comments');

          mysql.connection.query(db.queries.findUserById(userID), (err, results) => {
            if (err) {
              res.sendStatus(401);
            } else {
              let user = results[0];

              if ( (userID === commentUserID.toString()) || user.role === 'Admin') {
                // Validated as user submitted comment
                mysql.connection.query(db.queries.updateComment(commentID, data), (err, results) => {
                  if (err) {
                    res.send({valid: false});
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
      }
    });
  } 

});

// DELETE TICKET COMMENT ////////////////////
router.delete('/api/ticket/comments', (req, res) => {
  const token = req.headers['jwt-token'];

  let userID = req.query.userID;
  let commentID = req.query.commentID;

  if (token) {
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
      } else {
        if (decoded) {

          console.log('Token Validated! - DELETE /api/ticket/comments');

          mysql.connection.query(db.queries.findUserById(userID), (err, results) => {
            if (err) {
              res.sendStatus(401);
            } else {
              let user = results[0];

              mysql.connection.query(db.queries.findCommentById(commentID), (err, results) => {
                if (err) {
                  res.status(404).send({valid: false});
                } else {
                  let comment = results[0];

                  if ( (userID === comment.userID.toString()) || (user.role === 'Admin') ) {

                    mysql.connection.query(db.queries.removeCommentById(commentID), (err, results) => {
                      if (err) {
                        res.status(404).send({valid: false});
                      } else {
                        res.status(200).send({valid: true});
                      }
                    });

                  }
                }

              });


            }
          });



        } else {
          res.sendStatus(401);
        }
      }
    });
  } 

});

module.exports = router;