require('dotenv').config();
const Role = require('../models/role_model');

// get data from db
const getRoleName = async (req, res) => {
    const { id } = req.body
    const data = await Role.getRoleByID(id);
    res.json(data)
};


module.exports = {
    getRoleName
};