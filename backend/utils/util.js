require('dotenv').config();
const { TOKEN_SECRET } = process.env;
const { promisify } = require('util'); // util from native nodejs library
const jwt = require('jsonwebtoken');

const User = require('../models/user_model');

// reference: https://thecodebarbarian.com/80-20-guide-to-express-error-handling
const wrapAsync = (fn) => {
    return function (req, res, next) {
        // Make sure to `.catch()` any errors and pass them along to the `next()`
        // middleware in the chain, in this case the error handler.
        fn(req, res, next);
    };
};

const changeDataFormat = (response) => {
    // Create a new Date object from the response string
    const date = new Date(response);

    // Extract the necessary parts (year, month, day, hours, minutes) from the date object
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);

    // Create the formatted date string
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
    return formattedDate
};

const authentication = () => {
    return async function (req, res, next) {
        let accessToken = req.get('Authorization');
        if (!accessToken) {
            res.status(401).send({ error: 'Unauthorized' });
            return;
        }

        accessToken = accessToken.replace('Bearer ', '');
        if (accessToken == 'null') {
            res.status(401).send({ error: 'Unauthorized' });
            return;
        }

        try {
            req.user = await promisify(jwt.verify)(accessToken, TOKEN_SECRET);
            const userDetail = await User.getInfoByUserAccount(req.user.account);
            if (!userDetail) {
                res.status(403).send({ error: 'Forbidden' });
            } else {
                req.user.id = userDetail.data.id;
                req.user.role = userDetail.data.role;
                next();
            }
            return;
        } catch (err) {
            res.status(403).send({ error: 'Forbidden' });
            return;
        }
    };
};

const findMissingID = (arr1, arr2) => {

    const missingID = [];
  
    for (let i = 0; i < arr1.length; i++) {
      if (!arr2.includes(arr1[i])) {
        missingID.push(arr1[i]);
      }
    }
    
    return missingID;
}

const findNewID = (arr1, arr2) => {

    const newID = [];
  
    for (let i = 0; i < arr2.length; i++) {
      if (!arr1.includes(arr2[i])) {
        newID.push(arr2[i]);
      }
    }
    
    return newID;
}

module.exports = {
    wrapAsync,
    changeDataFormat,
    authentication,
    findMissingID,
    findNewID
};


    