const queries = {

  createDB: `CREATE DATABASE IF NOT EXISTS TicketDesk;`,

  useDB: `USE TicketDesk;`,

  createTableUsers: `CREATE TABLE IF NOT EXISTS users (
    userID int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    role varchar(255),
    PRIMARY KEY (userID)
  );`,

  createTableProjects: `CREATE TABLE IF NOT EXISTS projects (
    projectID int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    description varchar(255) NOT NULL,
    PRIMARY KEY (projectID)
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
    title varchar(255) NOT NULL,
    status varchar(255) NOT NULL,
    type varchar(255) NOT NULL,
    date varchar(255) NOT NULL,
    description varchar(255) NOT NULL,
    priority varchar(255) NOT NULL,
    PRIMARY KEY (ticketID)
  );`,

  findUser: function(userEmail) {
    return `SELECT * FROM users WHERE email='${userEmail}';`
  },

  createUser: function(userName, userEmail) {
    return `INSERT INTO users (name, email, role) VALUES ('${userName}','${userEmail}','Unassigned');`
  },

  createProject: function(projectName, projectDescription) {
    return `INSERT INTO projects (name, description) VALUES ('${projectName}','${projectDescription}');`
  },

  findProject: function(projectID) {
    return `SELECT * FROM projects where projectID='${projectID}'`
  },

  findProjects: function(userID) {
    return `SELECT projects.name, projects.description FROM projects 
      INNER JOIN (SELECT projectID FROM usersProjects WHERE userID='${userID}') AS userProjects 
        ON projects.projectID = userProjects.projectID;`
  },

  addUserToProject: function(userID, projectID) {
    return `INSERT INTO usersProjects (userID, projectID) VALUES ('${userID}','${projectID}');`
  },

  findProjectUsers: function(projectID) {
    return `SELECT user.name, user.email, user.role FROM users
      INNER JOIN (SELECT userID FROM usersProjects WHERE projectID='${projectID}') As projectUsers
        ON users.userID = projectUsers.userID;`
  }
}

module.exports = { queries }