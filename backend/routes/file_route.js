const router = require('express').Router();

const { wrapAsync } = require('../utils/util');

const { postFile, getFileUrlByID } = require('../controllers/file_controller');

router.get('/id/:id', wrapAsync(getFileUrlByID));

router.post('/upload/subject/:subject', wrapAsync(postFile));

module.exports = router;