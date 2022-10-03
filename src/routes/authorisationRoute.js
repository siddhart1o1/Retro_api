const router = require("express").Router();
const Product = require("../models/Product");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authorisation = async (req, res, next) => {
  const token = req.header("accessToken");
  console.log("checking auth");

  if (!token) return res.status(401).send("Access Denied");
  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

module.exports = authorisation;
