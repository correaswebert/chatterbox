import React from "react";
import io from "socket.io-client";
import { makeStyles } from "@material-ui/core/styles";
import Conversations from "../components/Conversations";
import Chat from "../components/Chat";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
  },
  conversations: {
    width: "30vw",
  },
});

const dummy_chats = [
  { name: "swebert correa", extract: "..." },
  { name: "swebert correa", extract: "..." },
  { name: "swebert correa", extract: "..." },
];

const chats = JSON.parse(localStorage.getItem("chats"));

const Home = () => {
  const classes = useStyles();
  const socket = io("localhost:5000");

  const [chatId, setChatId] = React.useState();
  return (
    <div className={classes.root}>
      <Conversations
        className={classes.conversations}
        chats={chats ?? dummy_chats}
        setChatId={setChatId}
      />
      <Chat socket={socket} chatId={chatId} />
    </div>
  );
};

export default Home;
