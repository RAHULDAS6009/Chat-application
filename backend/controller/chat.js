const Chat = require("../model/chat");
const User = require("../model/user");
const asyncHandler = require("express-async-handler");
//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("User Id params not sent with request");
    return res.sendStatus(400);
  }
  ///from this
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $eleMatch: { $eq: req.user._id } } },
      { users: { $eleMatch: { $eq: req.userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  ///to this code https://chatgpt.com/c/66ef7881-1508-8000-a563-a7bdd562e70c

  if (isChat.length > 0) {
    //checked for empty array undefined thing
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);

      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = asyncHandler((req, res) => {
  Chat.find({ users: { $eleMatch: { $eq: req.user._id } } })
    .populate("users", "-password")
    .populate("groupAdmin", "password")
    .populate("latestMessage")
    .sort({ updateAt: -1 })
    .then((results) => {
      return User.populate(results, {
        path: "latestMessage.sender",
        select: "name pic email",
      });
    })
    .then((populatedResults) => {
      res.status(200).send(populatedResults);
    })
    .catch((error) => {
      res.status(400);
      throw new Error(error.message);
    });
});

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res
      .status(400)
      .send("More than two users required to form a groupChat");
  }
  var users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res
      .status(400)
      .send("More than two users required to from a group Chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

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
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  // Fetch the chat by chatId to check if the logged-in user is the admin
  const chat = await Chat.findById(chatId);

  if (!chat) {
    res.status(404);
    throw new Error("Chat Not Found");
  }

  // Check if the logged-in user is the group admin
  if (chat.groupAdmin.toString() !== req.user._id.toString()) {
    return res.status(403).send("You are not the group admin");
  }

  const removed = await Chat.findByIdAndUpdate(
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

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // Check if the chat exists
  const chat = await Chat.findById(chatId);

  if (!chat) {
    return res.status(404).send("Chat not found");
  }

  // Check if the logged-in user is the group admin
  if (chat.groupAdmin.toString() !== req.user._id.toString()) {
    return res.status(403).send("You are not the group admin");
  }

  // Add the user to the group
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true } // Return the updated chat document
  )
    .populate("users", "-password") // Exclude password from users
    .populate("groupAdmin", "-password"); // Exclude password from groupAdmin

  // Check if the update was successful
  if (!added) {
    return res.status(404).send("Chat not found");
  }

  // Return the updated chat data
  res.json(added);
});

module.exports = {
  accessChat,
  fetchChats,
  removeFromGroup,
  addToGroup,
  renameGroup,
  createGroupChat,
};
