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
import axios from "axios";

import "./styles.css";

/**
 * Define UserList, a React component of CS142 Project 5.
 */
function UserList(){
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("/user/list")
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error("Fail to fetch userlist: ", error);
      })
  }, []);

  return (
    <List component="nav" aria-label="user list" className="nav-list">
      {users.map(user => (
        <React.Fragment key={user._id}>
          <ListItem component={Link} to={`/users/${user._id}`}>
            <ListItemButton className="list-item-button">
              <ListItemText primary={`${user.full_name}`}/>
            </ListItemButton>
          </ListItem>
          <Divider className="divider"/>
        </React.Fragment>
      ))}
    </List>
  );
}

export default UserList;
