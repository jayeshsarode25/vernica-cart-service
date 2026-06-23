import jwt from "jsonwebtoken";
import config from "../config/config.js";

function getBearerToken(req) {
  const authHeader = req.headers?.authorization;

  if (!authHeader) return null;

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) return null;

  return token;
}

export function createAuthMiddleware(role = ["user"]) {
  return function authMiddleware(req, res, next) {
    const token = req.cookies?.token || getBearerToken(req);

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: No token provided",
      });
    }

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      const userId = decoded.userId ?? decoded.id ?? decoded._id;
      const auth = {
        userId,
        role: decoded.role,
        authenticated: true,
      };

      if (!role.includes(auth.role)) {
        return res.status(403).json({
          message: "Forbidden: Insufficient permissions",
        });
      }

      req.auth = auth;
      req.user = { ...decoded, userId: auth.userId, id: auth.userId, role: auth.role };
      next();
    } catch (err) {
      return res.status(401).json({
        message: "Unauthorized: Invalid token",
      });
    }
  };
}
