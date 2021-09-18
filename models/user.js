const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },

    phoneNumber: { type: Number },
    pinCode: { type: Number, required:true },

    symptoms: [],
    travelHistory: { type: Boolean, default:false },
    contactWithCovidPatient: { type: Boolean, default:false },
    isPositive: { type: Boolean, default:false},
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model("user", userSchema);
const admin = mongoose.model("admin", userSchema);
module.exports = {
  User: user,
  Admin: admin,
};
