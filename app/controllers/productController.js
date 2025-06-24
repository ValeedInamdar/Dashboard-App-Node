const path = require("path");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");
const Product = require("../models/productModel");

exports.createProduct = async (req, res) => {
  try {
    const { name, brandName, category, price, quantity, createdBy } = req.body;
    const filePath = req.file.path;

    const product = await Product.findOne({ name: name });
    if (product) {
      {
        return res.status(400).json({
          success: false,
          msg: "product name already exists",
        });
      }
    }
    // cloudinary upload
    let imageUrl, publicId;
    await cloudinary.uploader
      .upload(filePath, { folder: "products" })
      .then((result) => {
        fs.unlinkSync(filePath); // cleanup local file
        imageUrl = result.secure_url;
        publicId = result.public_id;
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ success: false, msg: "upload failed" });
      });

    const newProduct = new Product({
      name,
      brandName,
      category,
      price,
      quantity,
      createdBy,
      image: {
        url: imageUrl,
        public_id: publicId,
      },
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

    const product = await Product.findById(id);
    let imageUrl = product.image.url,
      publicId = product.image.public_id;
    if (req.file) {
      const filePath = req.file.path;
      await cloudinary.uploader.destroy(publicId);
      // cloudinary upload
      await cloudinary.uploader
        .upload(filePath, { folder: "products" })
        .then((result) => {
          fs.unlinkSync(filePath); // cleanup local file
          imageUrl = result.secure_url;
          publicId = result.public_id;
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).json({ success: false, msg: "upload failed" });
        });
    }

    const updateData = {
      name,
      brandName,
      category,
      price,
      quantity,
      createdBy,
      image: {
        url: imageUrl,
        public_id: publicId,
      },
    };
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
    const publicId = product.image.public_id;
    try {
      await cloudinary.uploader.destroy(publicId); // or add { resource_type: 'image' } if needed
    } catch (err) {
      return res
        .status(500)
        .json({ msg: "image deletion failed", success: false });
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
