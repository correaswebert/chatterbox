import React, { useState } from "react";
import io from "socket.io-client";
import { makeStyles } from "@material-ui/core/styles";
import Conversations from "../components/Conversations";
import localForage from "localforage";
import PersonalChat from "../components/PersonalChat";
import GroupChat from "../components/GroupChat";

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
  { id: "9702275586", name: "swebert correa", extract: "..." },
  { id: "1248", name: "Chandler Bing", extract: "..." },
  { id: "1379", name: "Mike Ross", extract: "..." },
];

const Home = () => {
  const classes = useStyles();

  const [chatId, setChatId] = useState(0);
  const [phone, setPhone] = useState(0);
  const [name, setName] = useState("");

  const socket = io("http://127:0.0.1:5000");

  let currChats = [];
  localForage
    .getItem("chats")
    .then((chats) => (currChats = chats))
    .catch(() => (currChats = []));

  // get user's personal details
  localForage
    .getItem("phone")
    .then((p) => setPhone(p))
    .catch((err) => console.log(err));
  localForage
    .getItem("name")
    .then((n) => setName(n))
    .catch((err) => console.log(err));

  // user's essential details
  const userDetails = {
    socket,
    phone,
    name,
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

  function renderChat() {
    if (currChats.personal.find(({ id }) => id === chatId)) {
      return <PersonalChat {...userDetails} chatId={chatId} />;
    } else if (currChats.group.find(({ id }) => id === chatId)) {
      return <GroupChat {...userDetails} chatId={chatId} />;
    } else {
      return <></>;
    }
  }

  return (
    <div className={classes.root}>
      <Conversations chats={chats} setChatId={setChatId} />
      {/* <PersonalChat {...userDetails} chatId={chatId} /> */}
      {renderChat()}
    </div>
  );
};

export default Home;
