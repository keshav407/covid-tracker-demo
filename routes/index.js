const express = require('express');
const router = express.Router();
const userRoute = require('../routes/user');
const adminRoute = require('../routes/admin');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Udaan test' });
});


router.use('/user', userRoute);

router.use('/admin', adminRoute);


module.exports = router;
