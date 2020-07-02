import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import NewChat from "./pages/NewChat";
import CreateGroup from "./pages/CreateGroup";

/* 
go to homepage initially, and try to grab the phone number (or some userId)
from the localStorage... if it does not exist, then reroute to the
registration page
*/
function App() {
  return (
    <Router>
      <Route exact path="/" component={Home} />
      <Route exact path="/chat" component={Home} />

      <Route exact path="/new-chat" component={NewChat} />
      <Route exact path="/new-group" component={CreateGroup} />

      <Route
        exact
        path="/register"
        render={(props) => <Register {...props} login={false} />}
      />
      <Route
        exact
        path="/login"
        render={(props) => <Register {...props} login={true} />}
      />
    </Router>
  );
}

export default App;
