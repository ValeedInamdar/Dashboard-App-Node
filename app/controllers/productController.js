const path = require("path");
const fs = require("fs");
const Product = require("../models/productModel");

exports.createProduct = async (req, res) => {
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
      imageUrl: `/uploads/${req.file.filename}`,
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
    const { name, brandName, category, price, quantity, createdBy } = req.body;
    const updateData = {
      name,
      brandName,
      category,
      price,
      quantity,
      createdBy,
    };
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`; // or rename/move + save URL
      const product = await Product.findById(id);
      if (product.imageUrl) {
        const imagePath = path.join(__dirname, "..", product.imageUrl); // adjust if you're storing full URL
        fs.unlink(imagePath, (err) => {
          if (err) console.error("Image delete failed:", err);
        });
      }
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedProduct) {
      return res.status(400).json({
        success: false,
        msg: "product does not exists with provided id",
      });
    }
    return res.status(201).json({
      success: true,
      msg: "product updated successfully",
      data: updatedProduct,
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
    const product = await Product.findById(id);
    if (!product)
      return res.status(400).json({
        success: false,
        msg: "product does not exists with provided id",
      });

    // 2. Delete image file if exists
    if (product.imageUrl) {
      const imagePath = path.join(__dirname, "..", product.imageUrl); // adjust if you're storing full URL
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Image delete failed:", err);
      });
    }

    // 3. Delete product from DB
    await product.deleteOne();
    return res.status(200).json({
      success: true,
      msg: "product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong please try again later",
    });
  }
};
