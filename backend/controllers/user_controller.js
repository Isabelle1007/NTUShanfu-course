require('dotenv').config();
const User = require('../models/user_model');

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

module.exports = {
    getInfoOfUser,
    getAllUsers
};