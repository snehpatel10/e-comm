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
  getNotifications
} from "../controllers/user.controller.js";
import {
  authenticate,
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

router.route('/notification').get(authenticate,authorizeAdmin, getNotifications)

export default router;
