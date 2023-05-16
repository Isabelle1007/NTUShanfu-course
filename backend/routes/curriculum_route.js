const router = require('express').Router();

const { wrapAsync } = require('../utils/util');

const { getCurricula, getCurriculumByHome, getCurriculumByType, getCurriculumByUser, getCurriculumByKeyword, postCurriculum} = require('../controllers/curriculum_controller');

router.route('/all').get(wrapAsync(getCurricula))
router.route('/:home').get(wrapAsync(getCurriculumByHome))
router.route('/type/:type').get(wrapAsync(getCurriculumByType))
router.route('/user/:id').get(wrapAsync(getCurriculumByUser))
router.route('/search/:kw').get(wrapAsync(getCurriculumByKeyword))

router.route('/upload').post(wrapAsync(postCurriculum))

module.exports = router;