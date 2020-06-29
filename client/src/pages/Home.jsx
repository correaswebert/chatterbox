import React from "react";
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

const chats = [
  { name: "swebert correa", extract: "..." },
  { name: "swebert correa", extract: "..." },
  { name: "swebert correa", extract: "..." },
];

const Home = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Conversations className={classes.conversations} chats={chats} />
      <Chat />
    </div>
  );
};

export default Home;
