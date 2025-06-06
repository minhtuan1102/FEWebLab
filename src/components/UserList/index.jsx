import React, { useState, useEffect } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import models from "../../modelData/models";
import "./styles.css";
import { useAuth } from "../../context/AuthContext";

function UserList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    async function loadUsers() {
      const data = await models.userListModel();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error("userListModel returned non-array data:", data);
      }
    }
    loadUsers();
  }, []);

  const filteredUsers = currentUser
      ? users.filter((user) => user._id !== currentUser._id)
      : users;

  if (!filteredUsers.length) return <div>No users found.</div>;

  return (
      <div className="user-list">
        <List component="nav">
          {filteredUsers.map((user) => (
              <React.Fragment key={user._id}>
                <ListItem disablePadding className="user-list-item">
                  <ListItemButton onClick={() => navigate(`/users/${user._id}`)}>
                    <ListItemText
                        primary={`${user.first_name} ${user.last_name}`}
                        secondary={user.occupation}
                    />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </React.Fragment>
          ))}
        </List>
      </div>
  );
}

export default UserList;