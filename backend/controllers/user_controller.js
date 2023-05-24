require('dotenv').config();
const User = require('../models/user_model');
const Home = require('../models/home_model');

// get data from db
const getInfoOfUser = async (req, res) => {
    const id = req.query.id;
    const data = await User.getInfoByUserId(id);
    res.json(data);
};

const getAllUsers = async (req, res) => {
    const data = await User.getInfoOfAllUsers();
    res.json(data);
};

const createNewUser = async (req, res) => {
    let homeID;
    const getHomeID = await Home.getIdByHomeName(req.body.home);
    if(getHomeID.code != '000')
        return res.json(getHomeID)
    else
        homeID = getHomeID.data.id

    const data = await User.postAnUser(req, homeID);
    res.json(data);
};

module.exports = {
    getInfoOfUser,
    getAllUsers,
    createNewUser
};