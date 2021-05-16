import React from "react";
import NavBar from "./Components/NavBar";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import AdminPage from "./Pages/AdminPage";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import "./main.css";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path="/" exact component={Homepage}></Route>
        <Route path="/admin" exact component={AdminPage}></Route>
        <Route path="/login" exact component={Login}></Route>
        <Route path="/profile" exact component={Profile}></Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
