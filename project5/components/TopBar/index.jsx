import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useLocation, useParams } from 'react-router-dom';

import "./styles.css";

/**
 * Define TopBar, a React component of CS142 Project 5.
 */

const determineContext = (location, userId) => {
  const path = location.pathname;
  let userName;

  const user = window.cs142models.userModel(userId);
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

  const rightSideText = determineContext(location, userId);

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
