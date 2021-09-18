const express = require("express");

const router = express.Router();

const controller = require("../controllers/admin.controller");

router.route("/signup").post(controller.signup);
router.route("/updateHistory").patch(controller.updateUserRecord);
router.route("/zone").get(controller.getZoneInfo);

module.exports = router;
