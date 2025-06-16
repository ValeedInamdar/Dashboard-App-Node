const express = require("express");
const cors = require("cors");
require("dotenv").config();
const instance = require("./routes/v1/instance");
const user = require("./routes/v1/user");
const auth = require("./routes/v1/auth");
const admin = require("./routes/v1/admin");
const { authenticateToken } = require("./middleware/authenticate");
const { dbConnection } = require("./services/database");
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());
dbConnection();
app.use("/api/v1/instance", instance);
app.use("/api/v1/users", authenticateToken, user);
app.use("/api/v1/auth", auth);
app.use("/api/v1/admin", admin);

try {
  app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
  });
} catch (error) {
  console.error(error);
}
