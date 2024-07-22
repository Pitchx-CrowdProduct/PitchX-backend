const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.sendStatus(403);
        }
        req.user = decoded;
        next();
      });
    } else {
      res.sendStatus(403);
    }
  };

module.exports = {verifyToken};