const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decodeToken = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decodeToken.id).select("-password");

      next();
    } catch (error) {
      res.status(401).json({
        message: "Not an authorized token",
      });
      throw new Error("Not an authorized token");
    }
  }

  if (!token) {
    res.status(401).json({
      message: "Token not found",
    });

    throw new Error("Token not found");
  }
});

module.exports = { protect };
