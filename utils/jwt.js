const jwt = require("jsonwebtoken");

/**
 * genarator token
 */
const generateAccessToken = (user, secretKey, tokenLife = "12h") => {
  const payload = {
    id: user.id,
    username: user.username,
    fullname: user.fullname,
    email: user.email,
  };
  const option = {
    algorithm: "HS256",
    expiresIn: tokenLife,
  };
  return new Promise((rs, rj) => {
    jwt.sign(payload, secretKey, option, (err, token) => {
      if (err) rj(false);
      rs(token);
    });
  });
};

/**
 * this module used for verify jwt token
 * token
 * secretkey
 */

const verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded);
    });
  });
};

module.exports = {
  generateAccessToken,
  verifyToken,
};
