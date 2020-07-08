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
  // Fab,
} from "@material-ui/core";
// import PersonAddIcon from "@material-ui/icons/PersonAdd";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import logo from "../logo.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "30vw",
    height: "100vh",
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

  return (
    <>
      <List className={classes.root}>
        <Link to="/new">
          <ListItem alignItems="flex-start" button>
            <ListItemAvatar>
              <AddCircleIcon />
            </ListItemAvatar>
            <ListItemText primary="New Chat" />
          </ListItem>
        </Link>
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
        <AddCircleIcon />
      </Fab> */}
    </>
  );
};

export default Conversations;
