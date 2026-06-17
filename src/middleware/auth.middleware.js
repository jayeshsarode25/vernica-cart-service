import jwt from "jsonwebtoken";
import config from "../config/config.js";

export function createAuthMiddleware(role = ["user"]) {
  return function authMiddleware(req, res, next) {
    const token =
      req.cookies?.token || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: No token provided",
      });
    }

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);

      if (!role.includes(decoded.role)) {
        return res.status(403).json({
          message: "Forbidden: Insufficient permissions",
        });
      }

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({
        message: "Unauthorized: Invalid token",
      });
    }
  };
}

// export function createAuthMiddleware(req, res, next) {

//   const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized: No token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, config.JWT_SECRET);

//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Unauthorized: Invalid token" });
//   }
// }
