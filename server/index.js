const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const db = require("./config/db");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const routers = require("./routers");

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const CLIENT_HOST = process.env.CLIENT_HOST;
const io = new Server(server, {
    cors: {
        origin: [CLIENT_HOST, "http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
});

app.set("socketio", io);

app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));

app.use(express.json());

app.use(
    session({
        secret: "123", // Thay thế bằng một khóa bí mật
        resave: false,
        saveUninitialized: false,
    })
);
app.use(cookieParser());

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

db.connect();

routers(app);

// Serve static files from the "uploads" directory
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
    res.send("hello from server!");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`SERVER is running on port ${PORT}`);
});
