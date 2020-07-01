const users = [];

const addUser = ({ id, name, chat }) => {
  name = name.trim().toLowerCase();
  chat = chat.trim().toLowerCase();

  const existingUser = users.find((user) => user.chat === chat && user.name === name);

  if (!name || !chat) return { error: "Username and chat are required." };
  if (existingUser) return { error: "Username is taken." };

  const user = { id, name, chat };

  users.push(user);

  // DEBUG
  // console.log(users);

  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInChat = (chat) => users.filter((user) => user.chat === chat);

module.exports = { addUser, removeUser, getUser, getUsersInChat };
