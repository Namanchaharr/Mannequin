import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for header 
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Validate format: "Bearer <token>" // need to check
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Invalid token format" });
  }

  const token = parts[1];

  try {
    //  Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;

    // Continue to next middleware/controller
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};