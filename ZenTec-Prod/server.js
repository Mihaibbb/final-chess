if (process.env.NODE_MODULES !== "production") {
    require("dotenv").config();
}

const express = require("express");
const bodyParser = require("body-parser");
const authRouter = require("./routes/auth");
const privateRouter = require("./routes/private");
const imagesRouter = require("./routes/images");
const adminRouter = require("./routes/admin");
const organisationRouter = require("./routes/organisation");
const userRouter = require("./routes/user");
const connection = require("./db");
const cors = require("cors");
const path = require("path");
const errorHandler = require("./middleware/error");
const crypto = require("crypto");

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get("/test", (req, res) => {
    res.send("Hello");
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/private", privateRouter);
app.use("/api/upload-image", imagesRouter);
app.use("/api/admin", adminRouter);
app.use("/api/organisation", organisationRouter);
app.use("/api/user", userRouter);

// Error Handler
app.use(errorHandler);

io.on("connection", socket => {
    console.log(socket.id);
});

const port = process.env.PORT || 8000;

server.listen(port, () => console.log("Server started " + port));