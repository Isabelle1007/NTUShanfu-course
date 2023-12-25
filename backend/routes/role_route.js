const router = require('express').Router();

const { wrapAsync } = require('../utils/util');

const { getRoleName } = require('../controllers/role_controller');

router.route('/').get(wrapAsync(getRoleName))

module.exports = router;