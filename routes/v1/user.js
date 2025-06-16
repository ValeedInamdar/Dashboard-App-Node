const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");


router.delete("/delete/:id", userController.delete);


router.put("/update/:id", userController.update);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUsersById);

module.exports = router;
