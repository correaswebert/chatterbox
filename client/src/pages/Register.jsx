import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Input, Button, Container } from "@material-ui/core";

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

const Register = () => {
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
      .post(`http://127.0.0.1:5000/register`, { userIdentification })
      .then((res) => {
        if (res.data !== "OK") {
          alert("Phone is already registered!");
          return false;
        }
      })
      .catch((err) => {
        console.log(err);
        return false;
      });

    localStorage.setItem("name", name);
    localStorage.setItem("phone", phone);
    console.log("OK"); // DEBUG

    return true;
  };

  return (
    <div className={classes.outerContainer}>
      <Container className={classes.innerContainer}>
        <h1 className={classes.heading}>Register</h1>
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
            type="number"
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>

        <div>{/* input button to get image */}</div>

        {/* convert this into a POST request from GET request */}
        <Link onClick={(e) => (saveCredentials() ? null : e.preventDefault())} to="/">
          <Button className={classes.button}>Register</Button>
        </Link>
      </Container>
    </div>
  );
};

export default Register;
