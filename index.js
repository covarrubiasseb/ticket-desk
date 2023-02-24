const express = require('express');
const process = require('process');
const { config } = require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require('./db');
const mysql = require('./mysql');
const bcrypt = require('bcrypt');
const test = require('./test/test');

const userAuthRouter = require('./api/userAuth');
const usersRouter = require('./api/users');
const projectsRouter = require('./api/projects');

const app = express();

app.use(express.json());

const saltRounds = 10;
const port = process.env.PORT;
const jwt_secret_key = process.env.JWT_SECRET_KEY;

// Static Page
app.use(express.static(`${__dirname}/ticket-desk/build`));

// API Routes
app.use(userAuthRouter);
app.use(usersRouter);
app.use(projectsRouter);

// GET TICKET CREATOR/ASSIGNED DEV ////////////////////
app.get('/api/ticket/dev', (req, res) => {
  const token = req.headers['jwt-token'];

  if (token) {
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
      } else {
        if (decoded) {

          console.log('Token Validated! - GET /api/ticket/dev');

          mysql.connection.query(db.queries.findUserById(req.query.userID), (err, results) => {
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

// GET Project USERS ////////////////////
app.get('/api/project/users', (req, res) => {
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
app.post('/api/project/users', (req, res) => {
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
app.delete('/api/project/users', (req, res) => {
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

// GET TICKET BY ID (ONE) ////////////////////
app.get('/api/ticket', (req, res) => {
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
app.get('/api/project/tickets', (req, res) => {
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

// GET USER TICKETS ////////////////////
app.get('/api/user/tickets', (req, res) => {
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
app.put('/api/project/tickets', (req, res) => {
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
app.post('/api/project/tickets', (req, res) => {
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
app.delete('/api/project/tickets', (req, res) => {
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

// GET TICKET COMMENTS ////////////////////
app.get('/api/ticket/comments', (req, res) => {
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
app.get('/api/ticket/comment/user', (req, res) => {
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
app.put('/api/ticket/comments', (req, res) => {
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
app.post('/api/ticket/comments', (req, res) => {
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
app.delete('/api/ticket/comments', (req, res) => {
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

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
