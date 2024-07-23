const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader === 'undefined') {
      console.error('Token not provided');
      return res.status(401).json({ error: 'No token provided' });
    }

    const bearer = bearerHeader.split(' ');
    if (bearer.length !== 2 || bearer[0] !== 'Bearer') {
      console.error('Invalid Authorization header format');
      return res.status(401).json({ error: 'Invalid Authorization header format' });
    }

    const bearerToken = bearer[1];
    console.log('Bearer token:', bearerToken);

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set');
      return res.status(500).json({ error: 'Internal server error' });
    }
    console.log('JWT_SECRET length (verification):', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 'not set');
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    const decodedToken = jwt.decode(bearerToken, { complete: true });
    console.log('Decoded token header:', decodedToken.header);
    console.log('Decoded token payload:', decodedToken.payload);
    jwt.verify(bearerToken, process.env.JWT_SECRET, { algorithms: ['HS256'] }, (err, decoded) => {
      if (err) {
        console.error('Error verifying token:', err);
        if (err.name === 'JsonWebTokenError') {
          return res.status(401).json({ error: 'Invalid token' });
        } else if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ error: 'Token expired' });
        } else {
          return res.status(500).json({ error: 'Failed to authenticate token' });
        }
      }
      req.user = decoded;
      next();
    });
};

module.exports = { verifyToken };