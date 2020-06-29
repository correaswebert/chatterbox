import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";

/* 
go to homepage initially, and try to grab the phone number (or some userId)
from the localStorage... if it does not exist, then reroute to the
registration page
*/
function App() {
  return (
    <Router>
      <Route exact path="/" component={Home} />
      <Route exact path="/register" component={Register} />
    </Router>
  );
}

export default App;
