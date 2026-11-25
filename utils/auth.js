import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.JWT_SECRET;
const expiration = "2h";

// Sign a JWT containing the user's non-sensitive payload
export function signToken({ username, email, _id }) {
  const payload = { username, email, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}

// Middleware to verify JWT Bearer token and attach req.user
export function authMiddleware(req, res, next) {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ").pop().trim();
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    req.user = data;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}
