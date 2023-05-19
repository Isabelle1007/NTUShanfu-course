require('dotenv').config();
const Curriculum = require('../models/curriculum_model');
const User = require('../models/user_model');
const Home = require('../models/home_model');
const Type = require('../models/type_model');

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

    const body = req.body;

    let authors_id;
    const getUserID = await User.getIdByUserName(body.author);
    if(getUserID.code != '000')
        return res.json(getUserID)
    else
        authors_id = getUserID.data.id

    let homeID;
    const getHomeID = await Home.getIdByHomeName(body.home);
    if(getHomeID.code != '000')
        return res.json(getHomeID)
    else
        homeID = getHomeID.data.id

    let typeID;
    const getTypeID = await Type.getIdByTypeName(body.type);
    if(getTypeID.code != '000')
        return res.json(getTypeID)
    else
        typeID = getTypeID.data.id

    const curriculum = {
        title: body.title,
        author_id_list: authors_id,
        semester: body.semester,
        home_id: homeID,
        type_id: typeID,
        file_url: body.file ? body.file : null,
        last_update: body.last_update
    }

    const createNewCurriculum = await Curriculum.createCurriculum(curriculum);
    res.json(createNewCurriculum)
};

module.exports = {
    getCurricula,
    getCurriculumByHome,
    getCurriculumByType,
    getCurriculumBySemester,
    getCurriculumByKeyword,
    getCurriculumByID,
    getCurriculumByUser,
    postCurriculum
};