const user = require("../models/user");
const { Admin, User } = require("../models/user");

const mongoose = require("mongoose");
const ObjectId = mongoose.ObjectId;
exports.signup = async (req, res) => {
  try {
    let userDetails = {};

    let keysRequired = ["name", "phoneNumber", "pinCode"];

    for (elem of keysRequired) {
      userDetails[elem] = req.body[elem];
    }

    let addAdmin = new Admin({
      ...userDetails,
    });

    addAdmin
      .save()
      .then((resp) => {
        if (resp)
          return res
            .status(200)
            .json({ success: true, body: "Admin added", userId: resp._id });
      })
      .catch((err) => {
        return res
          .status(400)
          .json({ sucess: false, body: "Error in adding user", err });
      });
  } catch (err) {
    res.render("error");
  }
};

exports.updateUserRecord = async (req, res) => {
  try {
    let { adminId, userId, result } = req.body;

    result = result.trim();

    let error = new Error();

    let admin = await Admin.findById(adminId);

    if (!admin) {
      error.code = "Inavlid Config";
      error.message = "Admin not found";
      throw error;
    }

    if (!userId) {
      error.code = "Inavlid Config";
      error.message = "Please enter userId";
      throw error;
    }

    await User.findByIdAndUpdate(
      userId,
      {
        isPositive: result
          ? result === "positive"
            ? true
            : result === "negative"
            ? false
            : user.isPositive
          : user.isPositive,
      },
      {
        new: true,
      }
    )
      .then((resp) => {
          
        if (resp)
          return res
            .status(200)
            .json({ sucess: true, body: `updated ${resp.isPositive}`, response:resp });
      })
      .catch((err) => {
        return res
          .status(400)
          .json({ sucess: true, body: `Error in updating user record`, err });
      });
  } catch (err) {
    if (err.code === "Inavlid Config") {
      return res.status(400).json({ sucess: false, body: err.message });
    } else {
      res.render("error");
    }
  }
};

exports.getZoneInfo = async (req, res) => {
  try {
    let { pinCode } = req.query;

    let error = new Error();

    if (!pinCode) {
      error.code = "Inavlid Config";
      error.message = "Please enter the pinCode of the area";
      throw error;
    }

    //positive users length
    let positiveUsers = await User.find({ pinCode: pinCode, isPositive: true });

    //negative users length
    // let negativeUsers = await User.find({pinCode:pinCode, isPositive:false});

    console.log("length", positiveUsers.length);

    let zone = null;

    if (positiveUsers.length < 5) zone = "ORANGE";
    else zone = "RED";

    let response = {
      numCases: positiveUsers.length,
      zoneType: zone,
    };

    return res.status(200).json({ sucess: true, body: response });
  } catch (err) {
    if (err.code === "Inavlid Config") {
      return res.status(400).json({ sucess: false, body: err.message });
    }

    res.render("error");
  }
};
