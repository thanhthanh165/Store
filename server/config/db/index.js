const mongoose = require("mongoose");
const MONGODB_URL = process.env.MONGODB_URL;
console.log(MONGODB_URL);
async function connect() {
    mongoose.set("strictQuery", false);
    mongoose
        .connect(MONGODB_URL, { useNewUrlParser: true })
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => console.error("Could not connect to MongoDB", err));
}

module.exports = { connect };
