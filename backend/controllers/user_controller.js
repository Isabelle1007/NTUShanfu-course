require('dotenv').config();

const validator = require('validator');

const User = require('../models/user_model');
const Home = require('../models/home_model');
const Role = require('../models/role_model');

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

// insert data into db
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

// sign up
const signUp = async (req, res) => {
    let { name } = req.body;
    const { role, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({
            "message": "Request Error: name, email and password are required.",
            "code": "001"
        });
    }

    if (!validator.isEmail(email)) {
        return res.json({
            "message": "Request Error: Invalid email format",
            "code": "001"
        });
    }

    name = validator.escape(name);

    const result = await User.signUp(name, User.USER_ROLE[role], email, password);
    if (result.code != "000") {
        return res.json({
            "message": result.message,
            "code": result.code
        });
    }

    const user = result.data;
    if (!user) {
        return res.json({
            "message": "Database Query Error",
            "code": "500"
        });
    }
    const roleName = await Role.getRoleByID(result.data.role_id)
    result.data.role = roleName.data.name
    delete result.data.role_id
    res.json(result);
};

// sign in
const signIn = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({
            "message": 'Request Error: email and password are required.',
            "code": "001",
        });
    }
    try {
        const result = await User.signIn(email, password);
        const roleName = await Role.getRoleByID(result.data.role_id)
        result.data.role = roleName.data.name
        delete result.data.role_id
        return res.json(result)
    } catch (error) {
        return res.json({
            "message": error,
            "code": "999"
        });
    }
};

module.exports = {
    getInfoOfUser,
    getAllUsers,
    createNewUser,
    signUp,
    signIn
};