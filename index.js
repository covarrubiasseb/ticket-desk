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
            data: {
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
                data: {
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
  // just redirect to Login for now
  res.redirect('/');
});

// GET USER DATA ////////////////////
app.get('/api/users', (req, res) => {
  let email = req.user.emails[0].value;

  mysql.connection.query(db.queries.findUser(email), (err, results) => {
    res.send({
      userID: results[0].userID,
      name: results[0].name
    });
  });
});

// GET TICKET CREATOR/ASSIGNED DEV ////////////////////
app.get('/api/ticket/dev', (req, res) => {

  mysql.connection.query(db.queries.findUserById(req.query.userID), (err, results) => {
    if (err) {
      throw err;
      res.end();
    } else {
      res.send(results);
    }
  });

});

// GET TICKET PROJECT ////////////////////
app.get('/api/project', (req, res) => {
  mysql.connection.query(db.queries.findProject(req.query.projectID), (err, results) => {
    if (err) {
      throw err;
      res.end();
    } else {
      res.send(results);
    }
  });
});

// UPDATE PROJECT ////////////////////
app.post('/api/project', (req, res) => {
  mysql.connection.query(db.queries.findProject)
});

// GET USER PROJECTS ////////////////////
app.get('/api/projects', (req, res) => {
  mysql.connection.query(db.queries.findProjects(req.query.userID), (err, results) => {
    res.send(results);
  });
});

// GET PROJECTS ////////////////////
app.post('/api/projects', (req, res) => {
  let email = req.user.emails[0].value;
  let projectName = req.body.projectName;
  let projectDesc = req.body.projectDesc;

  // Check if User is Admin, Get UserID
  mysql.connection.query(db.queries.findUser(email), (err, results) => {
    let userResults = results[0];

    if (results[0].role === 'Admin') {
      // Create Project
      mysql.connection.query(db.queries.createProject(projectName, projectDesc), (err, results) => {
        if (err) {
          res.send({valid : false});
          throw err; 
        }
        else {
          let projectID = results.insertId;
          // Get ProjectID
          mysql.connection.query(db.queries.findProject(projectID), (err, results) => {
            if (err) {
              res.send({valid : false});
              throw err;
            } else {
              let projectResults = results[0];
              // Add Admin to UsersProjects Table
              mysql.connection.query(db.queries.addUserToProject(userResults.userID, projectResults.projectID), (err, results) => {
                if (err) {
                  res.send({valid : false});
                  throw err;
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
});

// GET Project USERS ////////////////////
app.get('/api/project/users', (req, res) => {
  let projectID = req.query.projectID;

  mysql.connection.query(db.queries.findProjectUsers(projectID), (err, results) => {
    if (err) {
      throw err;
      res.end();
    } else {
      res.send(results);
    }
  });
});

// UPDATE PROJECT USERS ////////////////////
app.post('/api/project/users', (req, res) => {
  let projectID = '';
  let userID = '';

  mysql.connection.query(db.queries.addUserToProject(userID, projectID), (err), (err, results) => {
    res.end();
  });
});

// GET TICKET BY ID (ONE) ////////////////////
app.get('/api/ticket', (req, res) => {

  let ticketID = req.query.ticketID;

  mysql.connection.query(db.queries.findTicketById(ticketID), (err, results) => {
    if (err) {
      throw err;
      res.end();
    } else {
      res.send(results);
    }
  });

});

// GET PROJECT TICKETS ////////////////////
app.get('/api/project/tickets', (req, res) => {
  let projectID = req.query.projectID;

  mysql.connection.query(db.queries.findProjectTickets(projectID), (err, results) => {
    if (err) {
      throw err;
      res.end();
    } else {
      res.send(results);
    }
  });
});

// GET USER TICKETS ////////////////////
app.get('/api/user/tickets', (req, res) => {
  let userID = req.query.userID;

  mysql.connection.query(db.queries.findUserTickets(userID), (err, results) => {
    if (err) {
      throw err;
      res.end();
    } else {
      res.send(results);
    }
  });
});

// CREATE PROJECT TICKET ////////////////////
app.put('/api/project/tickets', (req, res) => {

  let data = {
    userID: req.body.userID,
    projectID: req.body.projectID,
    title: req.body.ticketTitle,
    status: req.body.ticketStatus,
    type: req.body.ticketType,
    description: req.body.ticketDesc,
    priority: req.body.ticketPriority
  }

  mysql.connection.query(db.queries.createTicket(data), (err, results) => {
    if (err) {
      throw err;
      res.send({valid: false});
    } else {
      res.send({valid: true});
    }
  });
});

// UPDATE PROJECT TICKET ////////////////////
app.post('/api/project/tickets', (req, res) => {

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

  mysql.connection.query(db.queries.findTicketById(ticketID), (err, results) => {
    if (err) {
      throw err;
      res.send({valid: false});
    } else {

      let ticket = results[0];

      if (userID === ticket.userID.toString()) {
        // Validated as user submitted ticket
        mysql.connection.query(db.queries.updateTicket(ticketID, data), (err, results) => {
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

// GET TICKET COMMENTS ////////////////////
app.get('/api/ticket/comments', (req, res) => {
  let ticketID = req.query.ticketID;

  mysql.connection.query(db.queries.findComments(ticketID), (err, results) => {
    if (err) {
      throw err;
      res.end();
    } else {
      res.send(results);
    }
  });

});

// CREATE TICKET COMMENT ////////////////////
app.put('/api/ticket/comments', (req, res) => {
  let data = req.body;

  mysql.connection.query(db.queries.createComment(data), (err, results) => {
    if (err) {
      throw err;
      res.send({valid: false});
    } else {
      res.send({valid: true});
    }
  });
});

// EDIT TICKET COMMENT ////////////////////
app.post('/api/ticket/comments', (req, res) => {
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
