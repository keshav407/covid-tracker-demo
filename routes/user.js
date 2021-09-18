const express = require('express');

const router = express.Router();

const controller = require('../controllers/user.controller')
router.route('/signup').post(controller.signup)

router.route('/update-history').patch(controller.updateUserHistory)
module.exports = router;
