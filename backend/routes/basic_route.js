const router = require('express').Router();

const { wrapAsync } = require('../utils/util');

const { basic, healthcheck } = require('../controllers/basic_controller');

router.route('/').get(wrapAsync(basic))

router.route('/healthcheck').get(wrapAsync(healthcheck))

module.exports = router;