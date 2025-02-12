import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import asyncHandler from "./asyncHandler.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  //read JWT from 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.userId).select('-password')
        next();

    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});

export const authenticateResetToken = asyncHandler(async (req, res, next) => {
  let token = req.cookies.resetToken;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.exp < Date.now() / 1000) {
        return res.status(401).json({ message: "Token has expired" });
      }

      req.user = await User.findOne({ email: decoded.userId }).select("-password");
      next(); 
    } catch (error) {
      console.log("Token verification error:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.log("No resetToken cookie found");
    return res.status(401).json({ message: "Not authorized, no token found" });
  }
});


export const authorizeAdmin = (req, res, next) => {
    if(req.user && req.user.isAdmin) {
        next()
    }
    else {
        res.status(401).send("Not authorized as an admin")
    }
}
