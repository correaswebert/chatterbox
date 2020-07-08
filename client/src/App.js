import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import NewChat from "./pages/NewChat";

/* 
go to homepage initially, and try to grab the phone number (or some userId)
from the localStorage... if it does not exist, then reroute to the
registration page
*/
function App() {
  return (
    <Router>
      <Route exact path="/chat" component={Home} />
      <Route exact path="/" component={Register} />
      <Route exact path="/new" component={NewChat} />
    </Router>
  );
}

export default App;
