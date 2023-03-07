const express = require('express');
const process = require('process');
const { config } = require('dotenv').config();
// const test = require('./test/Test')();

const userAuthRouter = require('./api/userAuth');
const usersRouter = require('./api/users');
const projectsRouter = require('./api/projects');
const projectUsersRouter = require('./api/projectUsers');
const ticketsRouter = require('./api/tickets');
const commentsRouter = require('./api/comments');

const port = process.env.PORT;

const app = express();

app.use(express.json());

// Static Page
app.use(express.static(`${__dirname}/ticket-desk/build`));

// API Routes
app.use(userAuthRouter);
app.use(usersRouter);
app.use(projectsRouter);
app.use(projectUsersRouter);
app.use(ticketsRouter);
app.use(commentsRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
