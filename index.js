const express = require('express');
const process = require('process');
const { config } = require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require('./db');
const mysql = require('./mysql');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());

const saltRounds = 10;
const port = process.env.PORT;
const jwt_secret_key = process.env.JWT_SECRET_KEY;

app.use(express.static(`${__dirname}/ticket-desk/build`));

// LOGIN ////////////////////
app.post('/api/login', (req, res) => {
  let loginEmail = req.body.email;
  let passwordAttempt = req.body.password;

  // Check if email exists in DB
  mysql.connection.query(db.queries.findUser(loginEmail), (err, results) => {
    let user = results[0];
    // if email exists check password
    if (user) {

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
app.post('/api/register', (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let registerEmail = req.body.email;
  let registerPassword = req.body.password;

  // Check if email exists in DB
  mysql.connection.query(db.queries.findUser(registerEmail), (err, results) => {

    // if email doesn't exist create new user
    if (results.length === 0) {

      bcrypt.hash(registerPassword, saltRounds, (err, hash) => {

        // add new user to db
        mysql.connection.query(db.queries.createUser(firstName, lastName, registerEmail, hash), (err, results) => {
          if (err) {
            res.sendStatus(500);
          } else {
            console.log(results);

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
app.get('/api/logout', (req, res) => {
  // Need to setup sessions/tokenization
  res.redirect('/');
});

// GET TICKET CREATOR/ASSIGNED DEV ////////////////////
app.get('/api/ticket/dev', (req, res) => {
  const token = req.headers['jwt-token'];

  if (token) {
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
      if (err) {
        res.send(401);
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
  }

});

// GET TICKET PROJECT ////////////////////
app.get('/api/project', (req, res) => {
  const token = req.headers['jwt-token'];

  if (token) {
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
      } else {
        if (decoded) {

          console.log('Token Validated! - GET /api/project');

          mysql.connection.query(db.queries.findProject(req.query.projectID), (err, results) => {
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
  }

});

// UPDATE PROJECT ////////////////////
app.post('/api/project', (req, res) => {
  const token = req.headers['jwt-token'];
  // mysql.connection.query(db.queries.findProject)
});

// GET USER PROJECTS ////////////////////
app.get('/api/projects', (req, res) => {
  const token = req.headers['jwt-token'];

  if (token) {
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
      } else {
        if (decoded) {

          console.log('Token Validated! - GET /api/projects');

          mysql.connection.query(db.queries.findProjects(req.query.userID), (err, results) => {
            res.status(200).send(results);
          });

        } else {
          res.sendStatus(401);
        }
      }
    });
  }

});

// CREATE NEW PROJECT ////////////////////
app.post('/api/projects', (req, res) => {
  const token = req.headers['jwt-token'];

  let email = req.body.userEmail;
  let projectName = req.body.projectName;
  let projectDesc = req.body.projectDesc;

  if (token) {
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
      } else {
        if (decoded) {

          console.log('Token Validated! - POST /api/projects');

          // Check if User is Admin, Get UserID
          mysql.connection.query(db.queries.findUser(email), (err, results) => {
            let userResults = results[0];

            if (userResults.role === 'Admin') {
              // Create Project
              mysql.connection.query(db.queries.createProject(projectName, projectDesc), (err, results) => {
                if (err) {
                  res.send({valid : false});
                }
                else {
                  let projectID = results.insertId;
                  // Get ProjectID
                  mysql.connection.query(db.queries.findProject(projectID), (err, results) => {
                    if (err) {
                      res.send({valid : false});
                    } else {
                      let projectResults = results[0];
                      // Add Admin to UsersProjects Table
                      mysql.connection.query(db.queries.addUserToProject(userResults.userID, projectResults.projectID), (err, results) => {
                        if (err) {
                          res.send({valid : false});
                        } else {
                          res.send({valid : true});
                        }
                      });
                    }
                  });
                }
              });

            } else {
              // Cannot Create Project
              res.send({valid : false});
            }
          });

        } else {
          res.sendStatus(401);
        }
      }
    });
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
  }

});

// UPDATE PROJECT USERS ////////////////////
app.post('/api/project/users', (req, res) => {
  const token = req.headers['jwt-token'];

  let projectID = '';
  let userID = '';

  mysql.connection.query(db.queries.addUserToProject(userID, projectID), (err), (err, results) => {
    res.end();
  });
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
  }  

});

// EDIT TICKET COMMENT ////////////////////
app.post('/api/ticket/comments', (req, res) => {
  const token = req.headers['jwt-token'];

  let userID = req.query.userID;
  let commentID = req.body.commentID;
  let data = { content: req.body.content };

  mysql.connection.query(db.queries.findCommentById(commentID), (err, results) => {
    if (err) {
      throw err;
      res.send({valid: false});
    } else {
      let comment = results[0];

      if (userID === comment.userID.toString()) {
        // Validated as user submitted comment
        mysql.connection.query(db.queries.updateComment(commentID, data), (err, results) => {
          if (err) {
            throw err;
            res.send({valid: false});
          } else {
            res.send({valid: true});
          }
        });

      }

    }

  });

});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
