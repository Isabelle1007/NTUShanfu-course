require('dotenv').config();

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
    console.log(formattedDate); // Output: 2023-05-15 03:19
    return formattedDate
};

module.exports = {
    wrapAsync,
    changeDataFormat
};


    