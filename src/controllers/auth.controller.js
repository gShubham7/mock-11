const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user.model");
const saltRounds = parseInt(process.env.SALT_ROUNDS);

const signup = async (req, res) => {
  const { email, password } = req.body;
  const token = req.headers["authorization"];

  const user = await UserModel.findOne({ email });
  if (user) {
    return res.status(400).send({ error: "User already exists" });
  }
  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      return res.status(500).send({ error: "Internal server error" });
    }
    try {
      const newUser = await UserModel.create({ email, password: hash });
      return res
        .status(201)
        .send({ message: "Sign Up Successful", user: newUser });
    } catch (err) {
      return res.status(500).send({ error: "Internal server error" });
    }
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }

  bcrypt.compare(password, user.password, async (err, result) => {
    if (err) {
      return res.status(500).send({ error: "Internal server error" });
    }
    if (!result) {
      return res.status(401).send({ error: "Invalid credentials" });
    }
    try {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "6h",
      });
      return res.status(200).send({ message: "Login Successful", token });
    } catch (error) {
      return res.status(401).send({ error: "Invalid credentials" });
    }
  });
};

module.exports = { signup, login };
