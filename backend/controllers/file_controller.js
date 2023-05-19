require('dotenv').config();
const File = require('../models/file_model');

// insert file into db
const postFile = async (req, res) => {
    const data = await File.postNewFile();
    res.json(data)
};

module.exports = {
    postFile
};