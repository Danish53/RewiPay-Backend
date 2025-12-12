import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const isAdmin = async (req, res, next) => {
  let token;

  // 1️⃣ Header me token (API fetch)
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  // 2️⃣ Cookie me token (server-rendered pages)
  else if (req.cookies && req.cookies.adminToken) {
    token = req.cookies.adminToken;
  }

  if (!token) {
    // API request ko JSON return karo, page request ko redirect
    if (req.originalUrl.startsWith("/admin/")) {
      return res.status(401).json({ message: "No token provided" });
    } else {
      return res.redirect("/admin/login");
    }
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user || req.user.role !== "admin") {
      if (req.originalUrl.startsWith("/admin/")) {
        return res.status(403).json({ message: "Access denied (Admin only)" });
      } else {
        return res.redirect("/admin/login");
      }
    }

    next();
  } catch (err) {
    if (req.originalUrl.startsWith("/admin/")) {
      return res.status(401).json({ message: "Invalid or expired token" });
    } else {
      return res.redirect("/admin/login");
    }
  }
};
