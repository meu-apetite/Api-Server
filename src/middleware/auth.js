import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/login");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.company = decoded;
  } catch (err) {
    return res.redirect("/login");
  }
  return next();
};

export default verifyToken;