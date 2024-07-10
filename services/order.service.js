const Order = require("../models/Order");

exports.findAllOrderService = async () => {
  try {
    const orders = await Order.find().exec();
    return orders;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to retrieve orders.");
  }
};

exports.AllOrderCountService = async (filter = {}) => {
  try {
    const orderCount = await Order.countDocuments(filter).exec();
    return orderCount;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to count orders.");
  }
};

exports.saveOrderService = async (data) => {
  const result = await Order.create(data);
  return result;
};

exports.modifyOrderService = async (id, update) => {
  try {
    const result = await Order.findByIdAndUpdate(id, update, {
      upsert: false,
      new: true,
    }).exec();
    if (!result) {
      throw new Error("No order found with the specified ID.");
    }
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deleteOrderService = async (id) => {
  try {
    const result = await Order.findByIdAndDelete(id).exec();
    if (!result) {
      throw new Error("No order found with the specified ID.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete order.");
  }
};

exports.findMyOrderService = async (email) => {
  try {
    const result = await Order.find({ "buyer.email": email }).exec();
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Couldn't find your orders.");
  }
};

exports.modifyMyOrderService = async (id, update) => {
  try {
    const result = await Order.findByIdAndUpdate(id, update, {
      upsert: false,
      new: true,
    }).exec();
    if (!result) {
      throw new Error("No order found with the specified ID.");
    }
    return result;
  } catch (error) {
    throw new Error("Failed to modify order.");
  }
};

exports.getOrderDetailsService = async (orderId) => {
  try {
    const order = await Order.findById(orderId).populate({
      path: "buyer.userId",
      select: "name email contactNumber shippingAddress",
    });

    if (!order) {
      throw new Error("Order not found.");
    }

    return {
      _id: order._id,
      buyer: order.buyer.userId, // Already populated user information
      products: order.products,
      status: order.status,
      buyerMessage: order.buyerMessage,
      sellerMessage: order?.sellerMessage, // Assuming you have a sellerMessage field
    };
  } catch (error) {
    console.error(error);
    throw error; // Re-throw for handling at the controller level
  }
};
