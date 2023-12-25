require('dotenv').config();
const Home = require('../models/home_model');

// get data from db
const getHomes = async (req, res) => {
    const data = await Home.getAllHomeName();
    res.json(data)
};

// insert data into db
const postNewHome = async (req, res) => {
    res.json('TBC...')
};

module.exports = {
    getHomes,
    postNewHome
};