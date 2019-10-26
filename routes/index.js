var express = require('express');
var router = express.Router();
const { verifyUser } = require('../middleware/auth');

/* GET home page. */
router.get('/', verifyUser, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
