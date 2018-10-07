const moment = require('moment');

const generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: moment().valueOf()
    };
}

const generateLocationMessage = (from, lantitude, longtitude) => {
    return {
        from,
        url: `https://www.google.com/maps?q=${lantitude},${longtitude}`,
        createdAt: moment().valueOf()
    };
}

module.exports = {generateMessage, generateLocationMessage};