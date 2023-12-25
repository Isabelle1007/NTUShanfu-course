require('dotenv').config();
const Type = require('../models/type_model');

// get data from db
const getTypes = async (req, res) => {
    const data = await Type.getAllTypeName();
    res.json(data)
};

// insert data into db
const postNewType = async (req, res) => {
    res.json('TBC...')
};

module.exports = {
    getTypes,
    postNewType
};