import { useEffect, useState } from "react";
// import queryString from "query-string";
import io from "socket.io-client";

const [name, setName] = useState(""); // if single person
const [chat, setChat] = useState(""); // if group chat
const [users, setUsers] = useState(""); // if group chat
const date = new Date();

const [message, setMessage] = useState(""); // current one being written
const [messages, setMessages] = useState([]); // history of messages, stored in localStorage
const ENDPOINT = "localhost:5000"; // where the server is connected

let socket;

// this is used for group chat
// can also be used to have a accept notification... if user accepts, then establish a conversation
useEffect(() => {
  // in case of single person, the room name will be replaced by other party's name
  // const { name, chat } = queryString.parse(location.search);

  socket = io(ENDPOINT);

  setChat("Swebert");
  setName("Swebert");

  // user has joined a room
  socket.emit("join", { name, chat, time: date.getMinutes() }, (error) => {
    if (error) {
      alert(error);
    }
  });
}, [ENDPOINT /* , location.search */]);

useEffect(() => {
  socket.on("incoming message", (message) => {
    setMessages((messages) => [...messages, message]);

    // DEBUG
    console.log(messages);

    // store messages as history (to be retrieved later)
    localStorage.setItem("messages", messages.toString());

    // send confirmation that message is received
    // if user wants, then this can be turned off
    socket.emit("received message", message.time);
  });

  // in case of group chat, add the new user to the local DB
  socket.on("roomData", ({ users }) => {
    setUsers(users);
  });
}, []);

const sendMessage = (event) => {
  event.preventDefault();

  if (message) {
    socket.emit(
      "send message",
      { type: "text", payload: message, time: date.getTime() },
      () => setMessage("")
    );
  }
};
