import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization || "";
  const bearerToken = header.startsWith("Bearer ") ? header.slice(7) : null;
  const cookieToken = req.cookies?.token || null;
  const token = bearerToken || cookieToken;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;