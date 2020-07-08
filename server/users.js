const users = [];
// const rooms = [];

const addUser = ({ id, phone, name, chat }) => {
  name = name.trim().toLowerCase();
  chat = chat.trim().toLowerCase();

  const existingUser = users.find((user) => user.chat === chat && user.phone === phone);

  if (!phone || !chat) return { error: "Phone and chat are required." };
  if (existingUser) return { error: "Phone is used." };

  const user = { id, name, phone, chat };
  users.push(user);

  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

// finds user info by socket.id
const getUser = (id) => users.find((user) => user.id === id);

const getUsersInChat = (chat) => users.filter((user) => user.chat === chat);

// const addUser = ({ id, name, chat, group }) => {
//   name = name.trim().toLowerCase();
//   chat = chat.trim().toLowerCase();

//   const existingUser = users.find((user) => user.chat === chat && user.name === name);

//   if (!name || !chat) return { error: "Username and chat are required." };
//   if (existingUser) return { error: "Username is taken." };

//   const user = { id, name, chat };
//   users.push(user);

//   return { user };
// };

// const removeUser = (id) => {
//   const index = users.findIndex((user) => user.id === id);

//   if (index !== -1) return users.splice(index, 1)[0];
// };

// // finds user info by socket.id
// const getUser = (id) => users.find((user) => user.id === id);

// const getUsersInChat = (chat) => users.filter((user) => user.chat === chat);

module.exports = { addUser, removeUser, getUser, getUsersInChat };
