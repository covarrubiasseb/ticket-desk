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

app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) { return next(err); }
    res.redirect('/');
  })
});

app.use(isLoggedIn, express.static(`${__dirname}/ticket-desk/build`));

app.get('/api/users', (req, res) => {
  let email = req.user.emails[0].value;

  mysql.connection.query(db.queries.findUser(email), (err, results) => {
    res.send({
      userID: results[0].userID,
      name: results[0].name,
      role: results[0].role
    });
  });
});

app.get('/api/projects', (req, res) => {
  mysql.connection.query(db.queries.findProjects(req.query.userID), (err, results) => {
    res.send(results);
  });
});

app.post('/api/projects', bodyParser.json(), (req, res) => {
  let email = req.user.emails[0].value;
  let projectName = req.body.projectName;
  let projectDesc = req.body.projectDesc;

  // Check if User is Admin
  mysql.connection.query(db.queries.findUser(email), (err, results) => {
    if (results[0].role === 'Admin') {

      mysql.connection.query(db.queries.createProject(projectName, projectDesc), (err, results) => {

        res.send({valid : true});

      });

    }
    res.send({valid : false});
  });

  // mysql.connection.query(db.queries.createProject(projectName, projectDesc), (err, results) => {
  //   res.end();
  // });
});

app.get('/api/project/users', (req, res) => {
  let projectID = '';

  mysql.connection.query(db.queries.findProjectUsers(projectID), (err, results) => {
    res.send(results);
  });
});

app.post('/api/project/users', (req, res) => {
  let projectID = '';
  let userID = '';

  mysql.connection.query(db.queries.addUserToProject(userID, projectID), (err), (err, results) => {
    res.end();
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
