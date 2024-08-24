import React, {useEffect, useState} from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  ListItemButton,
  Avatar
} from "@mui/material";
import {Link} from "react-router-dom"
import axios from "axios";

import "./styles.css";

/**
 * Define UserList, a React component of CS142 Project 5.
 */
function UserList(){
  const [userActivities, setUserActivities] = useState([]);

  const fetchUserActivities = async() => {
    try{
      const response = await axios.get("/users/activity");
      setUserActivities(response.data);
    } catch (error){
      console.error("Failed to fetch user activities: ", error);
    }
  };

  useEffect(() => {
    fetchUserActivities();
    const intervalId = setInterval(fetchUserActivities, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <List component="nav" aria-label="user list" className="nav-list">
      {userActivities.map(({user, activity}) => (
        <React.Fragment key={user._id}>
          <ListItem component={Link} to={`/users/${user._id}`}>
            <ListItemButton className="list-item-button">
              <ListItemText 
                primary={`${user.full_name}`}
                secondary={activity ? (
                  <>
                    {activity.activity_type ===  1 && (
                      <>
                        uploaded a photo
                        {
                          activity.photo_id && (
                            <Avatar
                              src={`../../images/${activity.photo_id.file_name}`}
                              variant="square"
                            />
                          )
                        }
                      </>
                    )}
                    {activity.activity_type === 2 && "posted a comment"}
                    {activity.activity_type === 3 && "registered"}
                    {activity.activity_type === 4 && "logged in"}
                    {activity.activity_type === 5 && "logged out"}
                  </>
                ) : ("No recent activity")}
                />
            </ListItemButton>
          </ListItem>
          <Divider className="divider"/>
        </React.Fragment>
      ))}
    </List>
  );
}

export default UserList;
