import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      required: true, // e.g., "order", "alert", etc.
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 2 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
