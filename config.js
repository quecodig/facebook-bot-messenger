const dotenv = require('dotenv').config();

const port = process.env.PORT || 8080;
const tokenMS = process.env.TokenMS;
const tokenWP = process.env.TokenWP;
const numberID = process.env.NumberID;

exports.port = port;
exports.tokenMS = tokenMS;
exports.tokenWP = tokenWP;
exports.numberID = numberID;