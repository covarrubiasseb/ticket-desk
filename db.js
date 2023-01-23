const queries = {

  createDB: `CREATE DATABASE IF NOT EXISTS TicketDesk;`,

  useDB: `USE TicketDesk;`,

  createTableUsers: `CREATE TABLE IF NOT EXISTS users (
    userID int NOT NULL,
    name varchar(255) NOT NULL,
    role varchar(255),
    PRIMARY KEY (userID)
  );`,

  createTableProjects: `CREATE TABLE IF NOT EXISTS projects (
    projectID int NOT NULL,
    name varchar(255) NOT NULL,
    description varchar(255) NOT NULL,
    PRIMARY KEY (projectID)
  );`,

  createTableUsersProjects: `CREATE TABLE IF NOT EXISTS usersProjects (
    usersProjectsID int NOT NULL,
    userID int,
    projectID int,
    PRIMARY KEY (usersProjectsID),
    FOREIGN KEY (userID) REFERENCES users(userID),
    FOREIGN KEY (projectID) REFERENCES projects(projectID)
  );`,

  createTableTickets: `CREATE TABLE IF NOT EXISTS tickets (
    ticketID int NOT NULL,
    title varchar(255) NOT NULL,
    status varchar(255) NOT NULL,
    type varchar(255) NOT NULL,
    date varchar(255) NOT NULL,
    description varchar(255) NOT NULL,
    priority varchar(255) NOT NULL,
    PRIMARY KEY (ticketID)
  );`
}

module.exports = { queries }