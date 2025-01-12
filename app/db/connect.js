const mongoose = require("mongoose");

const connectDB = (uri) => {
    console.log("connected to db");
    return mongoose.connect(uri);
};

module.exports = connectDB;