import React, { useState } from "react";
import io from "socket.io-client";
import { makeStyles } from "@material-ui/core/styles";
import Conversations from "../components/Conversations";
import Chat from "../components/Chat";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
  },
  conversations: {
    width: "30vw",
  },
});

const chats = [
  { name: "swebert correa", extract: "..." },
  { name: "swebert correa", extract: "..." },
  { name: "swebert correa", extract: "..." },
];

const Home = ({ phone, name }) => {
  const classes = useStyles();

  // user's essential details
  const userDetails = {
    socket: io("http://127:0.0.1:5000"),
    phone: localForage.getItem("phone"),
    name: localForage.getItem("name"),
  };

  // Notify server you are online and check for pending messages
  socket.emit("online", phone);

  socket.on("pending incoming messages", (messages) => {
    messages.forEach((message) => {
      storeMessage(message);

      // ACK that message was received
      if (message.group) {
        const { groupId, time } = message;
        socket.emit("received group message", { groupId, phone, time });
      } else {
        socket.emit("received personal message", { toPhone: phone, time: message.time });
      }
    });
  });

  return (
    <div className={classes.root}>
      <Conversations className={classes.conversations} chats={chats} />
      <Chat {...userDetails} /> {/* also need to pass chatId */}
    </div>
  );
};

export default Home;
