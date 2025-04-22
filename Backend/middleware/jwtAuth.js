import jwt from 'jsonwebtoken';

export const jwtAuth = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication token is required" });
  }

  try {
    const decoded = jwt.verify(token, "iamnikesh");

    // Assign user ID and role from the decoded token
    req.user = {
      _id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
