const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!email || !name || !password) {
    res.status(400);
    throw new Error("complete all required  fields");
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(404).json({
      message: `Hi ${userExist.name} kindly login`,
    });
    throw new Error(`Hi ${userExist.name} kindly login`);
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({
      message: "Failed to Create User",
    });
    throw new Error("Failed to Create User");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      message: "Fill all required fields",
    });
    throw new Error("Fill all required fields");
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({
      message: "Invalid Email or Password",
    });
    throw new Error("Invalid Email or Password");
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await await User.find(keyword).find({
    _id: { $ne: req.user._id },
  });

  res.status(200).json(users);
});

module.exports = {
  registerUser,
  authUser,
  allUsers,
};
