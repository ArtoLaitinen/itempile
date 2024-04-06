const app = require('./app.js');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.info(`BACKEND IS LISTENING ON PORT ${PORT}`);
});
