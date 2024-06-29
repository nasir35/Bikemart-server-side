const {
  findAllProductsService,
  saveProductService,
  modifyProductService,
  deleteProductService,
  findProductService,
  AllProductCountService,
} = require("../services/product.service");

exports.getAllProducts = async (req, res) => {
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

    const totalCount = await AllProductCountService();
    const products = await findAllProductsService(filters, queries, skipValue);

    res.status(200).json({
      status: "success",
      totalCount,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};
exports.saveProduct = async (req, res) => {
  try {
    const product = req.body;
    const result = await saveProductService(product);

    res.status(200).json({
      status: "success",
      data: result,
      message: "Product inserted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};
exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;
    const result = await modifyProductService(id, update);

    res.status(200).json({
      status: "success",
      data: result,
      message: "Product modified successfully!",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error?.message || error,
    });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteProductService(id);

    if (result === null) {
      res.status(404).json({
        status: "fail",
        message: "No product found with this ID.",
      });
    } else {
      res.status(200).json({
        status: "success",
        data: result,
        message: "Product deleted successfully!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await findProductService(id);
    if (product === null) {
      res.status(404).json({
        status: "fail",
        message: "No product found with this ID.",
      });
    } else {
      res.status(200).json({
        status: "success",
        data: product,
        message: "Product fetched successfully!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};
