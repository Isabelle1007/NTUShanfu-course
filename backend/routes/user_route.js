const router = require('express').Router();

const { wrapAsync } = require('../utils/util');

const { getInfoOfUser, getAllUsers, createNewUser } = require('../controllers/user_controller');

router.route('/').get(wrapAsync(getInfoOfUser))

router.route('/all').get(wrapAsync(getAllUsers))

router.route('/create').post(wrapAsync(createNewUser))

module.exports = router;