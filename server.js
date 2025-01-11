require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

const connectDB = require("./db/connect");

app.get("/", (req, res) => {
    res.send("Hii");
});

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URL);
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
};
start();