const Product = require("../models/Product");

exports.findAllProductsService = async (filters, queries, skipValue) => {
  try {
    const products = await Product.find(filters)
      .limit(queries?.limit)
      .skip(skipValue)
      .sort(queries.sort)
      .exec();
    return products;
  } catch (error) {
    console.error(error);
    return error;
  }
};
exports.AllProductCountService = async () => {
  try {
    const productsCount = await Product.countDocuments().exec();
    return productsCount;
  } catch (error) {
    console.error(error);
    return error;
  }
};
exports.saveProductService = async (data) => {
  const result = await Product.create(data);
  return result;
};
exports.modifyProductService = async (id, update) => {
  const isExist = await Product.findById(id);
  if (isExist) {
    const result = await Product.findOneAndUpdate({ _id: id }, update, {
      upsert: true,
      new: true,
    });
    return result;
  } else {
    throw new Error("No Product found with the specified ID.");
  }
};
exports.deleteProductService = async (id) => {
  const result = await Product.findOneAndDelete({ _id: id });
  return result;
};
exports.findProductService = async (id) => {
  const result = await Product.findById(id);
  return result;
};
