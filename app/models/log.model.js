const mongoose = require("mongoose");


const logSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    action: {
        type: String,
        required: true,
    },
    ipAddress: {
        type : String,
    },
    userAgent: {
        type : String,
    },
});

module.exports = mongoose.model('Log', logSchema);
