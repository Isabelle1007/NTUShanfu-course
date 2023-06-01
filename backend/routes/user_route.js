const router = require('express').Router();

const { wrapAsync, authentication } = require('../utils/util');

const { getInfoOfUser, getAllUsers, createNewUser, signUp, login, getUserProfile, updateProfile } = require('../controllers/user_controller');

router.route('/').get(wrapAsync(getInfoOfUser))
router.route('/all').get(wrapAsync(getAllUsers))
router.route('/profile').get(authentication(), wrapAsync(getUserProfile))

router.route('/create').post(wrapAsync(createNewUser))
router.route('/signup').post(wrapAsync(signUp))
router.route('/login').post(wrapAsync(login))

router.route('/edit').put(authentication(), wrapAsync(updateProfile))

module.exports = router;