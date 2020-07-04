import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginRegister from "./pages/LoginRegister";
// import NewChat from "./pages/NewChat";
import CreateGroup from "./pages/CreateGroup";
import checkRegistered from "./utils/checkRegistered";

/* 
go to homepage initially, and try to grab the phone number (or some userId)
from the localStorage... if it does not exist, then reroute to the
registration page
*/
function App() {
  return (
    <Router>
      <Route exact path="/" component={checkRegistered} />
      <Route exact path="/chat" component={Home} />

      {/* <Route exact path="/new-chat" component={NewChat} /> */}
      <Route exact path="/new-group" component={CreateGroup} />

      <Route
        exact
        path="/register"
        render={(props) => <LoginRegister {...props} login={false} />}
      />
      <Route
        exact
        path="/login"
        render={(props) => <LoginRegister {...props} login={true} />}
      />
    </Router>
  );
}

export default App;
