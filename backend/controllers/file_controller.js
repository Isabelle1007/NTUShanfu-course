require('dotenv').config();
const multer = require('multer');
const { s3Uploadv2, deleteFileFromS3 } = require('../utils/s3Service');
const { getInfoByUserEmail, updateInfoByEmail } = require('../models/user_model');
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

const fileFilter_image = (req, file, cb) => {
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error("File is not of a permitted type (PNG, JPEG, JPG)"), false); // Reject the file
    }
};

const upload_word = multer({ storage, fileFilter_word });
const upload_pdf = multer({ storage, fileFilter_pdf });
const upload_img = multer({ storage, fileFilter_image });

const multerUpload = (uploadType) => {
    return (req, res, next) => {
        uploadType.single('file')(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                res.status(400).json({ error: err.message });
            } else if (err) {
                res.status(500).json({ error: err.message });
            } else {
                next();
            }
        });
    };
};

const postFile = async (req, res) => {
    const type = req.params.type;
    let uploadType;

    switch (type) {
        case 'word':
            uploadType = upload_word;
            break;
        case 'pdf':
            uploadType = upload_pdf;
            break;
        default:
            uploadType = upload_img;
            break;
    }

    try {
        await multerUpload(uploadType)(req, res, async () => {
            const fileType = type === 'word' ? 'docx' : (type === 'pdf' ? 'pdf' : req.body.format);
            const result = await s3Uploadv2(req.file, req.body.name, fileType);
            if (result.code === '000') {
                if(type === 'image'){
                    const url = result.data.response.Location;
                    const userInfo = await getInfoByUserEmail(req.body.user_email);
                    let old_url
                    if(userInfo.code === '000'){
                        old_url = userInfo.data.picture_url;
                    }else{
                        res.json({
                            "message": userInfo.message,
                            "code": "999"
                        });
                    }
                    const updateDb = await updateInfoByEmail(req.body.user_email, { "picture_url": url });
                    if (updateDb.code === '000') {
                        const deleteOldPic = await deleteFileFromS3(old_url);
                        if(deleteOldPic.code === '000'){
                            res.json({
                                "message": "Success",
                                "code": "000",
                            });
                        }else{
                            res.json({
                                "message": deleteOldPic.message,
                                "code": "999"
                            });
                        }
                    } else {
                        res.json({
                            "message": updateDb.message,
                            "code": "999"
                        });
                    }
                }else{
                    res.json({
                        "message": "Success",
                        "code": "000",
                    });
                }
            } else {
                res.json({
                    "message": result.message,
                    "code": "999"
                });
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const getFileUrlByID = async (req, res) => {
    const id = req.params.id
    const data = await File.getUrlByID(id);
    res.json(data)
}

module.exports = {
    postFile,
    getFileUrlByID,
};