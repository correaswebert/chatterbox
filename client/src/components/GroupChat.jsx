import React, { useEffect, useState, useRef } from "react";
import localForage from "localforage";
import { Redirect } from "react-router-dom";
import queryString from "query-string";
import io from "socket.io-client";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  InputBase,
  Input,
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
    float: "right",
    marginTop: "-0.25em",
    marginRight: "-0.75em",
    color: "#a9a9a9",
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

// stores the message in the array referred by phone or groupId
async function storeMessage(message, messages) {
  const chatId = message.group ? message.groupId : message.fromPhone;

  try {
    localForage.setItem(chatId, [...messages, message]);
  } catch (err) {
    if (err instanceof TypeError) localForage.setItem(chatId, [message]);
    else console.log(err);
  }
}

function saveGroup(info) {
  // save group id to array of user's groups
  localForage
    .getItem("chats")
    .then((groups) => localForage.setItem("chats", [...groups, info.groupId]));

  // save the group info
  localForage.setItem(info.groupId, info);

  // add two basic notifications
  storeMessage({
    fromPhone: 0,
    fromName: "admin",
    groupId: info.groupId,
    type: "notification",
    payload: `${info.creator.name} created the group`,
    time: info.timeCreated,
    incoming: true,
    group: true,
  });

  storeMessage({
    fromPhone: 0,
    fromName: "admin",
    groupId: info.groupId,
    type: "notification",
    payload: "You were added to the group",
    time: info.timeCreated,
    incoming: true,
    group: true,
  });
}

const GroupChat = ({ socket, phone, name, chatId }) => {
  const classes = useStyles();

  const date = new Date();

  // current message written or file selected
  const [payload, setPayload] = useState("");

  // history of messages, stored in DB
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    localForage
      .getItem(chatId)
      .then((messageHistory) => setMessages(messageHistory ? messageHistory : []))
      .catch(() => setMessages([]));

    // user has been added to a group
    socket.on("added to group", (groupInfo) => saveGroup(groupInfo));

    socket.on("incoming group message", (message) => {
      // for current session
      setMessages((messages) => [...messages, message]);

      // for persistent history
      storeMessage(message);

      // DEBUG
      console.log("Messages: " + messages);

      // send confirmation that message is received
      // if user wants, then this can be turned off
      socket.broadcast
        .to(message.groupId)
        .emit("received group message", { user: phone, time: message.time });
    });

    socket.on("notify", ({ type, user }) => {});
  }, []);

  const exitGroup = (groupId) => () => {
    socket.emit("leave group", { groupId, phone: phone });
    // remove group info from local DB
    // render a blank screen now by redirecting...
  };

  const sendMessage = (event) => {
    event.preventDefault();

    // // DEBUG
    // localForage.getItem(chatId).then((chats) => console.log(chats));

    if (!payload) return;

    const message = {
      fromPhone: phone,
      fromName: name,
      toPhone: 9820978323,
      type: "text",
      payload: payload,
      // payload: document.getElementById("message-input").value,
      time: date.getTime(),
      incoming: false,
      group: false,
    };

    socket.emit("send group message", message, (error) => {
      if (error) {
        alert(error);
      }
    });

    storeMessage(message, messages);
    setPayload("");
  };

  const formatTime = (time) => {
    // console.log("Time: " + time);
    time %= 86400000;
    let ss = Math.floor(time / 1000);
    let mm = Math.floor(ss / 60);
    let hh = Math.floor(mm / 24);

    return `${hh}:${mm % 60}:${ss % 60}`;
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
            {incoming ? null : <DoneIcon color="primary" />}
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
          <ExitToAppIcon onClick={exitGroup(null)} />
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
            {user !== "admin" ? formatTime(time) : null}
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

  const MessageInput = () => (
    <Paper component="form" className={classes.form}>
      <IconButton className={classes.iconButton} aria-label="menu">
        <EmojiEmotionsIcon />
      </IconButton>

      <InputBase
        id="message-input"
        className={classes.textBox}
        placeholder="Type a message..."
        inputProps={{ "aria-label": "type a message" }}
      />
      {/* 
        value={message}
        onChange={(event) => setMessage(event.target.value)}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              console.log(message);
              return sendMessage(event);
            }
          }}
        setMessage(event.target.value);
        onChange={({ target: { value } }) => setMessage(value)}
         /> */}

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
        <MessageInput />
      </div>
    )
  );
};

export default GroupChat;
