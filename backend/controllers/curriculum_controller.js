require('dotenv').config();
const fsPromises = require('fs').promises;
const multer = require('multer');

const Curriculum = require('../models/curriculum_model');
const User = require('../models/user_model');
const Home = require('../models/home_model');
const Type = require('../models/type_model');

const { readFileFromS3, s3Uploadv2, deleteFileFromS3 } = require('../utils/s3Service');
const { createWordCloudImg } = require('../utils/wordCloud');

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET_NAME } = process.env;

const storage = multer.memoryStorage();

const fileFilter_image = (req, file, cb) => {
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error("File is not of a permitted type (PNG, JPEG, JPG)"), false); // Reject the file
    }
};

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

// get data from db
const getCurricula = async (req, res) => {
    const data = await Curriculum.getCurricula();
    res.json(data)
};

const getCurriculumByHome = async (req, res) => {
    const home = req.params.home;
    const data = await Curriculum.getCurriculumByHome(home);
    res.json(data)
};

const getCurriculumByType = async (req, res) => {
    const type = req.params.type;
    const data = await Curriculum.getCurriculumByType(type);
    res.json(data);
};

const getCurriculumBySemester = async (req, res) => {
    const semester = req.params.semester;
    const data = await Curriculum.getCurriculumBySemester(semester);
    res.json(data);
};

const getCurriculumByUser = async (req, res) => {
    const userId = req.params.id;
    const data = await Curriculum.getCurriculumByUserId(userId);
    res.json(data);
};

const getCurriculumByKeyword = async (req, res) => {
    const keyword = req.params.kw;
    const data = await Curriculum.getCurriculumByKeyWord(keyword);
    res.json(data);
};

const getCurriculumByID = async (req, res) => {
    const id = req.params.id;
    const data = await Curriculum.getCurriculumByID(id);
    res.json(data);
};

// insert data into db
const postCurriculum = async (req, res) => {
    const { title, author, semester, home, type, last_update, file_word, file_pdf } = req.body
    let authors_id;
    const getUserID = await User.getIdByUserName(author);
    if(getUserID.code != '000')
        return res.json(getUserID)
    else
        authors_id = getUserID.data.id

    let homeID;
    const getHomeID = await Home.getIdByHomeName(home);
    if(getHomeID.code != '000')
        return res.json(getHomeID)
    else
        homeID = getHomeID.data.id

    let typeID;
    const getTypeID = await Type.getIdByTypeName(type);
    if(getTypeID.code != '000')
        return res.json(getTypeID)
    else
        typeID = getTypeID.data.id

    const curriculum = {
        title: title,
        author_id_list: authors_id,
        semester: semester,
        home_id: homeID,
        type_id: typeID,
        file_url_word: file_word ? file_word : null,
        file_url_pdf: file_pdf ? file_pdf : null,
        last_update: last_update
    }
    
    const createNewCurriculum = await Curriculum.createCurriculum(curriculum);
    if(createNewCurriculum.code === '000'){
        // Extract content in word file to insert into db
        const cid = createNewCurriculum.data.id
        const filePath = `docx/${createNewCurriculum.data.title}.docx`
        const fileContent = await readFileFromS3(filePath);
        if(fileContent.code === '000'){
            const data = {
                "content": fileContent.data.content
            }
            const addContent = await Curriculum.updateCurriculum(cid, data);
            if(addContent.code === '000'){
                createNewCurriculum.data.content = fileContent.data.content
                // Create a word cloud image
                const wordCloudResponse = await createWordCloudImg(cid, fileContent.data.content);
                const imagePath = wordCloudResponse.data.location; // The path of the generated image
                try {
                    const imageBuffer = await fsPromises.readFile(imagePath); // Read the image file
                    const fileObject = {
                        buffer: imageBuffer,
                        name: wordCloudResponse.data.image_name.split('.')[0], // Name without extension
                        type: 'png' // Assuming the file type is png
                    };
        
                    const s3UploadResponse = await s3Uploadv2(fileObject, fileObject.name, fileObject.type);
                    if (s3UploadResponse.code === '000') {
                        // Delete the local file after successful upload
                        await fsPromises.unlink(imagePath);

                        // Update the curriculum with the image URL
                        const url = s3UploadResponse.data.response.Location;
                        const updateDb = await Curriculum.updateCurriculum(cid, { "pic_url": url });
                        return res.json(updateDb)
                    } else {
                        return res.json(s3UploadResponse)
                    }
                } catch (err) {
                    console.error("\nFailed to uploading to S3");
                    return res.status(500).json({ error: err.message });
                }
            }else{
                console.log(addContent)
                return res.json(addContent)
            }
        }else{
            console.log(fileContent)
            return res.json(fileContent)
        }
    }
};

const putCurriculum = async (req, res) => {
    const id = req.params.id;
    const curriculumUpdates = {};

    if (req.body.title) curriculumUpdates.title = req.body.title;
    
    if (req.body.author) {
        const getUserID = await User.getIdByUserName(req.body.author);
        if (getUserID.code != '000') return res.json(getUserID);
        curriculumUpdates.author_id_list = getUserID.data.id;
    }

    if (req.body.semester) curriculumUpdates.semester = req.body.semester;

    if (req.body.home) {
        const getHomeID = await Home.getIdByHomeName(req.body.home);
        if (getHomeID.code != '000') return res.json(getHomeID);
        curriculumUpdates.home_id = getHomeID.data.id;
    }

    if (req.body.type) {
        const getTypeID = await Type.getIdByTypeName(req.body.type);
        if (getTypeID.code != '000') return res.json(getTypeID);
        curriculumUpdates.type_id = getTypeID.data.id;
    }

    if (req.body.last_update) curriculumUpdates.last_update = req.body.last_update;

    const data = await Curriculum.updateCurriculum(id, curriculumUpdates);
    res.json(data);
}

const deleteCurriculum = async (req, res) => {
    const id = req.params.id;
    const curri_info = await Curriculum.getCurriculumByID(id);
    if(curri_info.code === "000"){
        const deleteResult = await Curriculum.delCurriculum(id, curri_info.data.file_word);
        if(deleteResult.code === "000"){
            // Delete files in S3
            const url_docx = curri_info.data.file_word
            const url_pdf = curri_info.data.file_pdf
            const deleteFileInS3 = await deleteFileFromS3([url_docx, url_pdf]);
            if(deleteFileInS3.code != '000') console.log(deleteFileInS3)
            res.json(deleteFileInS3)
        }else{
            console.log(deleteResult)
            res.json(deleteResult)
        }
    }else{
        console.log(curri_info)
        res.json(curri_info)
    }
}

module.exports = {
    getCurricula,
    getCurriculumByHome,
    getCurriculumByType,
    getCurriculumBySemester,
    getCurriculumByKeyword,
    getCurriculumByID,
    getCurriculumByUser,
    postCurriculum,
    putCurriculum,
    deleteCurriculum
};