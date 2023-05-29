const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const createDefaultAdminUser = asyncHandler(async (req, res) => {
  try {
    // Check if an admin user already exists
    const adminUser = await User.findOne({ role: "admin" });
    if (adminUser) {
      console.log("Default admin user already exists.");
      return;
    }

    // Create a new admin user
    const defaultAdmin = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: "Admin1234@",
      role: "admin",
    });

    // Save the user to the database
    await defaultAdmin.save();
    console.log("Default admin user created.");
  } catch (error) {
    console.error("Error creating default admin user:", error);
  }
});

const LoginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  if (!email || !password) {
    res.status(400);
    throw new Error("Please add Email and Password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not found, Please signUp");
  }

  const passwordIsCorrrect = await bcrypt.compare(password, user.password);

  const token = generateToken(user._id);
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  if (user && passwordIsCorrrect) {
    const { _id, name, email, role } = user;
    res.status(201).json({ _id, name, email, role, token });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});


const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token
  if (!token) {
    return res.json(false)
  }
  const verified = jwt.verify(token, process.env.JWT_SECRET)
  if (verified) {
    return res.json(true)
  }
  return res.json(false)
})

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  })
  return res.status(200).json({ message: "Successfully Logged Out" })
})
module.exports = { createDefaultAdminUser, LoginUser, loginStatus, logoutUser };
