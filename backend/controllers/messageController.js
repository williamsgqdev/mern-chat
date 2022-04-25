const asyncHandler = require("express-async-handler");
const Chat = require("../model/chatModel");
const Message = require("../model/messageModel");
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    res.status(400).json({
      message: "Invalid data Passed",
    });
  }

  const createMessage = {
    sender: req.uesr._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(createMessage)
      .populate({
        path: "sender",
        select: "name pic",
      })
      .populate({
        path: "chat",
        populate: {
          path: "users",
          model: "User",
          select: "name pic email",
        },
      });
      
      await Chat.findByIdAndUpdate(chatId ,{
          latestMessage : message
      })
      
    res.status(200).json(message);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = {
  sendMessage,
};
