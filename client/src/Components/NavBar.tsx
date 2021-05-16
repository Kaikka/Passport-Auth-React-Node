import React from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <div className="NavContainer">
      <Link to="/">Home</Link>
      <Link to="/logout">Logout</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/admin">Admin</Link>
    </div>
  );
}
