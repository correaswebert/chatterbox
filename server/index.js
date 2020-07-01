const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors"); // useful once app is deployed

const { addUser, removeUser, getUser } = require("./users");
const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(express.json());
app.use(router);

// active users in group
const users = [];

// socket is created
io.on("connect", (socket) => {
  socket.on("join", ({ name, chat, time }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, chat });

    if (error) return callback(error);

    socket.join(user.chat);
    console.log(`${name} has joined @ ${time}`);

    // notify the user
    socket.emit("notify", {
      user: "admin",
      type: "join",
      payload: `You have joined the chat`,
      incoming: true,
    });

    // BUG: move this from here to router to DB js
    users.push(user.phone);

    // notify the others in group
    socket.broadcast.to(user.chat).emit("notify", {
      user: user.phone,
      type: "join",
      payload: `${user.name} has joined the chat`,
      incoming: true,
    });

    callback();
  });

  socket.on("send message", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.chat).emit("incoming message", { ...message, incoming: true });

    console.log(message);
    callback();
  });

  socket.on("join", (phone) => {
    const index = users.indexOf(5);
    if (index > -1) {
      users.splice(index, 1);

      io.to(user.chat).emit("left notify", {
        user: "admin",
        type: "left",
        payload: `${user.name} has left the chat`,
        incoming: true,
      });
    }
  });

  // user does not leave on socket disconnection
  // user leaves on emitting 'leave group'

  // socket.on("disconnect", () => {
  //   const user = removeUser(socket.id);

  //   if (user) {
  //     io.to(user.chat).emit("notify", {
  //       user: user.phone,
  //       type: "left",
  //       payload: `${user.name} has left the chat`,
  //       incoming: true,
  //     });
  //   }
  // });
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));
