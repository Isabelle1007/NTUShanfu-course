require('dotenv').config();
const Curriculum = require('../models/curriculum_model');
const User = require('../models/user_model');
const Home = require('../models/home_model');
const Type = require('../models/type_model');

const { readFileFromS3 } = require('../utils/s3Service');

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET_NAME } = process.env;

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
        const cid = createNewCurriculum.data.id
        const filePath = `docx/${createNewCurriculum.data.title}.docx`
        const fileContent = await readFileFromS3(filePath);
        if(fileContent.code === '000'){
            console.log(fileContent)
            const data = {
                "content": fileContent.data.content
            }
            const addContent = await Curriculum.updateCurriculum(cid, data);
            if(addContent.code === '000'){
                createNewCurriculum.data.content = fileContent.data.content
            }else console.log(addContent)
        }else console.log(fileContent)
        return res.json(createNewCurriculum)
    }
};

const getFileContentByID = async (req, res) => {
    const id = req.params.id;
    const data = await Curriculum.getCurriculumByID(id);
    if(data.data){
        const filePath = `docx/${data.data.title}.docx`
        const fileContent = await readFileFromS3(filePath);
        if(fileContent.code === '000'){
            const updateCurriculum = await Curriculum.updateCurriculum(id, 'content', fileContent.data.content);
            res.json(updateCurriculum)
        }
    }else{
        res.json({
            "message": 'Server Response Error',
            "code": "999"
        })
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
        const file_url_word = curri_info.data.file_word
        const deleteResult = await Curriculum.delCurriculum(id, file_url_word);
        res.json(deleteResult)
    }else{
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
    getFileContentByID,
    putCurriculum,
    deleteCurriculum
};