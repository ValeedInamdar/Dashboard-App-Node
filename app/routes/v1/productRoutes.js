const express = require("express");
const router = express.Router();
const productController = require("../../controllers/productController");
const upload = require("../../middleware/uploadMiddleware");
router.post("/create", upload.single("image"), productController.createProduct);
router.get("/all", productController.getAllProduct);
router.get("/:id", productController.getProductById);
router.put("/update/:id", productController.updateProduct);
router.delete("/delete/:id", productController.deleteProduct);

module.exports = router;
