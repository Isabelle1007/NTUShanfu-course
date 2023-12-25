const router = require('express').Router();

const { wrapAsync } = require('../utils/util');

const { getTypes, postNewType } = require('../controllers/type_controller');

router.route('/all').get(wrapAsync(getTypes))

router.route('/insert').post(wrapAsync(postNewType))

module.exports = router;