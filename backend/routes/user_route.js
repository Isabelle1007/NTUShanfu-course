const router = require('express').Router();

const { wrapAsync } = require('../utils/util');

const { getInfoOfUser, getAllUsers, createNewUser, signUp, signIn } = require('../controllers/user_controller');

router.route('/').get(wrapAsync(getInfoOfUser))

router.route('/all').get(wrapAsync(getAllUsers))

router.route('/create').post(wrapAsync(createNewUser))

router.route('/signup').post(wrapAsync(signUp))
router.route('/signin').post(wrapAsync(signIn))

module.exports = router;