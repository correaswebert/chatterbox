import React, { useState } from "react";
import io from "socket.io-client";
import { makeStyles } from "@material-ui/core/styles";
import Conversations from "../components/Conversations";
import Chat from "../components/Chat";
import localForage from "localforage";
// import PersonalChat from "../components/PersonalChat";
// import GroupChat from "../components/GroupChat";
// import { Redirect } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
  },
  conversations: {
    width: "30vw",
  },
});

// stores the message in the array referred by phone or groupId
function storeMessage(message) {
  const chatId = message.group ? message.groupId : message.phone;
  localForage
    .getItem(chatId)
    .then((currMessages) => localForage.setItem(chatId, [...currMessages, message]))
    .catch((err) => console.log(err));
}

const chats = [
  { id: "", name: "swebert correa", extract: "..." },
  { id: "", name: "swebert correa", extract: "..." },
  { id: "", name: "swebert correa", extract: "..." },
];

const Home = ({ phone, name }) => {
  const classes = useStyles();

  const [chatId, setChatId] = useState();
  // const chats = localForage.getItem("chats")
  const socket = io("http://127:0.0.1:5000");

  // user's essential details
  const userDetails = {
    socket_id: socket,
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
      <Conversations chats={chats} handler={setChatId} />
      <Chat {...userDetails} chatId={chatId} /> {/* also need to pass chatId */}
    </div>
  );
};

export default Home;
