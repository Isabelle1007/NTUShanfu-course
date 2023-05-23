require('dotenv').config();
const multer = require('multer');
const { s3Uploadv2 } = require('../utils/s3Service');
// const File = require('../models/file_model');

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.mimetype === 'application/msword') {
        cb(null, true);
    } else {
        cb(new Error("file is not the correct type"), false);
    }
};

const upload = multer({ storage, fileFilter });

const postFile = async (req, res) => {
    try {
        upload.single('file')(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                // Handle Multer errors
                res.status(400).json({ error: err.message });
            } else if (err) {
                // Handle other errors
                res.status(500).json({ error: err.message });
            } else {
                // Upload to S3
                const result = await s3Uploadv2(req.file);
                res.json(result);
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    postFile
};