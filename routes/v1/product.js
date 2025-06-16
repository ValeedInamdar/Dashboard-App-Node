const express = require("express");
const router = express.Router();
const productController = require("../../controllers/productController");

router.post("/add", productController.addProduct);
router.get("/all", productController.getAllProduct);
router.get("/:id", productController.getProductById);
router.put("/update/:id", productController.updateProduct);
router.delete("/delete/:id", productController.deleteProduct);

module.exports = router;
