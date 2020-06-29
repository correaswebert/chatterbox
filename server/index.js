const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors"); // useful once app is deployed

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");
const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

// socket is created
io.on("connect", (socket) => {
  socket.on("join", ({ name, room, time }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room);
    console.log(`${name} has joined @ ${time}`);

    // notify the user
    socket.emit("incoming message", {
      user: "admin",
      type: "text",
      payload: `You have joined the chat`,
    });

    // notify the other participants of the group
    socket.broadcast.to(user.room).emit("incoming message", {
      user: "admin",
      type: "text",
      payload: `${user.name} has joined the chat`,
    });

    // send the updated participant list
    // FIX: instead of sending updated list, client-side should directly add the username using above notification
    // the list should only be sent to the current user...
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("send message", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("incoming message", { ...message, user: user.name });

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("incoming message", {
        user: "Admin",
        type: "text",
        payload: `${user.name} has left the chat`,
      });

      // again instead of sending updated list, client-side could use above name to remove from their participant list
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));
