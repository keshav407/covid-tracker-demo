const { User } = require("../models/user");

exports.signup = async (req, res) => {
  try {
    let userDetails = {};

    let keysRequired = ["name", "phoneNumber", "pinCode"];

    for (elem of keysRequired) {
      userDetails[elem] = req.body[elem];
    }

    let addUser = new User({
      ...userDetails,
    });

    addUser
      .save()
      .then((resp) => {
        if (resp)
          return res
            .status(200)
            .json({ success: true, body: "User added", userId: resp._id });
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

/* 
No symptoms, No travel history, No contact with covid positive patient - Risk = 5%
Any one symptom, travel history or contact with covid positive patient is true - Risk = 50%
Any two symptoms, travel history or contact with covid positive patient is true - Risk = 75%
Greater than 2 symptoms, travel history or contact with covid positive patient is true - Risk = 95%
*/
exports.updateUserHistory = async (req, res) => {
  try {
    let { userId } = req.body;

    let error = new Error();

    let user = await User.findById(userId);

    if (!user) {
      error.code = "Inavlid Config";
      error.message = "User not found";
      throw error;
    }

    let updateDetails = {};

    let keys = ["symptoms", "travelHistory", "contactWithCovidPatient"];

    for (iter of keys) {
      updateDetails[iter] = req.body[iter];
    }

    await User.findByIdAndUpdate(
      userId,
      {
        ...updateDetails,
      },
      {
        new: true,
      }
    )
      .then((resp) => {
        let riskPerentage = 0;

        if (
          resp.symptoms.length > 2 &&
          resp.travelHistory &&
          resp.contactWithCovidPatient
        )
          riskPerentage = 95;
        else if (
          resp.symptoms.length === 2 &&
          (resp.travelHistory || resp.contactWithCovidPatient)
        )
          riskPerentage = 75;
        else if (
          resp.symptoms.length === 1 &&
          (resp.travelHistory || resp.contactWithCovidPatient)
        )
          riskPerentage = 50;
        else riskPerentage = 5;

        return res
          .status(200)
          .json({ sucess: true, body: `riskPerentage ${riskPerentage}` });
      })
      .catch((err) => {
        return res
          .status(400)
          .json({ sucess: true, body: `Error in updating user record`, err });
      });
  } catch (err) {
    if (err.code === "Inavlid Config") {
      return res.status(400).json({ sucess: false, body: err.message });
    }
    res.render("error");
  }
};
