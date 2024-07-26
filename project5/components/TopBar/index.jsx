import React, {useEffect, useState} from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useLocation, useParams } from 'react-router-dom';
import fetchModel from "../../lib/fetchModelData";

import "./styles.css";

/**
 * Define TopBar, a React component of CS142 Project 5.
 */

const determineContext = (location, user) => {
  const path = location.pathname;
  let userName;

  userName = user ? `${user.first_name} ${user.last_name}` : " ";

  if (path.includes("/photos/")){
    return `Photos of ${userName}`
  }else{
    return userName;
  }

}

const TopBar = () => {
  const location = useLocation();
  const userId = location.pathname.split('/')[2];
  const [user, setUser] = useState(null);
  const [rightSideText, setRightSideText]= useState("");

  useEffect(() => {
    if (userId){
      fetchModel(`/user/${userId}`)
        .then(response => {
          setUser(response.data);
          setRightSideText(determineContext(location, response.data));
        })
        .catch(error => {
          console.error("Fail to fetch user: ", error);
          setUser(null);
          setRightSideText("Fail to load user data");
        });
    }
  }, [userId, location]);

  return (
    <AppBar className="cs142-topbar-appBar" position="absolute">
      <Toolbar>
        <Typography variant="h5" color="inherit">
          My Name~~
        </Typography>
        <Typography variant="h5">
          {rightSideText}
        </Typography>
      </Toolbar>
    </AppBar>
  );
} 


export default TopBar;
