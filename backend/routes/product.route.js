import express from "express";
import formidable from "express-formidable";
const router = express.Router();

import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/auth.middleware.js";
import checkId from "../middlewares/checkId.js";

import {
  addProduct,
  updateProduct,
  deleteProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
} from "../controllers/product.controller.js";

router
  .route("/")
  .post(authenticate, authorizeAdmin, formidable(), addProduct)
  .get(fetchProducts);

router.route("/allproducts").get(fetchAllProducts);

router
  .route("/:id/reviews")
  .post(authenticate, checkId, addProductReview);

router.get("/top", fetchTopProducts);

router.get("/new", fetchNewProducts);

router
  .route("/:id")
  .get(fetchProductById)
  .put(authenticate, authorizeAdmin, formidable(), updateProduct)
  .delete(authenticate, authorizeAdmin, deleteProduct);

router.route('/filtered-products').post(filterProducts)

export default router;
