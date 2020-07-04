import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from "@material-ui/core";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import logo from "../logo.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "30vw",
    backgroundColor: theme.palette.background.paper,
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const Conversations = ({ chats, setChatId }) => {
  const classes = useStyles();

  return (
    <>
      <List className={classes.root}>
        <Link to="/new-chat">
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <PersonAddIcon />
            </ListItemAvatar>
            <ListItemText primary="New Chat" />
          </ListItem>
        </Link>
        <Divider />

        <Link to="/new-group">
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <GroupAddIcon />
            </ListItemAvatar>
            <ListItemText primary="New Group" />
          </ListItem>
        </Link>
        <Divider />

        {chats.map((chat, index) => {
          const { name, image, extract } = chat;
          return (
            <div key={index}>
              <ListItem alignItems="flex-start" button>
                <ListItemAvatar>
                  <Avatar alt={name} src={image || logo} />
                </ListItemAvatar>
                <ListItemText primary={name} secondary={extract || ""} />
              </ListItem>
              <Divider variant="inset" component="li" />
            </div>
          );
        })}
      </List>
    </>
  );
};

export default Conversations;
