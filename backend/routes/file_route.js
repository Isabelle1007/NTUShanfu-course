const router = require('express').Router();

const { wrapAsync } = require('../utils/util');

const { postFile } = require('../controllers/file_controller');

// router.get('/id/:id', wrapAsync(getFileUrlByID));

router.post('/upload/type/:type', wrapAsync(postFile));

module.exports = router;