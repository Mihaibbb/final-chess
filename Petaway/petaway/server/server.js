if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const connection = require('./db');
const signupRoutes = require('./routes/signup');
const signinRoutes = require('./routes/signin');

// database connection 
connection();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/sign-up", signupRoutes);
app.use("/sign-in", signinRoutes);



server.listen(8080, () => console.log('Server listen on 8080!'));