import express from "express";
const router = express.Router();

import {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  countTotalSales,
  countTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered
} from "../controllers/order.controller.js";

import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/auth.middleware.js";

router
  .route("/")
  .post(authenticate, createOrder)
  .get(authenticate, authorizeAdmin, getAllOrders);

router.route("/mine").get(authenticate, getUserOrders);

router.route('/total-orders').get(countTotalOrders)

router.route('/total-sales').get(countTotalSales)

router.route('/total-sales-by-date').get(countTotalSalesByDate)

router.route('/:id').get(authenticate, findOrderById)

router.route('/:id/pay').put(authenticate, markOrderAsPaid)

router.route('/:id/deliver').put(authenticate, authorizeAdmin, markOrderAsDelivered)


export default router;
