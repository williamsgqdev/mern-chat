const asyncHandler = require("express-async-handler");
const Chat = require("../model/chatModel");
const Message = require("../model/messageModel");
const User = require("../model/userModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    res.status(400).json({
      message: "Invalid data Passed",
    });
  }

  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.status(200).json(message);
  } catch (error) {
    res.status(400).json(error);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const message = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.status(200).json(message);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = {
  sendMessage,
  allMessages,
};
