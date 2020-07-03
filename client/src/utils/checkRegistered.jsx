import React from "react";
import { Redirect } from "react-router-dom";
import localForage from "localforage";

const checkRegistered = () => {
  const phone = localForage.getItem("phone");

  return phone ? <Redirect to="/chat" /> : <Redirect to="/login" />;
};

export default checkRegistered;
