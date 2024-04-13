const express = require('express');

const usersRouter = require('./routes/users.js');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.send('OK');
});

app.use('/api/users', usersRouter);

module.exports = app;
