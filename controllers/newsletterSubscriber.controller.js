const {
  findAllSubscriberService,
  allSubscriberCountService,
  createSubscriberService,
  removeSubscriberService,
} = require("../services/newsletterSubscriber.service");

exports.getAllSubscriber = async (req, res) => {
  try {
    const allSubscriber = await findAllSubscriberService();
    const totalCount = await allSubscriberCountService();
    res.status(200).json({
      status: "success",
      totalCount,
      data: allSubscriber,
      message: "All Subscriber info fetched successfully.",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
      message: "Fetching subscribe list failed.",
    });
  }
};
exports.createSubscriber = async (req, res) => {
  try {
    const subscriber = req.body;
    const result = await createSubscriberService(subscriber);

    res.status(200).json({
      status: "success",
      data: result,
      message: "Subscriber created successfully!",
    });
  } catch (error) {
    if (
      error.message ===
      "NewsletterSubscriber validation failed: email: The specified email address is already in use."
    ) {
      res.status(500).json({
        status: "fail",
        error: error?.message || error,
        message: "Duplicate error: The email Already Subscribed!",
      });
    } else
      res.status(500).json({
        status: "fail",
        error: error?.message || error,
        message: "Subscriber creation failed.",
      });
  }
};

exports.removeSubscriber = async (req, res) => {
  try {
    const email = req.params.email;
    const result = await removeSubscriberService(email);

    if (result === null) {
      res.status(404).json({
        status: "fail",
        message: "No Subscriber found with this email.",
      });
    } else {
      res.status(200).json({
        status: "success",
        data: result,
        message: "Subscriber removed successfully!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
      message: "Subscription remove process failed.",
    });
  }
};
