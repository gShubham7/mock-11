const express = require("express");
const app = express.Router();
const { signup, login } = require("../controllers/auth.controller");

app.use("/signup", signup);
app.use("/login", login);

module.exports = app;
