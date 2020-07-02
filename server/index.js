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

// a temporary relationship between a phone number and socket.id
// created on the join event, and deleted on the disconnect event
const phone2socket = [];

// socket is created
io.on("connect", (socket) => {
  socket.on("join group", ({ phone, group, time }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, chat });

    if (error) return callback(error);

    socket.join(user.chat);
    console.log(`${name} has joined @ ${time}`);

    // notify the user
    socket.emit("notify", {
      user: user.phone,
      type: "join",
      payload: `You have joined the chat`,
    });

    // BUG: move this from here to router to DB js
    users.push(user.phone);

    // notify the others in group
    socket.broadcast.to(user.chat).emit("notify", {
      user: user.phone,
      type: "join",
      payload: `${user.name} has joined the chat`,
    });

    callback();
  });

  socket.on("send group message", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.chat).emit("incoming group message", { ...message, incoming: true });

    console.log(message);
    callback();
  });

  socket.on("leave group", ({ phone, groupId }) => {
    const index = users.indexOf(phone);

    if (index > -1) {
      users.splice(index, 1);

      socket.broadcast.to(user.chat).emit("notify", {
        user: phone,
        type: "left",
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server has started @ PORT ${PORT}`));
