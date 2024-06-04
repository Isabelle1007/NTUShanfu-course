require('dotenv').config();
const Subject = require('../models/subject_model');

// get data from db
const getSubjects = async (req, res) => {
    const data = await Subject.getAllSubjectName();
    res.json(data)
};

// insert data into db
const postNewSubject = async (req, res) => {
    res.json('TBC...')
};

module.exports = {
    getSubjects,
    postNewSubject
};