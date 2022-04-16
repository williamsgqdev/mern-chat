const asyncHandler = require("express-async-handler");
const Chat = require("../model/chatModel");
const User = require("../model/userModel");

const accessChats = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400).json({
      message: "UserId was not passed",
    });
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.status(200).json(isChat[0]);
  } else {
    const newChat = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createChat = await Chat.create(newChat);

      const returnChat = await Chat.findOne({ _id: createChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).json(returnChat);
    } catch (error) {
      res.status(400).json(error);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json(error);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  const { users, name } = req.body;

  if (!users || !name) {
    res.status(400).json({
      message: "Fill all required fields",
    });
  }

  if (users.length < 2) {
    res.status(400).json({
      message: "More than 2 users is needed to create a group chat",
    });
  }

  users.push(req.user._id);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const fetchGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fetchGroupChat);
  } catch (error) {
    res.status(400).json(error);
  }
});

const renameGroupChat = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  if (!chatName || chatName === "") {
    res.status(204).json({
      message: "Fill all required Fields",
    });
  }

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      res.status(400).json({
        message: "Chat not Found",
      });
    }

    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(400).json(error);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  if (!userId || userId === "") {
    res.status(204).json({
      message: "Fill all required Fields",
    });
  }

  try {
    const addUser = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!addUser) {
      res.status(400).json({
        message: "Chat not Found",
      });
    }

    res.status(200).json(addUser);
  } catch (error) {
    res.status(400).json(error);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  if (!userId || userId === "") {
    res.status(204).json({
      message: "Fill all required Fields",
    });
  }

  try {
    const removeUser = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removeUser) {
      res.status(400).json({
        message: "Chat not Found",
      });
    }

    res.status(200).json(removeUser);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = {
  accessChats,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
};
