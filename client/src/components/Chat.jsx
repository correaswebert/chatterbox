import React, { useEffect, useState, useRef } from "react";
import { Redirect } from "react-router-dom";
// import queryString from "query-string";
import io from "socket.io-client";
import PropTypes from "prop-types";
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
  ListItem,
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
import { FixedSizeList } from "react-window";

// import * as utils from "../utils/socketClient";

const useStyles = makeStyles((theme) => ({
  chatInfo: {
    width: "70vw",
    flexGrow: 1,
  },
  title: {
    marginLeft: theme.spacing(1),
    flexGrow: 1,
  },

  chatHistory: {
    width: "100%",
    height: 400,
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
  },
  chatBox: {
    maxWidth: "30em",
    marginTop: "1em",
    marginLeft: "1em",
    padding: "1em",
  },
  name: {
    marginBottom: "0.5em",
  },
  timeStamp: {
    justifyContent: "flex-end",
    marginTop: "0.5em",
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
  divider: {
    height: 28,
    margin: 4,
  },
}));

let socket; // will be initialised every time we change the connection (group or chat)

const Chat = ({ location }) => {
  const classes = useStyles();

  const [name, setName] = useState(""); // if single person
  const [phone, setPhone] = useState("");
  const [chat, setChat] = useState(""); // if group chat
  const [users, setUsers] = useState(""); // if group chat
  const date = new Date();

  const [message, setMessage] = useState(""); // current one being written
  const [messages, setMessages] = useState([]); // history of messages, stored in localStorage
  const ENDPOINT = "localhost:5000"; // where the server is connected

  socket = useRef();

  // this is used for group chat
  // can also be used to have a accept notification... if user accepts, then establish a conversation
  useEffect(() => {
    // in case of single person, the room name will be replaced by other party's name
    // const { name, chat } = queryString.parse(location.search);
    const name = localStorage.getItem("name");
    const chat = "Swebert";

    socket.current = io(ENDPOINT);

    setChat("Swebert");
    setName(localStorage.getItem("name"));
    setPhone(localStorage.getItem("phone"));

    // user has joined a room
    socket.current.emit(
      "join",
      { name: name, chat: chat, phone: phone, time: date.getTime() },
      (error) => {
        if (error) {
          alert(error);
        }
      }
    );
  }, [ENDPOINT /* , location.search */]);

  useEffect(() => {
    socket.current.on("incoming message", (message) => {
      setMessages((messages) => [...messages, message]);

      // DEBUG
      // console.log(messages);

      // store messages as history (to be retrieved later)
      // localStorage.setItem("messages", messages.toString());

      // send confirmation that message is received
      // if user wants, then this can be turned off
      socket.current.emit("received message", message.time);
    });

    // in case of group chat, add the new user to the local DB
    socket.current.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, [messages]);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.current.emit(
        "send message",
        {
          user: name,
          type: "text",
          payload: message,
          time: date.getTime(),
          incoming: false,
        },
        () => setMessage("")
      );
    }
  };

  // https://github.com/bvaughn/react-window
  // some links in the README for lazy loading the list data too!
  function renderRow(props) {
    const { index, style, message } = props;
    const { user, time, payload, type, incoming } = message;
    // console.log(message);

    return (
      <ListItem button style={style} key={index}>
        <Paper className={classes.chatBox}>
          {/* this is a notification */}
          <div className={classes.name}>{user !== "admin" ? user : null}</div>

          <Typography>
            {/* show message if text otherwise show download icon (with filename) */}
            {type === "text" || type === "notification" ? payload : type}
            {/* {if(true) return null} */}
          </Typography>

          <div className={classes.timeStamp}>
            {time}
            {incoming ? null : <DoneIcon />}
          </div>
        </Paper>
      </ListItem>
    );
  }

  renderRow.propTypes = {
    index: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
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
      const { user, time, payload, type, incoming } = message;
      // console.log(message);

      return (
        <Paper key={i} className={classes.chatBox}>
          {/* this is a notification */}
          <div className={classes.name}>{user !== "admin" ? user : null}</div>

          <Typography>
            {/* show message if text otherwise show download icon (with filename) */}
            {type === "text" || type === "notification" ? payload : type}
            {/* {if(true) return null} */}
          </Typography>

          <div className={classes.timeStamp}>
            {time}
            {incoming ? null : <DoneIcon />}
          </div>
        </Paper>
      );
    });

  // update the itemCount every time a new chat is added
  const ChatHistory = () => (
    <div className={classes.chatHistory}>
      <FixedSizeList height={400} width={300} itemSize={46} itemCount={200}>
        {renderRow}
      </FixedSizeList>
    </div>
  );

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
    // personal phone number is stored in localStorage for verifying if user registered
    !localStorage.getItem("phone") ? (
      <Redirect to="/register" />
    ) : (
      <div className={classes.root}>
        <ChatInfo displayName={"placeholder"} />
        <ChatBox messages={messages} />
        <MessageBox />
      </div>
    )
  );
};

export default Chat;
