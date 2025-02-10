import User from "../models/user.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcryptjs from "bcryptjs";
import createToken from "../utils/createToken.js";

export const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new Error("Please fill all the inputs");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).send("User already exists");
  }

  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    createToken(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const isPasswordValid = await bcryptjs.compare(
      password,
      existingUser.password
    );

    if (isPasswordValid) {
      createToken(res, existingUser._id);

      res.status(201).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      });

      return;
    } else {
      res.status(401)
      throw new Error('Invalid email or password')
    }
  } else {
    res.status(404)
    throw new Error('User not found')
  }
});

export const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

export const getCurrenUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin  user");
    }

    await User.deleteOne({ _id: user._id });
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if(user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

export const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if(user) {
    user.username = req.body.username || user.username
    user.email = req.body.email || user.email
    // user.isAdmin = Boolean(req.body.isAdmin)
    if (req.body.hasOwnProperty('isAdmin')) {
      user.isAdmin = Boolean(req.body.isAdmin)
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

export const getNotifications = asyncHandler(async (req, res) => {
  try {
    // Fetch notifications for the admin, sorted by createdAt (most recent first)
    const notifications = await Notification.find({})
      .sort({ createdAt: -1 }); // -1 for descending order (newest first)

    // Respond with the notifications
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
