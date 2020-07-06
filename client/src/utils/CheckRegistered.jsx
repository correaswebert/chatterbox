import React from "react";
import { Redirect } from "react-router-dom";
import localForage from "localforage";

const CheckRegistered = () => {
  const [phone, setPhone] = React.useState();

  // BUG: possible memory leak as setPhone is not called before rendering
  // in Brave (where phone does not exist)
  // no idea if it happens in Firefox also, as new component render removes err
  localForage
    .getItem("phone")
    .then((p) => setPhone(p))
    .catch((e) => console.log(e));

  return phone ? <Redirect to="/chat" /> : <Redirect to="/login" />;
};

export default CheckRegistered;
