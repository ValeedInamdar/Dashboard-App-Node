const mongoose = require("mongoose");
require("dotenv").config();
const dbConnection = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URL
    );
    console.log("Mongoose connection successful");
  } catch (error) {
    console.error("Error while connecting to Mongoose", error);
    process.exit(1);
  }
};

module.exports = { dbConnection };
