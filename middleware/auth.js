const { verifyToken } = require("../utils/jwt");

module.exports.isAuthorized = async (req, res, next) => {
  let token = req.get("authorization");
  try {
    if (!token) throw new Error("Token is not valid");
    if (token.indexOf("Bearer ") !== 0)
      throw new Exception("Token is not Bearer Token");
    token = token.slice(7, token.length).trimLeft();
    const { id, email } = await verifyToken(token, process.env.JWT_SECRET_KEY);
    req.user = {
      id,
      email,
    };
    next();
  } catch ({ message = "Token is not valid" }) {
    res.status(401).send({ message });
  }
};
