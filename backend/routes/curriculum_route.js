const router = require('express').Router();

const { wrapAsync } = require('../utils/util');

const { getCurricula, getCurriculumByHome, getCurriculumByType, getCurriculumBySemester, getCurriculumByKeyword, getCurriculumByID, getCurriculumByUser, postCurriculum, getFileContentByID, putCurriculum } = require('../controllers/curriculum_controller');

router.route('/all').get(wrapAsync(getCurricula))
router.route('/home/:home').get(wrapAsync(getCurriculumByHome))
router.route('/type/:type').get(wrapAsync(getCurriculumByType))
router.route('/semester/:semester').get(wrapAsync(getCurriculumBySemester))
router.route('/search/:kw').get(wrapAsync(getCurriculumByKeyword))
router.route('/id/:id').get(wrapAsync(getCurriculumByID))
router.route('/user/:id').get(wrapAsync(getCurriculumByUser))
router.route('/fileContent/id/:id').get(wrapAsync(getFileContentByID))

router.route('/upload').post(wrapAsync(postCurriculum))

router.route('/update/id/:id').put(wrapAsync(putCurriculum))

module.exports = router;