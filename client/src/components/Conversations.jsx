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
    backgroundColor: "#ffffff",
    // borderRight: "2px solid white",
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
        <Link to="/new" style={{ textDecoration: "none" }}>
          <ListItem alignItems="flex-start" button>
            <ListItemAvatar>
              <AddCircleIcon />
            </ListItemAvatar>
            <ListItemText primary="New Chat" />
          </ListItem>
        </Link>
        <Divider />

        {chats.map((chat, index) => {
          const { name, image, extract, id } = chat;
          return (
            <div key={index}>
              <ListItem alignItems="flex-start">
                {/* <ListItem alignItems="flex-start" button onClick={setChatId(id)}> */}
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
