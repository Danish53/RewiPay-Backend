import { sendEmail } from "../config/mailer.js";
import Order from "../models/order.js";
import User from "../models/User.js";

export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      shippingInfo,
      cartItems, // product object + quantity
      subtotal,
      shipping,
      totalAmount,
      transactionId
    } = req.body;

    if (!userId || !shippingInfo || !cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const order = await Order.create({
      userId,
      shippingInfo,
      cartItems, // saving full product object
      subtotal,
      shipping,
      totalAmount,
      transactionId
    });

    const subject = "Your Order Has Been Placed ✔️";
    const text = `Hello ${user.name},

Your order has been placed successfully!

Order ID: ${order._id}
Total Amount: ${totalAmount}
Items: ${cartItems.length}

We will notify you once your order is shipped.

Thank you for shopping with us!
`;

    await sendEmail(user.email, subject, text);

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId })
      .populate("transactionId")
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



