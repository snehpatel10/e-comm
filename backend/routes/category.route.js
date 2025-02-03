import express from "express";
const router = express.Router();
import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/auth.middleware.js";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  listCategory,
  readCategory
} from "../controllers/category.controller.js";

router.route("/").post(authenticate, authorizeAdmin, createCategory);
router
  .route("/:categoryId")
  .put(authenticate, authorizeAdmin, updateCategory)
  .delete(authenticate, authorizeAdmin, deleteCategory);

router.route("/categories").get(listCategory);

router.route('/:id').get(readCategory)

export default router;
