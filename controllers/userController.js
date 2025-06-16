const User = require("../models/user");

exports.deleteUser = async function (req, res) {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    console.log(user);

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "user does not exists with provided id",
      });
    }
    return res.status(200).json({
      success: true,
      msg: "user deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong please try again later",
    });
  }
};

exports.updateUser = async function (req, res) {
  try {
    const id = req.params.id;
    const body = req.body;
    const user = await User.findByIdAndUpdate(id, body, { new: true });
    console.log(user);

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "user does not exists with provided id",
      });
    }
    return res.status(201).json({
      success: true,
      msg: "user updated successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong please try again later",
    });
  }
};

exports.getUsers = async function (req, res) {
  try {
    const userList = await User.find({});
    return res.status(200).json({
      success: true,
      msg: "user list fetched successfully",
      data: userList,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong please try again later",
    });
  }
};

exports.getUsersById = async function (req, res) {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "user does not exists",
      });
    }
    return res.status(200).json({
      success: true,
      msg: "user fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong please try again later",
    });
  }
};
