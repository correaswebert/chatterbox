import React from "react";
import { Redirect } from "react-router-dom";
import localForage from "localforage";

const checkRegistered = () => {
  let phone = localForage.getItem("phone");

  return phone ? <Redirect to={`/chat?${phone}`} /> : <Redirect to="/login" />;
};

export default checkRegistered;
