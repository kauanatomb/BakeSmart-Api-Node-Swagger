const dotenv = require('dotenv');
dotenv.config();

exports.mongoDBURL = process.env.MONGODB_URI;