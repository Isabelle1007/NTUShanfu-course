const router = require('express').Router();

const { wrapAsync } = require('../utils/util');

const { getCurricula, getCurriculumByHome, getCurriculumBySubject, getCurriculumBySemester, getCurriculumByKeyword, getCurriculumByID, getCurriculumByUser, postCurriculum, putCurriculum, deleteCurriculum } = require('../controllers/curriculum_controller');

router.route('/all').get(wrapAsync(getCurricula))
router.route('/home/:home').get(wrapAsync(getCurriculumByHome))
router.route('/subject/:subject').get(wrapAsync(getCurriculumBySubject))
router.route('/semester/:semester').get(wrapAsync(getCurriculumBySemester))
router.route('/search/:kw').get(wrapAsync(getCurriculumByKeyword))
router.route('/id/:id').get(wrapAsync(getCurriculumByID))
router.route('/user/:id').get(wrapAsync(getCurriculumByUser))

router.route('/upload').post(wrapAsync(postCurriculum))

router.route('/update/id/:id').put(wrapAsync(putCurriculum))

router.route('/delete/id/:id').delete(wrapAsync(deleteCurriculum))

module.exports = router;