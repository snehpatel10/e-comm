import { resolveObjectURL } from "buffer";
import asyncHandler from "../middlewares/asyncHandler.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import sendEmail from "../utils/nodemailer.js";
import moment from "moment";
import { log } from "console";

function calcPrices(orderItems) {
  // Calculate the price of the items
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // Shipping price logic
  const shippingPrice = itemsPrice > 100 ? 0 : 10;

  // Tax rate and calculation
  const taxRate = 0.15;
  const taxPrice = (itemsPrice * taxRate).toFixed(2); // Rounded to 2 decimals

  // Total price calculation
  const totalPrice = itemsPrice + shippingPrice + parseFloat(taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2), // Round the item price to 2 decimals
    shippingPrice: shippingPrice.toFixed(2), // Round shipping price to 2 decimals
    taxPrice,
    totalPrice: totalPrice.toFixed(2), // Round final total price to 2 decimals
  };
}

export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );

      if (!matchingItemFromDB) {
        res.status(404);
        throw new Error(`Product not found: ${itemFromClient._id}`);
      }

      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
//        _id: undefined,
      };
    });

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id username");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const getUserOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const countTotalOrders = asyncHandler(async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const countTotalSales = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders
      .reduce((sum, order) => sum + order.totalPrice, 0)
      .toFixed(2);
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const countTotalSalesByDate = asyncHandler(async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: {
          isPaid: true, // Only consider paid orders
        },
      },
      {
        $project: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } }, // Format date to YYYY-MM-DD
          totalPrice: 1, // Include the totalPrice field in the projection
        },
      },
      {
        $group: {
          _id: "$date", // Group by the formatted date
          totalSales: { $sum: "$totalPrice" }, // Sum totalSales for each date
        },
      },
      {
        $sort: { _id: 1 }, // Sort the results by date ascending (optional)
      },
    ]);

    res.json(salesByDate); // Return the aggregated data
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export const findOrderById = asyncHandler(async(req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'username email')
        if(order) {
            res.json(order)
        }
        else {
            res.status(404)
            throw new Error('Order not found')
        }
    } catch (error) {
        
    }
})

export const markOrderAsPaid = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      // Calculate the expected delivery date (3 days after the payment date)
      const expectedDeliveryDate = moment(order.paidAt).add(3, 'days').format('MMMM Do YYYY');

      // Save the updated order in the database
      const updatedOrder = await order.save();

      // Prepare the email content
      const subject = `Payment Successful for Order #${order._id}`;
      const text = `Dear ${req.user.username},\n\nYour payment for Order #${order._id} was successful. The expected delivery date for your order is ${expectedDeliveryDate}.\n\nThank you for shopping with us!`;
      const html = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f9;
                color: #333;
                margin: 0;
                padding: 0;
              }
              .email-container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
              }
              .email-header {
                background-color: #4CAF50;
                padding: 10px 0;
                text-align: center;
                border-radius: 8px 8px 0 0;
                color: #fff;
              }
              .email-header h2 {
                margin: 0;
              }
              .email-content {
                padding: 20px;
                text-align: left;
              }
              .email-footer {
                background-color: #f4f4f9;
                text-align: center;
                padding: 15px;
                border-radius: 0 0 8px 8px;
                font-size: 12px;
                color: #777;
              }
              .button {
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin-top: 20px;
                display: inline-block;
              }
              .order-details {
                margin-top: 20px;
              }
              .order-details p {
                margin: 5px 0;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="email-header">
                <h2>Payment Successful!</h2>
              </div>
              <div class="email-content">
                <p>Dear ${req.user.username},</p>
                <p>We are happy to inform you that your payment for <strong>Order #${order._id}</strong> was successful!</p>
                
                <p><strong>Order ID:</strong> ${order._id}</p>
                <p><strong>Payment Date:</strong> ${moment(order.paidAt).format('MMMM Do YYYY, h:mm:ss a')}</p>

                <div class="order-details">
                  <p><strong>Expected Delivery Date:</strong> <span style="color: #4CAF50;">${expectedDeliveryDate}</span></p>
                  <p><strong>Payment Status:</strong> Paid</p>
                </div>

                <p>If you have any questions or concerns, please don't hesitate to contact our support team.</p>
                
                <a href="http://localhost:5173/order/${order._id}" class="button">View Order Details</a>
              </div>
              <div class="email-footer">
                <p>Thank you for shopping with us!</p>
                <p>&copy; 2025 E-comm</p>
              </div>
            </div>
          </body>
        </html>
      `;

      // Send the email to the user
      await sendEmail(req.user.email, subject, text, html);

      // Return the updated order response to the client
      res.status(200).json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const markOrderAsDelivered = asyncHandler(async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
        
        if(order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now()

            const updatedOrder = await order.save()
            res.json(updatedOrder)
        }
        else {
            res.status(404)
            throw new Error('Order not found')
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
