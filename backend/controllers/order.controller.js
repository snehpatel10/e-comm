  import { resolveObjectURL } from "buffer";
  import asyncHandler from "../middlewares/asyncHandler.js";
  import Order from "../models/order.model.js";
  import Product from "../models/product.model.js";
  import Notification from "../models/notification.model.js";
  import sendEmail from "../utils/nodemailer.js";
  import moment from "moment";
  import puppeteer from "puppeteer";
  import { io } from "../index.js";

  function calcPrices(orderItems) {
    const itemsPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );

    const shippingPrice = itemsPrice > 100 ? 0 : 10;

    const taxRate = 0.15;
    const taxPrice = (itemsPrice * taxRate).toFixed(2); 

    const totalPrice = itemsPrice + shippingPrice + parseFloat(taxPrice);

    return {
      itemsPrice: itemsPrice.toFixed(2), 
      shippingPrice: shippingPrice.toFixed(2),
      taxPrice,
      totalPrice: totalPrice.toFixed(2), 
    };
  }

  const generateInvoice = async (order) => {
    const browser = await puppeteer.launch({
      executablePath: process.env.CHROME_PATH,
      headless: true,  
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // Additional args for environments that need it
    });
    
    const page = await browser.newPage();

    // Prepare the HTML for the invoice
    const invoiceHTML = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              color: #333;
            }
            .container {
              width: 80%;
              margin: auto;
            }
            .header {
              text-align: center;
              padding: 20px 0;
              border-bottom: 2px solid #333;
            }
            .header h1 {
              margin: 0;
              color: #4CAF50;
            }
            .order-info {
              margin-top: 20px;
              text-align: left;
            }
            .order-info p {
              margin: 5px 0;
            }
            .table {
              width: 100%;
              margin-top: 20px;
              border-collapse: collapse;
            }
            .table th, .table td {
              padding: 10px;
              text-align: left;
              border: 1px solid #ddd;
            }
            .total {
              text-align: right;
              font-size: 18px;
              font-weight: bold;
              margin-top: 20px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #777;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Invoice for Order #${order._id}</h1>
              <p>${moment(order.paidAt).format('MMMM Do YYYY')}</p>
            </div>

            <div class="order-info">
              <p><strong>Customer Name:</strong> ${order.user.username}</p>
              <p><strong>Email:</strong> ${order.user.email}</p>
              <p><strong>Shipping Address:</strong> ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}</p>
              <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            </div>

            <table class="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.orderItems.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.qty}</td>
                    <td>$${item.price}</td>
                    <td>$${(item.price * item.qty).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="total">
              <p><strong>Subtotal:</strong> $${order.itemsPrice}</p>
              <p><strong>Shipping:</strong> $${order.shippingPrice}</p>
              <p><strong>Tax:</strong> $${order.taxPrice}</p>
              <p><strong>Total Price:</strong> $${order.totalPrice}</p>
            </div>

            <div class="footer">
              <p>Thank you for shopping with us!</p>
              <p>&copy; 2025 E-comm</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Set the content and generate the PDF
    await page.setContent(invoiceHTML);
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();
    
    return pdfBuffer;
  };


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
          res.status(500);
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

      const notification = new Notification({
        username: req.user.username,
        orderId: createdOrder._id,
        message: `New order placed by ${req.user.username}. Order ID: ${createdOrder._id}`, 
        type: 'order',
      });

      await notification.save(); 

      io.emit('orderCreated', notification)

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
      const orders = await Order.find({ user: req.user._id }).sort({createdAt: -1});
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
              res.status(500)
              throw new Error('Order not found')
          }
      } catch (error) {
          
      }
  })

  export const markOrderAsPaid = asyncHandler(async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate('user', 'username email');

      if (order) {
        // Mark the order as paid
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: req.body.id,
          status: req.body.status,
          update_time: req.body.update_time,
          email_address: req.body.payer.email_address,
        };

        const expectedDeliveryDate = moment(order.paidAt).add(3, 'days').format('MMMM Do YYYY');

        // Generate invoice for the order
        //const invoicePDF = await generateInvoice(order);

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

        await sendEmail(
          order.user.email,
          subject,
          text,
           html,
          // invoicePDF, // Attach the generated PDF as an attachment
          // "Invoice.pdf" // Name of the attachment
        );

        // Save the updated order in the database
        const updatedOrder = await order.save();

        // Return the updated order response to the client
        res.status(200).json(updatedOrder);
      } else {
        res.status(500);
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
              res.status(500)
              throw new Error('Order not found')
          }
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  })

  export const markOrderAsPaidPOD = asyncHandler(async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate('user', 'username email');

      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: req.body.id,
          status: req.body.status,
          update_time: req.body.update_time,
          email_address: req.body.email_address,
        };

        const expectedDeliveryDate = moment(order.paidAt).add(3, 'days').format('MMMM Do YYYY');

        //const invoicePDF = await generateInvoice(order);

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
        await sendEmail(order.user.email, subject, text, html
          // , invoicePDF, "Invoice.pdf"
        );

        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);
      } else {
        res.status(500);
        throw new Error('Order not found');
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

