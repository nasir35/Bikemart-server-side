const NewsletterSubscriber = require("../models/NewsletterSubscriber");

exports.findAllSubscriberService = async () => {
  try {
    const subscriber = await NewsletterSubscriber.find().exec();
    return subscriber;
  } catch (error) {
    console.error(error);
    return error;
  }
};
exports.allSubscriberCountService = async () => {
  try {
    const count = await NewsletterSubscriber.countDocuments().exec();
    return count;
  } catch (error) {
    console.error(error);
    return error;
  }
};
exports.createSubscriberService = async (subscriber) => {
  try {
    const result = await NewsletterSubscriber.create(subscriber);
    return result;
  } catch (error) {
    throw new Error(error?.message);
  }
};
exports.removeSubscriberService = async (email) => {
  try {
    const result = await NewsletterSubscriber.findOneAndUpdate(
      { email },
      { status: "unsubscribed" },
      {
        new: true,
      }
    ).exec();
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};
