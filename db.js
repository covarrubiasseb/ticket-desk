const queries = {

  createDB: `CREATE DATABASE IF NOT EXISTS TicketDesk;`,

  useDB: `USE TicketDesk;`,

  createTableUsers: `CREATE TABLE IF NOT EXISTS users (
    ID int NOT NULL,
    name varchar(255) NOT NULL,
    role varchar(255),
    PRIMARY KEY (ID)
  );`,

  createTableProjects: `CREATE TABLE IF NOT EXISTS projects (
    ID int NOT NULL,
    name varchar(255) NOT NULL,
    description varchar(255) NOT NULL,
    PRIMARY KEY (ID)
  );`,

  createTableTickets: `CREATE TABLE IF NOT EXISTS tickets (
    ID int NOT NULL,
    title varchar(255) NOT NULL,
    status varchar(255) NOT NULL,
    type varchar(255) NOT NULL,
    date varchar(255) NOT NULL,
    description varchar(255) NOT NULL,
    priority varchar(255) NOT NULL,
    PRIMARY KEY (ID)
  );`
}

module.exports = { queries }