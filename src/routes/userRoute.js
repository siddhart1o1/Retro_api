const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authorisation = require("./authorisationRoute");
require("dotenv").config();

router.post("/register", async (req, res) => {
  try {
    //check if email exist
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
      return res.status(400).json("Email already exists");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        country: req.body.country,
        city: req.body.city,
      });
      const user = await newUser.save();
      res.status(200).json(user._id);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    // if user exists
    if (user) {
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (validPassword) {
        // create and assign a token
        const accessToken = jwt.sign(
          { _id: user._id },
          process.env.ACCESS_TOKEN
        );
        res.status(200).json({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          country: user.country,
          city: user.city,
          accessToken: accessToken,
          likedProducts: user.likedProducts,
        });
      } else {
        res.status(400).json("Wrong password");
      }
    } else {
      res.status(400).json("User not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put("/update", authorisation, async (req, res) => {
  if (req.user._id === req.body._id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword;
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(req.body._id, {
        $set: req.body,
      });
      res.status(200).json(updatedUser);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can only update your account");
  }
});

module.exports = router;
