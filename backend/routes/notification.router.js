import express from 'express';
import Notification from '../models/notification.model.js';
import { io } from '../index.js';

const router = express.Router();

router.route('/').get(async (req, res) => {
  try {
    const notifications = await Notification.find(); 
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});


export default router;
