const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors"); // useful once app is deployed
require("dotenv").config();

const { addUser, removeUser, getUser } = require("./users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.log(err));

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

const NewUserRouter = require("./Routes/NewUser");
app.use("/api", NewUserRouter);

const GroupRouter = require("./Routes/Group");
app.use("/api/group", GroupRouter);

server.listen(process.env.PORT || 500, () =>
  console.log("Sever is running on port " + process.env.PORT)
);
