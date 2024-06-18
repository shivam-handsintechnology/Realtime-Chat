import Chat from '../models/chatModel.js';
import user from '../models/userModel.js';

export const accessChats = async (req, res) => {
  const { userId } = req.body;
  if (!userId) res.send({ message: "Provide User's Id" });
  let chatExists = await Chat.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: userId } } },
      { users: { $elemMatch: { $eq: req.rootUserId } } },
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage');
  chatExists = await user.populate(chatExists, {
    path: 'latestMessage.sender',
    select: 'name email profilePic',
  });
  if (chatExists.length > 0) {
    return res.status(200).send(chatExists[0]);
  } else {
    let data = {
      chatName: 'sender',
      users: [userId, req.rootUserId],
      isGroup: false,
    };
    try {
      const newChat = await Chat.create(data);
      const chat = await Chat.find({ _id: newChat._id }).populate(
        'users',
        '-password'
      );
      return res.status(200).json(chat);
    } catch (error) {
      return res.status(500).send(error);
    }
  }
};
export const myChats = async (req, res) => {
  const userId = req.rootUserId
  if (!userId) res.send({ message: "Provide User's Id" });
  let chatExists = await Chat.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: req.rootUserId } } },
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage');
  chatExists = await user.populate(chatExists, {
    path: 'latestMessage.sender',
    select: 'name email profilePic',
  });
  if (chatExists.length > 0) {
    return res.status(200).send(chatExists[0]);
  } else {
    let data = {
      chatName: 'sender',
      users: [req.rootUserId],
      isGroup: false,
    };
    try {
      const newChat = await Chat.create(data);
      const chat = await Chat.find({ _id: newChat._id }).populate(
        'users',
        '-password'
      );
      return res.status(200).json(chat);
    } catch (error) {
      return res.status(500).send(error);
    }
  }
};
export const fetchAllChats = async (req, res) => {
  try {

    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.rootUserId } },
    })
      .populate('users')
      .populate('latestMessage')
      .populate('groupAdmin')
      .sort({ updatedAt: -1 });
    const finalChats = await user.populate(chats, {
      path: 'latestMessage.sender',
      select: 'name email profilePic',
    });
    return res.status(200).json(finalChats);
  } catch (error) {
    return res.status(500).send(error);
    console.log(error);
  }
};
export const creatGroup = async (req, res) => {
  const { chatName, users } = req.body;
  if (!chatName || !users) {
    return res.status(400).json({ message: 'Please fill the fields' });
  }
  const parsedUsers = JSON.parse(users);
  if (parsedUsers.length < 2)
    res.send(400).send('Group should contain more than 2 users');
  parsedUsers.push(req.rootUser);
  try {
    const chat = await Chat.create({
      chatName: chatName,
      users: parsedUsers,
      isGroup: true,
      groupAdmin: req.rootUserId,
    });
    const createdChat = await Chat.findOne({ _id: chat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');
    //return res.status(200).json(createdChat);
    res.send(createdChat);
  } catch (error) {
    res.sendStatus(500);
  }
};
export const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  if (!chatId || !chatName)
    return res.status(400).send('Provide Chat id and Chat name');
  try {
    const chat = await Chat.findByIdAndUpdate(chatId, {
      $set: { chatName },
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');
    if (!chat) return res.status(404);
    return res.status(200).send(chat);
  } catch (error) {
    return res.status(500).send(error);
    console.log(error);
  }
};
export const addToGroup = async (req, res) => {
  const { userId, chatId } = req.body;
  const existing = await Chat.findOne({ _id: chatId });
  if (!existing.users.includes(userId)) {
    const chat = await Chat.findByIdAndUpdate(chatId, {
      $push: { users: userId },
    })
      .populate('groupAdmin', '-password')
      .populate('users', '-password');
    if (!chat) return res.status(404);
    return res.status(200).send(chat);
  } else {
    return res.status(409).send('user already exists');
  }
};
export const removeFromGroup = async (req, res) => {
  const { userId, chatId } = req.body;
  const existing = await Chat.findOne({ _id: chatId });
  if (existing.users.includes(userId)) {
    Chat.findByIdAndUpdate(chatId, {
      $pull: { users: userId },
    })
      .populate('groupAdmin', '-password')
      .populate('users', '-password')
      .then((e) => { return res.status(200).send(e) })
      .catch((e) => { return res.status(404) });
  } else {
    return res.status(409).send('user doesnt exists');
  }
};
export const removeContact = async (req, res) => { };
