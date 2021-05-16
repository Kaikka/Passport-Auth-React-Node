import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import { myContext } from "./Context";

export default function AdminPage() {
  const ctx = useContext(myContext);
  const [data, setData] = useState<any>();
  const [selectedUser, setSelectedUser] = useState<string>();
  useEffect(() => {
    Axios.get("http://localhost:4000/getAllUsers", {
      withCredentials: true,
    }).then((res: any) => {
      setData(
        res.data.filter((item: any) => {
          return item.username !== ctx.username;
        })
      );
    });
  }, []);

  if (!data) {
    return null;
  }

  const deleteUser = () => {
    let userid: any;
    data.forEach((item: any) => {
      if (item.username === selectedUser) {
        userid = item._id;
      }
    });

    Axios.post(
      "http://localhost:4000/deleteUser",
      { id: userid },
      {
        withCredentials: true,
      }
    );
  };

  return (
    <div>
      <h1>Admin Page</h1>

      <select
        onChange={(e) => setSelectedUser(e.target.value)}
        name="deleteUser"
        id="deleteUser"
      >
        <option id="Select a user">Select a user</option>
        {data.map((item: any) => {
          return <option id={item.username}>{item.username}</option>;
        })}
      </select>
      <button onClick={deleteUser}>Delete user</button>
    </div>
  );
}
