import express from "express";
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrenUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
  forgotPassword,
  resetPassword,
  deleteAccount
} from "../controllers/user.controller.js";
import {
  authenticate,
  authenticateResetToken,
  authorizeAdmin,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);
router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);

router
  .route("/profile")
  .get(authenticate, getCurrenUserProfile)
  .put(authenticate, updateCurrentUserProfile);

//admin routes
router
  .route("/:id")
  .delete(authenticate, authorizeAdmin, deleteUserById)
  .get(authenticate, authorizeAdmin, getUserById)
  .put(authenticate, authorizeAdmin, updateUserById);

router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password').post(authenticateResetToken, resetPassword)

router.route('/delete/:id').delete(authenticate, deleteAccount)

export default router;
