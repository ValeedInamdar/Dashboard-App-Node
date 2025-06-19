const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

exports.login = async function (req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      {
        return res.status(400).json({
          success: false,
          msg: "user does not exists",
        });
      }
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        msg: "wrong password",
      });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(200).json({
      success: true,
      msg: "user logged in successfully",
      token: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong please try again later",
    });
  }
};

exports.register = async function (req, res) {
  try {
    let { firstName, lastName, email, password, role } = req.body;

    const emailCheck = await User.findOne({ email: email });
    if (emailCheck) {
      {
        return res.status(400).json({
          success: false,
          msg: "user already registered",
        });
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role
    });
    await newUser.save();

    if (newUser) {
      res.status(200).send({
        success: true,
        message: "user registered successfully",
        data: newUser,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "unable to register at this moment, please try again later",
      });
    }
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      msg: "something went wrong please try again later",
    });
  }
};
