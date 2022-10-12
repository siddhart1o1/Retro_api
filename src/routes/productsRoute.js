const router = require("express").Router();
const { json } = require("body-parser");
const Product = require("../models/Product");
const User = require("../models/User");

const authorisation = require("./authorisationRoute");
require("dotenv").config();

//search products
router.get("/search", async (req, res) => {
  const query = req.query.query;
  console.log(query);
  if (query) {
    try {
      const products = await Product.find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ],
      });
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

// mew products
router.post("/", authorisation, async (req, res) => {
  console.log("post product  ----------");
  console.log(req.body.image);
  console.log("images product  ----------");

  try {
    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      country: req.body.country,
      city: req.body.city,
      user: req.user._id,
      thumbnail: req.body.thumbnail,
      images: req.body.images,
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { products: newProduct._id },
    });

    data = await newProduct.save();
    res.status(200).json({
      data,
      message: "Product added successfully",
      Array_type: req.body.image,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get all products
router.get("/", async (req, res) => {
  if (req.query.category && req.query.category != "Newest") {
    if (req.query.limit) {
      data = await Product.find({ category: req.query.category })
        .sort("createdAt")
        .limit(req.query.limit);
    } else {
      data = await Product.find({ category: req.query.category })
        .sort("createdAt")
        .limit(20);
    }
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
    const user = await User.findById(product.user._id);
    product.user = user;
    res.status(200).json(
      product
      // user: user,
    );
  } catch (err) {
    console.log(err);
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
    const product = await Product.findById(req.params.id);
    if (!product.likes.includes(req.user._id)) {
      await product.updateOne({ $push: { likes: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, {
        $push: { likedProducts: product._id },
      });

      res.status(200).json("The product has been liked");
    } else {
      await product.updateOne({ $pull: { likes: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { likedProducts: product._id },
      });

      res.status(200).json("The product has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// get liked product
router.get("/user/liked", authorisation, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const products = await Product.find({ _id: { $in: user.likedProducts } });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get user products
router.get("/user/products", authorisation, async (req, res) => {
  try {
    const userProducts = await Product.find({ user: req.user._id });
    res.status(200).json(userProducts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
