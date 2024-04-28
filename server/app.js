const express = require('express');
const cors = require('cors');

const usersRouter = require('./routes/users.js');
const itemsRouter = require('./routes/items.js');

const app = express();
app.use(express.json());

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://172.16.4.130',
  ],
}));

app.get('/health', (req, res) => {
  res.send('OK');
});

app.use('/api/users', usersRouter);
app.use('/api/items', itemsRouter);

module.exports = app;
