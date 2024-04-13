const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      throw new Error('Authorization failed');
    }

    const decodedToken = jwt.verify(token, process.env.JWT_KEY);

    req.userData = { userId: decodedToken.id };

    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Authorization failed' });
  }
};

module.exports = verifyToken;
