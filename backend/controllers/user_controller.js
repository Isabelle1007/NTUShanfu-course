require('dotenv').config();

const validator = require('validator');

const User = require('../models/user_model');
const Home = require('../models/home_model');
const Role = require('../models/role_model');
const Group = require('../models/group_model');

// get data from db
const getInfoOfUser = async (req, res) => {
    const id = req.query.id;
    const email = req.body.email
    let data;
    if(id) data = await User.getInfoByUserId(id);
    if(email) data = await User.getInfoByUserEmail(email);
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
    const { role, email, password, picture_url, home, group, join_semester, gender, birthday, department, student_id } = req.body;

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

    const result = await User.signUp(name, User.USER_ROLE[role], email, password, picture_url, home, group, join_semester, gender, birthday, department, student_id);
    if (result.code != "000") return res.json(result);

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
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({
            "message": 'Request Error: email and password are required.',
            "code": "001",
        });
    }
    try {
        const result = await User.login(email, password);
        if (result.code != "000") 
            return res.json(result);
        else{
            const roleName = await Role.getRoleByID(result.data.role_id)
            result.data.role = roleName.data.name
            delete result.data.role_id
            return res.json(result)
        }
    } catch (error) {
        return res.json({
            "message": error,
            "code": "999"
        });
    }
};

const getUserProfile = async (req, res) => {
    const userProfile = await User.getInfoByUserEmail(req.user.email);
    res.json(userProfile);
    return;
}

const updateProfile = async (req, res) => {
    const { name, home, group, join_semester, gender, department } = req.body;
    const profile = {};

    if (name) profile.u_name = name;
    
    if (home) {
        const getHomeID = await Home.getIdByHomeName(home);
        if (getHomeID.code != '000') return res.json(getHomeID);
        profile.home_id = getHomeID.data.id;
    }

    if (group) {
        const getGroupID = await Group.getIdByGroupName(group);
        if (getGroupID.code != '000') return res.json(getGroupID);
        profile.group_id = getGroupID.data.id;
    }

    if (join_semester) profile.join_semester = join_semester;
    if (gender) profile.gender = gender === "男" ? "M" : "F";
    if (department) profile.department = department;

    // Ensure there's at least one field to update
    if (Object.keys(profile).length === 0) {
        return res.status(400).json({ message: "No fields provided for update." });
    }

    const updatedUserProfile = await User.updateInfoByEmail(req.user.email, profile);
    res.json(updatedUserProfile);
}


module.exports = {
    getInfoOfUser,
    getAllUsers,
    createNewUser,
    signUp,
    login,
    getUserProfile,
    updateProfile
};