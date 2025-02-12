import jwt from "jsonwebtoken";

const generateToken = (res, userId, cookieName, expiry="30d") => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: expiry,
  });

  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token
};

export default generateToken;
