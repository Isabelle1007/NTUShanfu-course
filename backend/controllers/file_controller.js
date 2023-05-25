require('dotenv').config();
const multer = require('multer');
const { s3Uploadv2 } = require('../utils/s3Service');
const File = require('../models/file_model');

const storage = multer.memoryStorage();

const fileFilter_word = (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.mimetype === 'application/msword') {
        cb(null, true);
    } else {
        cb(new Error("file is not the correct type"), false);
    }
};

const fileFilter_pdf = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error("file is not the correct type"), false);
    }
};

const upload_word = multer({ storage, fileFilter_word });
const upload_pdf = multer({ storage, fileFilter_pdf });

const postFile = async (req, res) => {
    const type = req.params.type;
    if(type === 'word'){
        try {
            upload_word.single('file')(req, res, async (err) => {
                console.log('.........................................')
                console.log(req.body)
                console.log('.........................................')
                if (err instanceof multer.MulterError) {
                    // Handle Multer errors
                    res.status(400).json({ error: err.message });
                } else if (err) {
                    // Handle other errors
                    res.status(500).json({ error: err.message });
                } else {
                    // Upload to S3
                    const result = await s3Uploadv2(req.file, req.body.name, "docx");
                    res.json({
                        "message": "Success",
                        "code": "000",
                        "data": {
                            "file_info": result
                        }
                    });
                }
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }else{
        try {
            upload_pdf.single('file')(req, res, async (err) => {
                if (err instanceof multer.MulterError) {
                    // Handle Multer errors
                    res.status(400).json({ error: err.message });
                } else if (err) {
                    // Handle other errors
                    res.status(500).json({ error: err.message });
                } else {
                    // Upload to S3
                    const result = await s3Uploadv2(req.file, req.body.name, "pdf");
                    res.json({
                        "message": "Success",
                        "code": "000",
                        "data": {
                            "file_info": result
                        }
                    });
                }
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    
};

// const getFileUrlByID = async (req, res) => {
//     const id = req.params.id
//     const data = await File.getUrlByID(id);
//     res.json(data)
// }

module.exports = {
    postFile,
    // getFileUrlByID,
};