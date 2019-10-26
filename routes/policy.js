const express = require('express');
const router = express.Router();
const cors = require('../middleware/cors');
const { verifyUser } = require('../middleware/auth');
const policyServices = require('../services/policy');

router.options('/all', cors.preflight(['GET']));
router.get('/all', cors.simplest, verifyUser, (req, res, next) => {
    const { error, value } = await policyServices.all();
    if (error) next(error);
    else res.return(value);
});

module.exports = router;