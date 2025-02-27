import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "../config/db.js";
import userRouter from "../routes/user.route.js";
import categoryRouter from "../routes/category.route.js";
import productRouter from "../routes/product.route.js";
import uploadRouter from "../routes/upload.route.js";
import orderRouter from "../routes/order.route.js";
import notificationRouter from "../routes/notification.router.js";

import Notification from "../models/notification.model.js";

dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/orders", orderRouter);
app.use("/api/notification", notificationRouter);

app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  reconnection: true, 
  reconnectionAttempts: 5, 
  reconnectionDelay: 1000,
});

io.on("connection", (socket) => {
  console.log("Connected to socket");

  socket.on("deleteNotification", async (notificationId) => {
    try {
      const deletedNotification = await Notification.findByIdAndDelete(
        notificationId
      );

      if (deletedNotification) {
        console.log(
          `Notification with ID ${notificationId} deleted successfully`
        );
      } else {
        console.log(`Notification with ID ${notificationId} not found`);
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  });

  socket.on("markNotificationAsRead", async (notificationId) => {
    try {
      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { isRead: true },
        { new: true }
      );

      if (!notification) {
        socket.emit("error", "Notification not found");
        return;
      }
      io.emit("notificationRead", notification);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      socket.emit(
        "error",
        "An error occurred while marking the notification as read"
      );
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("Client disconnected:", socket.id, "Reason:", reason);
  });

  socket.on("connect_error", (err) => {
    console.log("Connection error:", err);
  });
});

export { io };

server.listen(port, () => console.log(`Server is listing on port ${port}`));
