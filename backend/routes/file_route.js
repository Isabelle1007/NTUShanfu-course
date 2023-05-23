const router = require('express').Router();

const { wrapAsync } = require('../utils/util');

const { postFile } = require('../controllers/file_controller');

router.post('/upload', wrapAsync(postFile));

module.exports = router;