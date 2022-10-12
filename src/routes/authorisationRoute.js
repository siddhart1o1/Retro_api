const router = require("express").Router();
const Product = require("../models/Product");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authorisation = async (req, res, next) => {
  let token = req.header("Authorization");
  if (!token) token = req.header("authorization");
  if (!token) {
    return res.status(401).send("Access Denied");
  } else {
    try {
      const verified = jwt.verify(token, process.env.ACCESS_TOKEN);
      req.user = verified;
      console.log("verified");
      return next();
    } catch (err) {
      return res.status(400).send("Invalid Token");
    }
  }
};

module.exports = authorisation;
