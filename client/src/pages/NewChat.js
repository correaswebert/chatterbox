import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { Input, Button, Container } from "@material-ui/core";
import localForage from "localforage";

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
}));

const NewChat = ({ login }) => {
  const classes = useStyles();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState(0);

  const saveCredentials = () => {
    const userIdentification = {
      name: name,
      phone: phone,
      // avatar: avatar,
    };

    axios
      .post(`http://127.0.0.1:5000/${login ? "login" : "register"}`, {
        userIdentification,
      })
      .then((res) => {
        if (!res.data.success) {
          alert(res.data.error);

          return login ? <Redirect to="/register" /> : false;
        }
      })
      .catch((err) => {
        console.log(err);
        return false;
      });

    localForage.setItem("name", name);
    localForage.setItem("phone", phone);
    console.log("OK"); // DEBUG

    return true;
  };

  return (
    <div className={classes.outerContainer}>
      <Container className={classes.innerContainer}>
        <h1 className={classes.heading}>User Info</h1>
        <div>
          <Input
            placeholder="Name"
            className={classes.input}
            type="text"
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div>
          <Input
            placeholder="Phone number"
            className={classes.input}
            type="text"
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>

        <Link onClick={(e) => (saveCredentials() ? null : e.preventDefault())} to="/chat">
          <Button className={classes.button}>Chat</Button>
        </Link>
      </Container>
    </div>
  );
};

export default NewChat;