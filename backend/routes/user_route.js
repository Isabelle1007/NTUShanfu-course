const router = require('express').Router();

const { wrapAsync } = require('../utils/util');

const { getInfoOfUser, getAllUsers } = require('../controllers/user_controller');

router.route('/').get(wrapAsync(getInfoOfUser))
router.route('/all').get(wrapAsync(getAllUsers))

module.exports = router;