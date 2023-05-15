require('dotenv').config();
const Curriculum = require('../models/curriculum_model');

// get data from db
const getCurriculum = async (req, res) => {
    const data = await Curriculum.getAllCurriculum();
    res.json(data)
};

const getCurriculumWithType = async (req, res) => {
    const type = req.params.type;
    const data = await Curriculum.getCurriculumWithType(type);
    res.json(data);
};

const getCurriculumOfUser = async (req, res) => {
    const id = req.query.uid;
    const data = await Curriculum.getCurriculumByUserId(id);
    res.json(data);
};

// insert data into db
const postCurriculum = async (req, res) => {
    res.json('TBC...')
};

module.exports = {
    getCurriculum,
    getCurriculumWithType,
    getCurriculumOfUser,
    postCurriculum
};