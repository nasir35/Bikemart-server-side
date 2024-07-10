const Order = require("../models/Order");
const { getOrderDetailsService } = require("../services/order.service");
const {
  modifyMyOrderService,
  findAllOrderService,
  AllOrderCountService,
  saveOrderService,
  deleteOrderService,
  modifyOrderService,
  findMyOrderService,
} = require("../services/order.service");

const checkStatusTransition = async (id, status, allowedTransitions) => {
  const selectedOrder = await Order.findById(id).exec();
  if (!selectedOrder) {
    return new Error("Order not found.");
  }

  const currentStatus = selectedOrder.status;
  if (
    !allowedTransitions[currentStatus] ||
    !allowedTransitions[currentStatus].includes(status)
  ) {
    return new Error("Invalid status transition.");
  }
  return selectedOrder;
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await findAllOrderService();
    const totalCount = await AllOrderCountService();
    res.status(200).json({
      status: "success",
      totalCount,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error?.message || error,
    });
  }
};
exports.saveOrder = async (req, res) => {
  try {
    const order = req.body;
    const result = await saveOrderService(order);

    res.status(200).json({
      status: "success",
      data: result,
      message: "Order Created successfully!",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error || error?.message,
    });
  }
};
exports.updateOrder = async (req, res, next) => {
  try {
    const id = req.params.id;
    const update = req.body;
    console.log(update);
    let status = req.body.status;
    // allowed status transitions
    const allowedTransitions = {
      Processing: [
        "Processing",
        "Shipped",
        "Request Cancel",
        "Cancelled",
        "Out for Delivery",
      ],
      Shipped: ["Out for Delivery", "Shipped", "Delivered", "Returned"],
      "Out for Delivery": ["Out for Delivery", "Delivered", "Returned"],
      Delivered: ["Delivered"],
      "Request Cancel": ["Request Cancel", "Cancelled"],
      Cancelled: ["Cancelled"],
      Returned: ["Returned", "Refunded"],
      Refunded: ["Refunded"],
    };
    const selectedOrder = await checkStatusTransition(
      id,
      status,
      allowedTransitions
    );
    console.log(update);
    const result = await modifyOrderService(id, update);

    res.status(200).json({
      status: "success",
      data: result,
      message: "Order modified successfully!",
    });
  } catch (error) {
    next(error);
    // res.status(500).json({
    //   status: "fail",
    //   error: error?.message || error,
    // });
  }
};
exports.deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteOrderService(id);

    if (result === null) {
      res.status(404).json({
        status: "fail",
        message: "No Order found with this ID.",
      });
    } else {
      res.status(200).json({
        status: "success",
        data: result,
        message: "Order deleted successfully!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error?.message || error,
    });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await findMyOrderService(req.user.email);
    const totalCount = await AllOrderCountService({
      "buyer.email": req.user.email,
    });
    res.status(200).json({
      status: "success",
      totalCount,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error?.message || error,
    });
  }
};
exports.updateMyOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const allowedTransitions = {
      "Out for Delivery": ["Delivered"],
      Processing: ["Request Cancel"],
      "Request Cancel": ["Request Cancel", "Processing"],
    };
    const selectedOrder = await checkStatusTransition(
      id,
      status,
      allowedTransitions
    );
    if (selectedOrder.buyer.email !== req.user.email) {
      return res.status(403).json({
        status: "fail",
        message: "Error! You are not authorized!",
      });
    }
    const result = await modifyMyOrderService(id, { status });

    res.status(200).json({
      status: "success",
      data: result,
      message: "Order status modified successfully!",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error?.message || error,
    });
  }
};

exports.getOrderDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await getOrderDetailsService(id);
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    error = error || error.message;
    next(error);
  }
};
