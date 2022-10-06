const router = require("express").Router();
const Product = require("../models/Product");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authorisation = async (req, res, next) => {
  console.log("authorisation");
  console.log("------------------------------");
  console.log(req.header("Authorization"));
  console.log("------------------------------");

  let token = req.header("Authorization");
  if (!token) token = req.header("authorization");
  if (!token) return res.status(401).send("Access Denied");
  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.user = verified;
    console.log("verified");
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

module.exports = authorisation;
