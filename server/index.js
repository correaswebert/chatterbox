const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors"); // useful once app is deployed

const { addUser, removeUser, getUser, getUsersInChat } = require("./users");
const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(express.json());
app.use(router);

// socket is created
io.on("connect", (socket) => {
  console.log("server socket created");

  socket.on("join", ({ name, phone, chatId: chat, group }, callback) => {
    console.log("Chat: ");
    console.log(phone + chat);

    const { error, user } = addUser({
      id: socket.id,
      name,
      phone,
      chat: group ? chat : phone > chat ? phone + chat : chat + phone,
    });

    if (error) return callback(error);

    socket.join(user.chat);
    console.log(`${name} has joined`);

    if (group) {
      // notify the user
      socket.emit("incoming message", {
        user: "admin",
        type: "notification",
        payload: `You have joined the chat`,
      });

      // notify the other participants of the group
      socket.broadcast.to(user.chat).emit("incoming message", {
        user: "admin",
        type: "notification",
        payload: `${user.name} has joined the chat`,
      });

      // send the updated participant list
      // FIX: instead of sending updated list, client-side should directly add the username using above notification
      // the list should only be sent to the current user...
      io.to(user.chat).emit("roomData", {
        chat: user.chat,
        users: getUsersInChat(user.chat),
      });
    }

    callback();
  });

  socket.on("send message", (message, callback) => {
    const user = getUser(socket.id);
    console.dir(user);

    io.to(user.chat).emit("incoming message", { ...message, user: user.name });

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.chat).emit("incoming message", {
        user: "admin",
        type: "notification",
        payload: `${user.name} has left the chat`,
      });

      // again instead of sending updated list, client-side could use above name to remove from their participant list
      io.to(user.chat).emit("roomData", {
        chat: user.chat,
        users: getUsersInChat(user.chat),
      });
    }
  });
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));
