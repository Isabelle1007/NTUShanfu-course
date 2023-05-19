require('dotenv').config();
const pool = require('../db')

const postNewFile = async (file) => {
    return {
        "message": "Success",
        "code": "000",
        "data": {
            "file_id": -99,
            "file_url": 'fake'
        }
    }
};

module.exports = {
    postNewFile
};