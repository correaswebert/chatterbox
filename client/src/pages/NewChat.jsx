import React, { useState } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Input, Button, Container, IconButton } from "@material-ui/core";
import GroupIcon from "@material-ui/icons/Group";
import PersonIcon from "@material-ui/icons/Person";

const useStyles = makeStyles((theme) => ({
  form: {
    alignItems: "center",
    justifyContent: "center",
  },
  submit: {
    color: theme.palette.success,
  },

  outerContainer: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    height: "100vh",
    alignItems: "center",
    backgroundColor: "#1A1A1D",
  },

  innerContainer: {
    width: "20%",
  },

  input: {
    borderRadius: "0",
    padding: "15px 20px",
    width: "100%",
    color: "white",
  },

  heading: {
    color: "white",
    fontSize: "2.5em",
    paddingBottom: "10px",
    borderBottom: "2px solid white",
  },

  button: {
    color: "#fff !important",
    textTransform: "uppercase",
    textDecoration: "none",
    background: "#2979FF",
    padding: "20px",
    borderRadius: "5px",
    display: "inline-block",
    border: "none",
    width: "100%",
    marginTop: "2em",
  },

  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 400,
  },
  inputx: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
    color: "grey",
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

const NewChat = () => {
  const classes = useStyles();

  const [chatId, setChatId] = useState("");
  const [group, setGroup] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveCreds = () => {
    if (saved) return false; // no error
    console.log("Making request...");

    const iserror = axios
      .post(`http://127.0.0.1:5000/${group ? "group" : "personal"}`, { chatId: chatId })
      .then((res) => {
        console.log("Got response...");
        console.log(res.data);

        if (res.data.success) {
          localStorage.setItem("chatId", chatId);
          localStorage.setItem("group", group);

          console.log("Saved info...");
          setSaved(true);

          return false;
        } else throw new Error(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        alert("Some error occured...");
        return true;
      });

    console.log("iserror: " + iserror);
    return iserror;
  };

  return (
    <div className={classes.outerContainer}>
      <Container className={classes.innerContainer}>
        <h1 className={classes.heading}>Chat Info</h1>

        <IconButton
          className={classes.iconButton}
          aria-label="menu"
          onClick={() => setGroup(!group)}
        >
          {group ? <GroupIcon /> : <PersonIcon />}
        </IconButton>

        <Input
          placeholder={group ? "Room name" : "Phone number"}
          className={classes.input}
          type="text"
          onChange={(event) => setChatId(event.target.value)}
        />

        <Button
          className={classes.button}
          type="submit"
          onClick={(e) => (saveCreds() ? e.preventDefault() : null)}
        >
          {group ? "Group Chat" : "Personal Chat"}
        </Button>
        {saved ? <Redirect to="/chat" /> : <></>}
      </Container>
    </div>
  );
};

export default NewChat;
