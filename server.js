require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

const connectDB = require("./app/db/connect");
const User = require("./app/models/user.model");
const user_routes = require("./app/routes/user.route");
const logUserActivity = require("./app/middlewares/logUserActivity");

const testJson = require("./test.json");

app.use(express.json());
app.use(cookieParser()); 

app.get("/", (req, res) => {
    res.send("Hii");
});

app.use("/api/users", logUserActivity);
app.use("/api/users", user_routes);

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URL);
        for (let user of testJson) {
            const existingUser = await User.findOne({ email: user.email });
            if (!existingUser) {
                await User.create(user);
            }
        }
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
};
start();