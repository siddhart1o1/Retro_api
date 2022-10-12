const router = require("express").Router();
const Product = require("../models/Product");
const User = require("../models/User");
const Chat = require("../models/Chat");
const Messages = require("../models/Messages");
const authorisation = require("./authorisationRoute");
const { json } = require("body-parser");
require("dotenv").config();

// Create a new chat
router.post("/", authorisation, async (req, res) => {
  console.log("req.body", req.body);
  let ChatData = await Chat.findOne({
    members: { $all: [req.user._id, req.body.receiverId] },
    product: req.body.productId,
  });
  if (ChatData) {
    return res.status(200).json(ChatData);
  } else {
    ChatData = {
      members: [req.user._id, req.body.receiverId],
      product: req.body.productId,
    };
    const newChat = new Chat(ChatData);
    try {
      const savedChat = await newChat.save();
      res.status(200).json(savedChat);
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

router.get("/getchat/:id", authorisation, async (req, res) => {
  const chatId = req.params.id;
  try {
    const chat = await Chat.findById(chatId);
    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/message/:chatId", authorisation, async (req, res) => {
  try {
    const messages = await Messages.find({
      chatId: req.params.chatId,
    });
    for (let i = 0; i < messages.length; i++) {
      const user = await User.findById(messages[i].sender);
      messages[i].sender = user;
    }
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

//send message
router.post("/message", authorisation, async (req, res) => {
  const messageData = {
    sender: req.user._id,
    message: req.body.message,
    chatId: req.body.chatId,
  };
  const newMessage = new Messages(messageData);
  try {
    const savedMessage = await newMessage.save();

    //update chat updated date
    const chat = await Chat.findById(req.body.chatId);
    chat.updatedAt = Date.now();
    await chat.save();

    res.status(200).json(savedMessage);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get all user chats
router.get("/userchats", authorisation, async (req, res) => {
  try {
    let chats = await Chat.find({
      members: { $in: [req.user._id] },
    });
    for (let i = 0; i < chats.length; i++) {
      const product = await Product.findById(chats[i].product);
      chats[i].product = product;
    }
    for (let i = 0; i < chats.length; i++) {
      const user = await User.findById(chats[i].product.user);
      chats[i].product.user = user;
    }

    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
