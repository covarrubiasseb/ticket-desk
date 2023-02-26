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

async function getTicketsAuthor(tickets, resolve) {

  let data = [];

  for (const ticket of tickets) {

    let user = await mysql.connection.promise().query(db.queries.findUserById(ticket.userID))
    .then(rows => {
      return rows[0];
    });

    data.push(user);

  }

  resolve(data);

};

// GET TICKET CREATOR/ASSIGNED DEV ////////////////////
router.get('/api/ticket/dev', (req, res) => {
  const token = req.headers['jwt-token'];

  let userID = req.query.userID;

  if (token) {
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
      } else {
        if (decoded) {

          console.log('Token Validated! - GET /api/ticket/dev');

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

// GET TICKET BY ID (ONE) ////////////////////
router.get('/api/ticket', (req, res) => {
  const token = req.headers['jwt-token'];

  let ticketID = req.query.ticketID;

  if (token) {
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
      } else {
        if (decoded) {

          console.log('Token Validated! - GET /api/ticket');

          mysql.connection.query(db.queries.findTicketById(ticketID), (err, results) => {
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

// GET PROJECT TICKETS ////////////////////
router.get('/api/project/tickets', (req, res) => {
  const token = req.headers['jwt-token'];

  let projectID = req.query.projectID;

  if (token) {
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
      } else {
        if (decoded) {

          console.log('Token Validated! - GET /api/project/tickets');

          mysql.connection.query(db.queries.findProjectTickets(projectID), (err, results) => {
            if (err) {
              res.sendStatus(404);
            } else {

              getTicketsAuthor(results, data => {

                let newData = results.map((ticket, index) => {
                  return {
                    ticket,
                    user: data[index]
                  }
                });

                res.status(200).send(newData);

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

// GET USER TICKETS ////////////////////
router.get('/api/user/tickets', (req, res) => {
  const token = req.headers['jwt-token'];

  let userID = req.query.userID;

  if (token) {
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
      } else {
        if (decoded) {

          console.log('Token Validated! - GET /api/user/tickets');

          mysql.connection.query(db.queries.findUserTickets(userID), (err, results) => {
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

// CREATE PROJECT TICKET ////////////////////
router.put('/api/project/tickets', (req, res) => {
  const token = req.headers['jwt-token'];

  let data = {
    userID: req.body.userID,
    projectID: req.body.projectID,
    title: req.body.ticketTitle,
    status: req.body.ticketStatus,
    type: req.body.ticketType,
    description: req.body.ticketDesc,
    priority: req.body.ticketPriority
  }

  if (token) {
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
      } else {
        if (decoded) {

          console.log('Token Validated! - PUT /api/project/tickets');

          mysql.connection.query(db.queries.createTicket(data), (err, results) => {
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

// UPDATE PROJECT TICKET ////////////////////
router.post('/api/project/tickets', (req, res) => {
  const token = req.headers['jwt-token'];

  let ticketID = req.query.ticketID;
  let userID = req.query.userID;

  let data = {
    userID: req.body.userID,
    projectID: req.body.projectID,
    title: req.body.ticketTitle,
    status: req.body.ticketStatus,
    type: req.body.ticketType,
    description: req.body.ticketDesc,
    priority: req.body.ticketPriority
  }

  if (token) {
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
      } else {
        if (decoded) {

          console.log('Token Validated! - POST /api/project/tickets');

          mysql.connection.query(db.queries.findTicketById(ticketID), (err, results) => {
            if (err) {
              res.send({valid: false});
            } else {

              let ticket = results[0];

              if (userID === ticket.userID.toString()) {
                // Validated as user submitted ticket
                mysql.connection.query(db.queries.updateTicket(ticketID, data), (err, results) => {
                  if (err) {
                    res.send({valid: false});
                  } else {
                    res.status(200).send({valid: true});
                  }
                });

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

// DELETE PROJECT TICKET ////////////////////
router.delete('/api/project/tickets', (req, res) => {
  const token = req.headers['jwt-token'];

  let userID = req.query.userID;
  let ticketID = req.query.ticketID;

  if (token) {
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
      } else {
        if (decoded) {

          console.log('Token Validated! - DELETE /api/project/tickets');

          mysql.connection.query(db.queries.findUserById(userID), (err, results) => {
            if (err) {
              res.sendStatus(401);
            } else {

              mysql.connection.query(db.queries.findTicketById(ticketID), (err, results) => {
                if (err) {
                  res.sendStatus(401);
                } else {

                  let ticket = results[0];

                  if ( (userID === ticket.userID.toString()) || (user.role === 'Admin') ) {
                    // Validated as user submitted ticket
                    mysql.connection.query(db.queries.removeTicketById(ticketID).removeComments, (err, results) => {
                      if (err) {
                        res.sendStatus(401);
                      } else {

                        mysql.connection.query(db.queries.removeTicketById(ticketID).removeUsersTickets, (err, results) => {
                          if (err) {
                            res.sendStatus(401);
                          } else {

                            mysql.connection.query(db.queries.removeTicketById(ticketID).removeTicket, (err, results) => {
                              if (err) {
                                res.sendStatus(401);
                              } else {
                                res.status(200).send({valid: true});
                              }

                            });

                          }
                        });

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
  } else {
    res.sendStatus(401);
  }

});

module.exports = router;