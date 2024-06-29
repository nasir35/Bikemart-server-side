const Review = require("../models/Review");

exports.findAllReviewsService = async (filters, queries, skipValue) => {
  try {
    const reviews = await Review.find(filters)
      .limit(queries?.limit)
      .skip(skipValue)
      .sort(queries.sort)
      .exec();
    return reviews;
  } catch (error) {
    console.error(error);
    return error;
  }
};
exports.documentsCount = async (filter = {}) => {
  try {
    let totalCount = await Review.countDocuments(filter).exec();
    return totalCount;
  } catch (error) {
    console.error(error);
    return error;
  }
};
exports.findPublishedReviewsService = async (filter) => {
  try {
    const reviews = await Review.find(filter).exec();
    return reviews;
  } catch (error) {
    console.error(error);
    return error;
  }
};
exports.saveReviewService = async (data) => {
  const result = await Review.create(data);
  return result;
};
exports.modifyReviewService = async (id, update) => {
  const isExist = await Review.findById(id);
  if (isExist) {
    const result = await Review.findOneAndUpdate({ _id: id }, update, {
      upsert: true,
      new: true,
    });
    return result;
  } else {
    throw new Error("No Review found with the specified ID.");
  }
};
exports.deleteReviewService = async (id) => {
  const result = await Review.findOneAndDelete({ _id: id });
  return result;
};
