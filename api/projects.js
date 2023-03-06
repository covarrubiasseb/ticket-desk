const express = require('express');
const process = require('process');
const { config } = require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require('../db');
const mysql = require('../mysql');
const bcrypt = require('bcrypt');

let router = express.Router();

const jwt_secret_key = process.env.JWT_SECRET_KEY;

async function getProjectsAuthor(projects, resolve) {

  let data = [];

  for (const project of projects) {

    let user = await mysql.connection.promise().query(db.queries.findUserById(project.userID))
    .then(rows => {
      return rows[0];
    });

    data.push(user);

  }

  resolve(data);

}

// GET TICKET PROJECT ////////////////////
router.get('/api/project', (req, res) => {
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
  } else {
    res.sendStatus(401);
  }

});

// GET USER PROJECTS ////////////////////
router.get('/api/projects', (req, res) => {
  const token = req.headers['jwt-token'];

  let userID = req.query.userID;

  if (token) {
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
      } else {
        if (decoded) {

          console.log('Token Validated! - GET /api/projects');

          mysql.connection.query(db.queries.findProjects(userID), (err, results) => {
            if (err) {
              res.sendStatus(404);
            } else {

              getProjectsAuthor(results, data => {

                let newData = results.map((project, index) => {
                  return {
                    project,
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

// CREATE NEW PROJECT ////////////////////
router.put('/api/projects', (req, res) => {
  const token = req.headers['jwt-token'];

  let userID = req.query.userID;
  let email = req.body.userEmail;
  let projectName = req.body.projectName;
  let projectDesc = req.body.projectDesc;

  if (token) {
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
      } else {
        if (decoded) {

          console.log('Token Validated! - PUT /api/projects');

          // Check if User is Admin, Get UserID
          mysql.connection.query(db.queries.findUser(email), (err, results) => {
            let userResults = results[0];

            if (userResults.role === 'Admin') {
              // Create Project
              mysql.connection.query(db.queries.createProject(projectName, projectDesc, userID), (err, results) => {
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
  } else {
    res.sendStatus(401);
  }

});

// UPDATE PROJECT ////////////////////
router.post('/api/projects', (req, res) => {
  const token = req.headers['jwt-token'];

  let userID = req.query.userID;
  let projectID = req.query.projectID;
  let projectData = req.body;

  if (token) {
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
      } else {
        if (decoded) {

          console.log('Token Validated! - POST /api/projects');

          mysql.connection.query(db.queries.findUserById(userID), (err, results) => {
            if (err) {
              res.sendStatus(401);
            } else {
              let user = results[0];

              if (user.role === 'Admin') {

                mysql.connection.query(db.queries.updateProject(projectID, projectData), (err, results) => {
                  if (err) {
                    res.sendStatus(401);
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
  } else {
    res.sendStatus(401);
  }

});

// DELETE PROJECT ////////////////////
router.delete('/api/projects', (req, res) => {
  const token = req.headers['jwt-token'];

  let userID = req.query.userID;
  let projectID = req.query.projectID;

  if (token) {
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
      } else {
        if (decoded) {

          console.log('Token Validated! - DELETE /api/projects');

          mysql.connection.query(db.queries.findUserById(userID), (err, results) => {
            if (err) {
              res.sendStatus(401);
            } else {

              let user = results[0];

              if (user.role === 'Admin') {

                // Begin deletion

                res.sendStatus(200);


              } else {
                res.status(401).send({valid: false});
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