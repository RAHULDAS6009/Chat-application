const User = require("../model/user");
const asyncHandlers = require("express-async-handler");
const generateToken = require("../config/generateToken");

const register = asyncHandlers(async (req, res) => {
  const { name, email, password, pic } = req.body;

  // Check if all required fields are present
  if (!name || !password || !email) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  // Check if the user already exists
  const userExsist = await User.findOne({ email });
  if (userExsist) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create new user
  const user = await User.create({ name, email, password, profilePic: pic });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.profilePic, // Use correct field for profile picture
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//filter users
const allUsers = asyncHandlers(async (req, res) => {
  const keyword = req.query.search
    ? {
        //select on of them
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {}; //?search=

  //$ne is a not null operator
  //In other words, it's excluding the current user from the search results.
  const allUsers = await User.find(keyword).find({
    _id: { $ne: req.user._id },
  });

  res.json({ users: allUsers });
});

//login
const authUser = asyncHandlers(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

module.exports = { register, allUsers, authUser };
