const dotenv = require('dotenv').config();

exports.port = process.env.PORT || 8080;
exports.TokenValid = process.env.TokenValid;
exports.tokenMS = process.env.TokenMS;
exports.tokenWP = process.env.TokenWP;
exports.numberID = process.env.NumberID;