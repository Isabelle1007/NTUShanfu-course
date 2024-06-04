const router = require('express').Router();

const { wrapAsync } = require('../utils/util');

const { getSubjects, postNewSubject } = require('../controllers/subject_controller');

router.route('/all').get(wrapAsync(getSubjects))

router.route('/insert').post(wrapAsync(postNewSubject))

module.exports = router;