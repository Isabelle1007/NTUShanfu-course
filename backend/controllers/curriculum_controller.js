require('dotenv').config();

// get data from db
const getCurri = async (req, res) => {
    const data = await Curriculum.getAllCurri();
    res.json(data)
};

module.exports = {
    getCurri
};