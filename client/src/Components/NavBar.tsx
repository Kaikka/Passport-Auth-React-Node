import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { myContext } from "../Pages/Context";

export default function NavBar() {
  const ctx = useContext(myContext);
  //console.log(ctx);
  return (
    <div className="NavContainer">
      {ctx ? (
        <>
          <Link to="/logout">Logout</Link>
          {ctx.isAdmin ? <Link to="/admin">Admin</Link> : null}
          <Link to="/profile">Profile</Link>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
      <Link to="/">Home</Link>
    </div>
  );
}
