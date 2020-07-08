import React, { useEffect, useState, useRef } from "react";
// import queryString from "query-string";
import io from "socket.io-client";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  InputBase,
  Divider,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
} from "@material-ui/core";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import SendIcon from "@material-ui/icons/Send";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import GetAppRoundedIcon from "@material-ui/icons/GetAppRounded";
import DoneIcon from "@material-ui/icons/Done";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import defaultDP from "../images/defaultDP.svg";

import "../utils/socketClient";

const useStyles = makeStyles((theme) => ({
  chatInfo: {
    width: "70vw",
    flexGrow: 1,
  },
  title: {
    marginLeft: theme.spacing(1),
    flexGrow: 1,
  },

  chatBox: {
    maxWidth: "30em",
    marginTop: "1em",
    marginLeft: "1em",
    padding: "1em",
  },

  form: {
    display: "flex",
    position: "fixed",
    bottom: 0,
    padding: "2px 4px",
    alignItems: "center",
    width: "70vw",
  },
  textBox: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  timeStamp: {
    float: "right",
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

const socket = io("localhost:5000");

const Chat = ({ location }) => {
  const classes = useStyles();

  const name = localStorage.getItem("name");
  const phone = localStorage.getItem("phone");

  const group = JSON.parse(localStorage.getItem("group"));
  const chatId = localStorage.getItem("chatId");

  const [users, setUsers] = useState(""); // if group chat
  const date = new Date();

  const [message, setMessage] = useState(""); // current one being written
  const [messages, setMessages] = useState([]); // history of messages, stored in localStorage

  // this is used for group chat
  // can also be used to have a accept notification... if user accepts, then establish a conversation
  useEffect(
    () => {
      // in case of single person, the room name will be replaced by other party's name
      // const { name, chat } = queryString.parse(location.search);

      if (chatId) {
        socket.emit("join", { name, phone, chatId, group }, (error) => {
          if (error) {
            alert(error);
          }
        });
      }
    },
    [
      /* , location.search */
    ]
  );

  useEffect(() => {
    socket.on("incoming message", (message) => {
      setMessages((messages) => [...messages, message]);

      // DEBUG
      console.log(messages);

      // store messages as history (to be retrieved later)
      localStorage.setItem("messages", messages.toString());

      // send confirmation that message is received
      // if user wants, then this can be turned off
      socket.emit("received message", message.time);
    });

    // in case of group chat, add the new user to the local DB
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit(
        "send message",
        { type: "text", payload: message, time: date.getTime() },
        () => setMessage("")
      );
    }
  };

  const ChatInfo = ({ displayName, displayPicture }) => (
    <div className={classes.chatInfo}>
      <AppBar position="static">
        <Toolbar>
          <Avatar alt="DP" src={displayPicture || defaultDP} />
          <Typography variant="h6" className={classes.title}>
            {displayName}
          </Typography>

          {/* display icons only for group chat */}
          <PersonAddIcon />
          <ExitToAppIcon />
        </Toolbar>
      </AppBar>
    </div>
  );

  const ChatBox = ({ messages }) =>
    messages.map((message, i) => {
      const { user, time, payload, type } = message;

      return (
        <Paper key={i} className={classes.chatBox}>
          {/* this is a notification */}
          <div>{user !== "admin" ? user : ""}</div>

          <Typography>
            {/* show message if text otherwise show download icon (with filename) */}
            {type === "text" || type === "notification" ? payload : type}
          </Typography>

          <div className={classes.timeStamp}>
            {time}
            {/* double ticks icon (only outgoing messages) */}
          </div>
        </Paper>
      );
    });

  const MessageBox = () => (
    <Paper component="form" className={classes.form}>
      <IconButton className={classes.iconButton} aria-label="menu">
        <EmojiEmotionsIcon />
      </IconButton>

      <InputBase
        className={classes.textBox}
        placeholder="Type a message..."
        inputProps={{ "aria-label": "type a message" }}
        value={message}
        onChange={({ target: { value } }) => setMessage(value)}
        onKeyPress={(event) => {
          if (event.key === "Enter") return sendMessage(event);
        }}
      />

      <IconButton className={classes.iconButton} aria-label="attach">
        <AttachFileIcon />
      </IconButton>

      <Divider className={classes.divider} orientation="vertical" />

      <IconButton
        type="submit"
        color="primary"
        className={classes.iconButton}
        aria-label="send"
        onClick={(event) => sendMessage(event)}
      >
        <SendIcon />
      </IconButton>
    </Paper>
  );

  return (
    <div className={classes.root}>
      <ChatInfo displayName={"placeholder"} />
      <ChatBox messages={messages} />
      <MessageBox />
    </div>
  );
};

export default Chat;
