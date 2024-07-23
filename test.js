

const jwt = require('jsonwebtoken');

// Fallback to a default secret if environment variable is not set
const JWT_SECRET = 'pK7vX9R$mJ3qLzF2wN8cA5hT@bE4uY67' 
console.log(JWT_SECRET);
const payload = {
    sub: "google-oauth2|116284241721006139510",
  email: "pramaths848@gmail.com",
  };
  

try {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '6h' });
  console.log('Generated JWT:');
  console.log(token);
} catch (error) {
  console.error('Error generating JWT:', error.message);
}