import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authenticationMiddleware = (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];
  
  if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
    const token = authorizationHeader.substring(7);
    try {
      jwt.verify(token, process.env.TOKEN_KEY);
      next();
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Token inválido' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Token não fornecido' });
  }
};

export default authenticationMiddleware;