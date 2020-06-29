import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  // Fab,
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

const Conversations = ({ chats }) => {
  const classes = useStyles();

  // BUG: add functionality here
  const newChat = () => {};
  const newGroup = () => {};

  return (
    <>
      <List className={classes.root}>
        <ListItem alignItems="flex-start" button onClick={newChat}>
          <ListItemAvatar>
            <PersonAddIcon />
          </ListItemAvatar>
          {"New Chat"}
        </ListItem>
        <Divider />
        <ListItem alignItems="flex-start" button onClick={newGroup}>
          <ListItemAvatar>
            <GroupAddIcon />
          </ListItemAvatar>
          {"New Group"}
        </ListItem>
        <Divider />
        {chats.map((chat, index) => {
          const { name, image, extract } = chat;
          return (
            <div key={index}>
              <ListItem alignItems="flex-start">
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

      {/* <Fab aria-label="Add" className={classes.fab} color="primary">
        <AddIcon />
      </Fab> */}
    </>
  );
};

export default Conversations;
