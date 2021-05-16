import React, { useContext } from "react";
import NavBar from "./Components/NavBar";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import AdminPage from "./Pages/AdminPage";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import "./main.css";
import { myContext } from "./Pages/Context";
import Register from "./Pages/Register";

function App() {
  const ctx = useContext(myContext);
  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path="/" exact component={Homepage} />
        {ctx ? (
          <>
            {ctx.isAdmin ? (
              <Route path="/admin" exact component={AdminPage} />
            ) : null}
            <Route path="/profile" exact component={Profile} />
          </>
        ) : (
          <>
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
          </>
        )}
      </Switch>
    </BrowserRouter>
  );
}

export default App;
