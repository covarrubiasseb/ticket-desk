const express = require('express');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const db = require('./db');
const mysql = require('./mysql');
require('./passport');

const app = express();
const port = 5000;

const isLoggedIn = (req, res, next) => {

  req.user ? next() : res.redirect('/login')

};

app.use(session({
  secret: 'google-auth-session'
}));

app.use(passport.initialize());
app.use(passport.session());

// LOGIN ////////////////////
app.get('/login',
  passport.authenticate('google', {
          scope:
              ['email', 'profile']
      }
));

app.get('/login/callback',
  passport.authenticate('google'),
  (req, res) => {
    res.redirect('/');
  }
);


// LOGOUT ////////////////////
app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.use(isLoggedIn, express.static(`${__dirname}/ticket-desk/build`));

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
app.post('/api/project', bodyParser.json(), (req, res) => {
  mysql.connection.query(db.queries.findProject)
});

// GET USER PROJECTS ////////////////////
app.get('/api/projects', (req, res) => {
  mysql.connection.query(db.queries.findProjects(req.query.userID), (err, results) => {
    res.send(results);
  });
});

// GET PROJECTS ////////////////////
app.post('/api/projects', bodyParser.json(), (req, res) => {
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
app.put('/api/project/tickets', bodyParser.json(), (req, res) => {

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
app.post('/api/project/tickets', bodyParser.json(), (req, res) => {

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
app.put('/api/ticket/comments', bodyParser.json(), (req, res) => {
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
app.post('/api/ticket/comments', bodyParser.json(), (req, res) => {
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
