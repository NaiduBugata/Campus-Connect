const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  const expiresIn = process.env.JWT_EXPIRE && process.env.JWT_EXPIRE.trim() !== '' 
    ? process.env.JWT_EXPIRE.trim() 
    : '7d';
  
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };