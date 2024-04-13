const express = require('express');

const usersRouter = require('./routes/users.js');
const itemsRouter = require('./routes/items.js');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.send('OK');
});

app.use('/api/users', usersRouter);
app.use('/api/items', itemsRouter);

module.exports = app;
