import React, {useEffect, useState} from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  ListItemButton
} from "@mui/material";
import {Link} from "react-router-dom"

import "./styles.css";

/**
 * Define UserList, a React component of CS142 Project 5.
 */
function UserList(){
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchedUsers = window.cs142models.userListModel();
    setUsers(fetchedUsers);
  }, []);

  return (
    <List component="nav" aria-label="user list" className="nav-list">
      {users.map(user => (
        <React.Fragment key={user._id}>
          <ListItem component={Link} to={`/users/${user._id}`}>
            <ListItemButton className="list-item-button">
              <ListItemText primary={`${user.first_name} ${user.last_name}`}/>
            </ListItemButton>
          </ListItem>
          <Divider className="divider"/>
        </React.Fragment>
      ))}
    </List>
  );
}

export default UserList;
