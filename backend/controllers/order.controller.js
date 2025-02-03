import { resolveObjectURL } from "buffer";
import asyncHandler from "../middlewares/asyncHandler.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

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

export const createOrder = asyncHandler(async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    // Fetch products from the DB
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    // Map client order items to match the DB records
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );

      if (!matchingItemFromDB) {
        res.status(404);
        throw new Error(`Product not found: ${itemFromClient}`);
      }

      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined, // Remove _id from client-side item
      };
    });

    // Get the prices using the calculation function
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    // Create the order
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

    // Save the created order to the DB
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
        const order = await Order.findById(req.params.id)

        if(order) {
            order.isPaid = true;
            order.paidAt = Date.now()
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.payer.email_address
            }

            const updateOrder = await order.save()
            res.status(200).json(updateOrder)
        }
        else {
            res.status(404)
            throw new Error('Order not found')
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

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
