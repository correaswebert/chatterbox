import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Input, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  form: {
    alignItems: "center",
    justifyContent: "center",
  },
  submit: {
    color: theme.palette.success,
  },
}));

const Register = () => {
  const classes = useStyles();

  return (
    <Paper component="form" className={classes.form}>
      <Input
        type="number"
        placeholder="Enter phone number"
        inputProps={{ "aria-label": "enter phone number" }}
      />

      <Button type="submit" className={classes.submit} aria-label="search">
        Submit
      </Button>
    </Paper>
  );
};

export default Register;
