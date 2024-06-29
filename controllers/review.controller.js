const {
  deleteReviewService,
  modifyReviewService,
  saveReviewService,
  findAllReviewsService,
  findPublishedReviewsService,
  documentsCount,
} = require("../services/review.service");

exports.getAllReviews = async (req, res) => {
  try {
    let filters = { ...req.query };
    let queries = req.query;
    queries.sort = queries?.sort?.split(",").join(" ");
    const excludeFields = ["limit", "page", "sort"];
    excludeFields.forEach((field) => delete filters[field]);

    const currentPage = parseInt(req.query?.page) || 1;
    const pageSize = 20;
    const skipValue = (currentPage - 1) * pageSize;

    queries.limit = parseInt(queries?.limit) || pageSize;
    if (filters["_id"]) {
      filters["_id"] = new ObjectId(filters["_id"]);
    }
    const reviews = await findAllReviewsService(filters, queries, skipValue);
    const totalCount = await documentsCount();
    res.status(200).json({
      status: "success",
      totalCount,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};
exports.getPublishedReviews = async (req, res) => {
  try {
    const filter = { reviewStatus: "Published" };
    const reviews = await findPublishedReviewsService(filter);
    const totalCount = await documentsCount(filter);
    res.status(200).json({
      status: "success",
      totalCount,
      data: reviews,
      message: "successfully fetched Published reviews",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};
exports.saveReview = async (req, res) => {
  try {
    const review = req.body;
    const result = await saveReviewService(review);

    res.status(200).json({
      status: "success",
      data: result,
      message: "Review Added successfully!",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};
exports.updateReview = async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;
    const result = await modifyReviewService(id, update);

    res.status(200).json({
      status: "success",
      data: result,
      message: "Review modified successfully!",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error?.message || error,
    });
  }
};
exports.deleteReview = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteReviewService(id);

    if (result === null) {
      res.status(404).json({
        status: "fail",
        message: "No review found with this ID.",
      });
    } else {
      res.status(200).json({
        status: "success",
        data: result,
        message: "Review deleted successfully!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};
