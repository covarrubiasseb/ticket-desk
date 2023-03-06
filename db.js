const { config } = require('dotenv').config();

console.log(process.env.JAWSDB_DB)

const queries = {

  createDB: `CREATE DATABASE IF NOT EXISTS TicketDesk;`,

  useDB: `USE ${process.env.JAWSDB_DB};`,

  createTableUsers: `CREATE TABLE IF NOT EXISTS users (
    userID int NOT NULL AUTO_INCREMENT,
    firstName varchar(64) NOT NULL,
    lastName varchar(64) NOT NULL,
    email varchar(255) NOT NULL,
    role varchar(255),
    hash varchar(128) NOT NULL,
    PRIMARY KEY (userID)
  );`,

  createTableProjects: `CREATE TABLE IF NOT EXISTS projects (
    projectID int NOT NULL AUTO_INCREMENT,
    userID int,
    name varchar(255) NOT NULL,
    description varchar(1024) NOT NULL,
    submit_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (projectID),
    FOREIGN KEY (userID) REFERENCES users(userID)
  );`,

  createTableUsersProjects: `CREATE TABLE IF NOT EXISTS usersProjects (
    usersProjectsID int NOT NULL AUTO_INCREMENT,
    userID int,
    projectID int,
    PRIMARY KEY (usersProjectsID),
    FOREIGN KEY (userID) REFERENCES users(userID),
    FOREIGN KEY (projectID) REFERENCES projects(projectID)
  );`,

  createTableTickets: `CREATE TABLE IF NOT EXISTS tickets (
    ticketID int NOT NULL AUTO_INCREMENT,
    projectID int,
    userID int,
    title varchar(255) NOT NULL DEFAULT 'www',
    status varchar(255) NOT NULL DEFAULT 'www',
    type varchar(255) NOT NULL DEFAULT 'www',
    submit_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description varchar(255) NOT NULL DEFAULT 'www',
    priority varchar(255) NOT NULL DEFAULT 'www',
    PRIMARY KEY (ticketID),
    FOREIGN KEY (projectID) REFERENCES projects(projectID),
    FOREIGN KEY (userID) REFERENCES users(userID)
  );`,

  createTableComments: `CREATE TABLE IF NOT EXISTS comments (
    commentID int NOT NULL AUTO_INCREMENT,
    userID int,
    ticketID int,
    submit_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    content varchar(255) NOT NULL DEFAULT 'www',
    PRIMARY KEY (commentID),
    FOREIGN KEY (userID) REFERENCES users(userID),
    FOREIGN KEY (ticketID) REFERENCES tickets(ticketID)
  );`,

  createTableUsersTickets: `CREATE TABLE IF NOT EXISTS usersTickets (
    usersTicketsID int NOT NULL AUTO_INCREMENT,
    userID int,
    ticketID int,
    PRIMARY KEY (usersTicketsID),
    FOREIGN KEY (userID) REFERENCES users(userID),
    FOREIGN KEY (ticketID) REFERENCES tickets(ticketID)
  );`,

  createTableProjectsTickets: `CREATE TABLE IF NOT EXISTS projectsTickets (
    projectTicketsID int NOT NULL AUTO_INCREMENT,
    projectID int,
    ticketID int,
    PRIMARY KEY (projectTicketsID),
    FOREIGN KEY (projectID) REFERENCES projects(projectID),
    FOREIGN KEY (ticketID) REFERENCES tickets(ticketID)
  );`,

  findUser: function(userEmail) {
    return `SELECT * FROM users WHERE email="${userEmail}";`
  },

  findUserById: function(userID) {
    return `SELECT * FROM users WHERE userID="${userID}";`
  },

  getAllUsers: function() {
    return `SELECT userID, firstName, lastName, email, role FROM users;`
  },

  createUser: function(firstName, lastName, userEmail, hash) {
    return `INSERT INTO users (firstName, lastName, email, role, hash) VALUES ("${firstName}","${lastName}","${userEmail}","Unassigned","${hash}");`
  },

  updateUserRole: function(userID, newRole) {
    return `UPDATE users SET role="${newRole}" WHERE userID="${userID}";`
  },

  createProject: function(projectName, projectDescription, userID) {
    return `INSERT INTO projects (name, description, userID) VALUES ("${projectName}","${projectDescription}", "${userID}");`
  },

  updateProject: function(projectID, data) {
    return `UPDATE projects SET name="${data.name}", description="${data.description}" WHERE projectID="${projectID}";`
  },
 
  findProject: function(projectID) {
    return `SELECT * FROM projects where projectID="${projectID}";`
  },

  findProjects: function(userID) {
    return `SELECT projects.projectID, projects.userID, projects.name, projects.description, projects.submit_date FROM projects 
      INNER JOIN (SELECT projectID FROM usersProjects WHERE userID="${userID}") AS userProjects 
        ON projects.projectID = userProjects.projectID;`
  },

  addUserToProject: function(userID, projectID) {
    return `INSERT INTO usersProjects (userID, projectID) VALUES ("${userID}","${projectID}");`
  },

  removeUserFromProject: function(userID, projectID) {
    return `DELETE FROM usersProjects WHERE userID="${userID}" AND projectID="${projectID}";`
  },

  findProjectUser: function(userID, projectID) {
    return `SELECT * FROM usersProjects WHERE userID="${userID}" AND projectID="${projectID}";`
  },

  findProjectUsers: function(projectID) {
    return `SELECT users.userID, users.firstName, users.lastName, users.email, users.role FROM users
      INNER JOIN (SELECT userID FROM usersProjects WHERE projectID="${projectID}") As projectUsers
        ON users.userID = projectUsers.userID;`
  },

  createTicket: function(data) {
    return `INSERT INTO tickets (projectID, userID, title, status, type, description, priority) 
      VALUES ("${data.projectID}","${data.userID}","${data.title}","${data.status}","${data.type}","${data.description}","${data.priority}");`
  },

  updateTicket: function(ticketID, data) {
    return `UPDATE tickets 
              SET projectID="${data.projectID}", userID="${data.userID}", title="${data.title}", status="${data.status}", type="${data.type}",
              description="${data.description}", priority="${data.priority}" WHERE ticketID="${ticketID}";`
  },

  removeTicketById: function(ticketID) {
    return {
            removeComments: `DELETE FROM comments WHERE ticketID="${ticketID}";`,
            removeUsersTickets: `DELETE FROM usersTickets WHERE ticketID="${ticketID}";`,
            removeTicket: `DELETE FROM tickets WHERE ticketID="${ticketID}";`
          }
  },

  findTicketById: function(ticketID) {
    return `SELECT * FROM tickets WHERE ticketID="${ticketID}";`
  },

  findProjectTickets: function(projectID) {
    return `SELECT * FROM tickets WHERE projectID="${projectID}";`
  },

  findUserTickets: function(userID) {
    return `SELECT * FROM tickets WHERE userID="${userID}";`;
  },

  createComment: function(data) {
    return `INSERT INTO comments (userID, ticketID, content)
      VALUES ("${data.userID}", "${data.ticketID}", "${data.content}");`
  },

  findComments: function (ticketID) {
    return `SELECT * FROM comments WHERE ticketID="${ticketID}";`
  },

  findCommentById: function(commentID) {
    return `SELECT * FROM comments WHERE commentID="${commentID}";`
  },

  updateComment: function(commentID, data) {
    return `UPDATE comments SET content="${data.content}" WHERE commentID="${commentID}";`
  },

  removeCommentById: function (commentID) {
    return `DELETE FROM comments WHERE commentID="${commentID}";`
  }
}

module.exports = { queries }