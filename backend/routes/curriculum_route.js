const router = require('express').Router();

const { wrapAsync } = require('../utils/util');

const { getCurriculum, postCurriculum, getCurriculumWithType, getCurriculumOfUser } = require('../controllers/curriculum_controller');

router.route('/all').get(wrapAsync(getCurriculum))
router.route('/:type').get(wrapAsync(getCurriculumWithType))
router.route('/user/:id').get(wrapAsync(getCurriculumOfUser))

router.route('/upload').post(wrapAsync(postCurriculum))

module.exports = router;