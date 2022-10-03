const router = require("express").Router();
const Product = require("../models/Product");
const authorisation = require("./authorisationRoute");
require("dotenv").config();

// mew products
router.post("/", authorisation, async (req, res) => {
  try {
    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: req.body.image,
      category: req.body.category,
      country: req.body.country,
      city: req.body.city,
      user: req.user._id,
    });

    data = await newProduct.save();
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get all products
router.get("/", async (req, res) => {
  if (req.query.category) {
    data = await Product.find({ category: req.query.category }).sort(
      "createdAt"
    );
    return res.json(data).status(200);
  } else {
    Product.find()
      .sort("createdAt")
      .then((products) => res.json(products))
      .catch((err) => res.status(400).json("Error: " + err));
  }
});

// get product by id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get user products
router.get("/user/:user", authorisation, async (req, res) => {
  try {
    if (req.params.user !== req.user._id) {
      return res.status(403).json("You can see only your products");
    } else {
      const products = await Product.find({ user: req.params.user });
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update product
router.put("/:id", authorisation, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product.user === req.user._id) {
      await product.updateOne({ $set: req.body });
      res.status(200).json("Product has been updated");
    } else {
      res.status(403).json("You can update only your product");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// like product
router.put("/like/:id", authorisation, async (req, res) => {
  try {
    if (req.body.user._id === req.user._id)
      return res.status(403).json("You can't like your own product");

    const product = await Product.findById(req.params.id);
    if (!product.likes.includes(req.user._id)) {
      await product.updateOne({ $push: { likes: req.user._id } });
      res.status(200).json("The product has been liked");
    } else {
      await product.updateOne({ $pull: { likes: req.user._id } });
      res.status(200).json("The product has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
