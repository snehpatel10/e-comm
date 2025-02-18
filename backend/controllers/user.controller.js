import User from "../models/user.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcryptjs from "bcryptjs";
import createToken from "../utils/createToken.js";
import sendEmail from "../utils/nodemailer.js";

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
    createToken(res, newUser._id, "jwt", "30d");

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
      createToken(res, existingUser._id, "jwt", "30d");

      res.status(201).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      });

      return;
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } else {
    res.status(404);
    throw new Error("User not found");
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
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    // user.isAdmin = Boolean(req.body.isAdmin)
    if (req.body.hasOwnProperty("isAdmin")) {
      user.isAdmin = Boolean(req.body.isAdmin);
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

export const getNotifications = asyncHandler(async (req, res) => {
  try {
    // Fetch notifications for the admin, sorted by createdAt (most recent first)
    const notifications = await Notification.find({}).sort({ createdAt: -1 }); // -1 for descending order (newest first)

    // Respond with the notifications
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const forgotPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const resetToken = createToken(res, email, "resetToken", "5m");

    const resetPasswordLink = `${process.env.FRONTEND_URL}/reset-password/${encodeURIComponent(resetToken)}`;

    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .email-container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .email-header {
              text-align: center;
              padding-bottom: 20px;
            }
            .email-header h1 {
              color: #4CAF50;
              font-size: 24px;
            }
            .email-body {
              padding: 20px;
              font-size: 16px;
              line-height: 1.5;
              color: #333;
            }
            .email-body p {
              margin-bottom: 10px;
            }
            .reset-link {
              display: inline-block;
              margin-top: 20px;
              padding: 10px 20px;
              background-color: #4CAF50;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              font-size: 14px;
              color: #888;
              margin-top: 20px;
            }
            .footer a {
              color: #4CAF50;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="email-body">
              <p>Hello,</p>
              <p>You requested a password reset. Please click the link below to reset your password:</p>
              <a href="${resetPasswordLink}" class="reset-link">Reset Password</a>
              <p>If you did not request this password reset, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>Thank you for using our service!</p>
              <p><a href="${process.env.FRONTEND_URL}">Visit our website</a></p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendEmail(email, "Reset Your Password", "Password reset link", htmlContent);

    res.status(200).json({ message: "Password reset email sent successfully." });
  } catch (error) {
    console.error("Error during forgotPassword process:", error);
    res.status(500).json({ error: error.message });
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;  // New password from the request body

  if (!password || password.length < 6) {
    // Check if the password is provided and meets minimum length requirement
    return res.status(400).json({ 
      success: false,
      message: 'Password is required and should be at least 6 characters' 
    });
  }

  try {
    const userEmail = req.user.email;

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },  
      { password: hashedPassword },
      { new: true }  
    );

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.cookie("resetToken", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.'
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while resetting the password. Please try again later.'
    });
  }
});

