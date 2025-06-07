import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Typography, List, ListItem, ListItemText } from "@mui/material";
import axios from "axios";
import "./styles.css";



function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsersWithPhotoCount = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user");
        const userList = response.data;
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users or photo counts:", error);
      }
    };

    fetchUsersWithPhotoCount();
  }, []);


  return (
    <div className="user-list-container">
      <Typography variant="h6" className="list-title">
        User List:
      </Typography>
      <List className="list">
        {users.map((user) => (
          <ListItem
            key={user._id}
            component={Link}
            to={`/users/${user._id}`}
            className={"list-item"}
          >
            <ListItemText primary={`${user.last_name}`} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default UserList;
