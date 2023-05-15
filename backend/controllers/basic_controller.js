require('dotenv').config();

// welcome to root page
const basic = (req, res) => {
    res.json('Hi, welcome to the backend root page!!!');
};

// healthcheck: OK
const healthcheck = async (req, res, _next) => {
    try {
        res.json('OK');
    } catch (err) {
        res.json(err);
        console.log(err);
    }
};

module.exports = {
    basic,
    healthcheck
};