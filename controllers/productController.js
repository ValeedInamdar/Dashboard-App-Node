const Product = require("../models/product");

exports.addProduct = async (req, res) => {
  try {
    const { name, brandName, category, price, quantity, createdBy } = req.body;

    const product = await Product.findOne({ name: name });
    if (product) {
      {
        return res.status(400).json({
          success: false,
          msg: "product name already exists",
        });
      }
    }
    const newProduct = new Product({
      name,
      brandName,
      category,
      price,
      quantity,
      createdBy,
    });
    await newProduct.save();
    return res.status(200).json({
      success: true,
      msg: "product created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong please try again later",
    });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    const productList = await Product.find({});
    return res.status(200).json({
      success: true,
      msg: "product list fetched successfully",
      data: productList,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong please try again later",
    });
  }
};

exports.getProductById = async function (req, res) {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({
        success: false,
        msg: "product does not exists",
      });
    }
    return res.status(200).json({
      success: true,
      msg: "product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong please try again later",
    });
  }
};

exports.updateProduct = async function (req, res) {
  try {
    const id = req.params.id;
    const body = req.body;
    const product = await Product.findByIdAndUpdate(id, body, { new: true });
    if (!product) {
      return res.status(400).json({
        success: false,
        msg: "product does not exists with provided id",
      });
    }
    return res.status(201).json({
      success: true,
      msg: "product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong please try again later",
    });
  }
};

exports.deleteProduct = async function (req, res) {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(400).json({
        success: false,
        msg: "product does not exists with provided id",
      });
    }
    return res.status(200).json({
      success: true,
      msg: "product deleted successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong please try again later",
    });
  }
};
