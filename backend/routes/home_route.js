const router = require('express').Router();

const { wrapAsync } = require('../utils/util');

const { getHomes, postNewHome } = require('../controllers/home_controller');

router.route('/all').get(wrapAsync(getHomes))

router.route('/insert').post(wrapAsync(postNewHome))

module.exports = router;