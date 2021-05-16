import React, { useEffect, useState, useContext } from "react";
import Axios, { AxiosResponse } from "axios";
import { myContext } from "./Context";
import { UserInterface } from "../Interfaces/Interfaces";

export default function AdminPage() {
  const ctx = useContext(myContext);

  const [data, setData] = useState<UserInterface[]>();
  const [selectedUser, setSelectedUser] = useState<string>();
  useEffect(() => {
    Axios.get("http://localhost:4000/getAllUsers", {
      withCredentials: true,
    }).then((res: AxiosResponse) => {
      setData(
        res.data.filter((item: UserInterface) => {
          return item.username !== ctx.username;
        })
      );
    });
  }, [ctx]);

  if (!data) {
    return null;
  }

  const deleteUser = () => {
    let userid: string;
    data.forEach((item: UserInterface) => {
      if (item.username === selectedUser) {
        userid = item.id;
      }
    });

    Axios.post(
      "http://localhost:4000/deleteUser",
      { id: userid! },
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
        {data.map((item: UserInterface) => {
          return <option id={item.username}>{item.username}</option>;
        })}
      </select>
      <button onClick={deleteUser}>Delete user</button>
    </div>
  );
}
