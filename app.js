const express = require("express");
const cors = require("cors");
require("dotenv").config();
const instance = require("./app/routes/v1/instanceRoutes");
const user = require("./app/routes/v1/userRoutes");
const auth = require("./app/routes/v1/authRoutes");
const admin = require("./app/routes/v1/adminRoutes");
const product = require("./app/routes/v1/productRoutes");

const { authenticateToken } = require("./app/middleware/authMiddleware");
const { dbConnection } = require("./app/services/dbService");
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());
dbConnection();
app.use("/uploads", express.static("app/uploads"));
app.use("/api/v1/instance", instance);
app.use("/api/v1/user", authenticateToken, user);
app.use("/api/v1/auth", auth);
app.use("/api/v1/admin", admin);
app.use("/api/v1/products", authenticateToken, product);

try {
  app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
  });
} catch (error) {
  console.error(error);
}
