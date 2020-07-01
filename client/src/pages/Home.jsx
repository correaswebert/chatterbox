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

const ENDPOINT = "http://127:0.0.1:5000";
let socket = io(ENDPOINT);

const Home = () => {
  const classes = useStyles();

  const [phone, setPhone] = useState(localStorage.getItem("phone"));

  return (
    // personal phone number is stored in localStorage for verifying if user registered
    !localStorage.getItem("phone") ? (
      <Redirect to="/register" />
    ) : (
      <div className={classes.root}>
        <Conversations className={classes.conversations} chats={chats} />
        <Chat socket={socket} />
      </div>
    )
  );
};

export default Home;
